<script setup lang="ts">
import { gridSchemas } from '~/config/platform'
import type { DataRow, GridColumn, PageConfig } from '~/types/platform'
import { downloadCsv, parseCsv } from '~/utils/csv'
import { recalculateRow } from '~/utils/gridFormula'

const props = withDefaults(defineProps<{
  page: PageConfig
  routePath: string
  columns?: GridColumn[]
  readOnly?: boolean
  title?: string
}>(), { readOnly: false })

const emit = defineEmits<{ loaded: [DataRow[]] }>()
const { showToast } = useToast()
const { rows, pending, error, fetchRows, createRow, updateRow, deleteRow } = useResourceGrid(props.routePath)
const search = ref('')
const status = ref('')
const selected = ref<DataRow | null>(null)
const detailRow = ref<DataRow | null>(null)
const dirty = ref(new Set<string>())
const confirmDelete = ref(false)
const duplicating = ref(false)
const fileInput = ref<HTMLInputElement | null>(null)

const effectiveColumns = computed(() => props.columns || gridSchemas[props.page.schema] || gridSchemas.generic || [])
const displayColumns = computed<GridColumn[]>(() => [
  ...effectiveColumns.value,
  { key: '__detail', title: 'Detail', type: 'detail', editable: false, width: 74 },
])
const filtered = computed(() => {
  const query = search.value.toLowerCase().trim()
  const quickStatus = status.value.toLowerCase().trim()
  return rows.value.filter(row => {
    const matchesSearch = !query || JSON.stringify(row).toLowerCase().includes(query)
    const currentStatus = String(row.status || row.approval || '').toLowerCase()
    const matchesStatus = !quickStatus || currentStatus.includes(quickStatus)
    return matchesSearch && matchesStatus
  })
})

const load = async () => {
  const result = await fetchRows()
  emit('loaded', result.data)
}

onMounted(load)
watch(() => props.routePath, load)

const onChange = (changes: unknown) => {
  if (!Array.isArray(changes)) return
  for (const change of changes) {
    if (!Array.isArray(change)) continue
    const index = Number(change[0])
    const row = filtered.value[index]
    if (!row) continue
    recalculateRow(row, effectiveColumns.value)
    if (row.id) dirty.value.add(String(row.id))
  }
  dirty.value = new Set(dirty.value)
}

const save = async () => {
  const changed = rows.value.filter(row => row.id && dirty.value.has(String(row.id)))
  for (const row of changed) await updateRow(String(row.id), row)
  dirty.value.clear()
  dirty.value = new Set()
  showToast(changed.length ? `${changed.length} record(s) saved.` : 'No unsaved changes.')
}

const create = async () => {
  const draft: DataRow = {}
  for (const column of effectiveColumns.value) {
    if (column.formula || column.editable === false) continue
    if (['number', 'currency', 'percent', 'progress'].includes(column.type)) draft[column.key] = 0
    else if (column.type === 'checkbox') draft[column.key] = false
    else draft[column.key] = ''
  }
  recalculateRow(draft, effectiveColumns.value)
  const result = await createRow(draft) as { data?: DataRow }
  if (result?.data) rows.value.unshift(result.data)
  showToast('Record created. Edit the new row, then save changes.')
}

const requestDelete = () => {
  if (!selected.value?.id) return showToast('Select a record first.')
  confirmDelete.value = true
}

const confirmDeleteSelected = async () => {
  if (!selected.value?.id) return
  await deleteRow(String(selected.value.id))
  rows.value = rows.value.filter(row => String(row.id) !== String(selected.value?.id))
  if (String(detailRow.value?.id) === String(selected.value?.id)) detailRow.value = null
  selected.value = null
  confirmDelete.value = false
  showToast('Record deleted.')
}

const exportCsv = () => {
  downloadCsv(`${props.page.title.replaceAll(/[^a-z0-9]+/gi, '-').toLowerCase()}.csv`, filtered.value, effectiveColumns.value)
  showToast('CSV export prepared.')
}

const triggerImport = () => fileInput.value?.click()
const onImportFile = async (event: Event) => {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return
  if (!file.name.toLowerCase().endsWith('.csv')) {
    showToast('CSV import is supported in this migration build.')
    input.value = ''
    return
  }
  const imported = parseCsv(await file.text(), effectiveColumns.value)
  let count = 0
  for (const row of imported) {
    recalculateRow(row, effectiveColumns.value)
    await createRow(row)
    count++
  }
  input.value = ''
  await load()
  showToast(`${count} row(s) imported.`)
}

const clearFilters = () => { search.value = ''; status.value = '' }
const print = () => { if (import.meta.client) window.print() }
const requestDetailDelete = () => {
  if (!detailRow.value) return
  selected.value = detailRow.value
  requestDelete()
}

const nextIdentifier = (key: string, currentValue: unknown) => {
  const current = String(currentValue || '')
  const match = current.match(/^([A-Za-z]+(?:[-/]\d+)*[-/]?)(\d+)$/)
  if (!match) return undefined
  const [, prefix, number] = match
  const highest = rows.value.reduce((max, row) => {
    const candidate = String(row[key] || '').match(/^([A-Za-z]+(?:[-/]\d+)*[-/]?)(\d+)$/)
    return candidate && candidate[1] === prefix ? Math.max(max, Number(candidate[2])) : max
  }, Number(number))
  return `${prefix}${String(highest + 1).padStart(number.length, '0')}`
}

const duplicateDetail = async () => {
  if (!detailRow.value || duplicating.value) return
  duplicating.value = true
  try {
    const source = detailRow.value
    const duplicate: DataRow = { ...source }
    const generatedId = nextIdentifier('id', source.id)
    if (generatedId) duplicate.id = generatedId
    else delete duplicate.id
    delete duplicate.createdAt
    delete duplicate.updatedAt

    const primaryKey = effectiveColumns.value[0]?.key
    if (primaryKey && primaryKey !== 'id' && /(?:id|code|no|number)$/i.test(primaryKey)) {
      const generatedPrimary = nextIdentifier(primaryKey, source[primaryKey])
      if (generatedPrimary) duplicate[primaryKey] = generatedPrimary
    }

    const result = await createRow(duplicate) as { data?: DataRow }
    if (!result?.data) throw new Error('The duplicated record was not returned by the server.')
    rows.value.unshift(result.data)
    selected.value = result.data
    detailRow.value = result.data
    showToast('Record duplicated successfully.')
  } catch (duplicateError) {
    showToast(duplicateError instanceof Error ? duplicateError.message : 'Unable to duplicate record.')
  } finally {
    duplicating.value = false
  }
}

const onSaveShortcut = () => save()
onMounted(() => window.addEventListener('sop:save', onSaveShortcut))
onBeforeUnmount(() => { if (import.meta.client) window.removeEventListener('sop:save', onSaveShortcut) })

defineExpose({ load, save, create, requestDelete, exportCsv, triggerImport, clearFilters, print })
</script>

<template>
  <section v-if="selected" class="bulk-bar show"><strong>1</strong> row selected
    <button type="button" @click="showToast('Approve action applied.')">Approve</button>
    <button type="button" @click="showToast('Reject action applied.')">Reject</button>
    <button type="button" @click="exportCsv">Export</button>
    <button type="button" @click="showToast('Assign action ready.')">Assign</button>
    <button type="button" @click="showToast('Status action ready.')">Change Status</button>
    <button type="button" @click="print">Print</button>
    <button class="danger" type="button" @click="requestDelete">Delete</button>
  </section>
  <section class="platform-card platform-grid-card">
    <div class="platform-card-head">
      <div><h2>{{ title || `${page.title} Data` }}</h2><p>Editable operational data with validation, copy/paste, export, and audit-ready detail.</p></div>
      <div class="card-tools">
        <button class="card-tool save-changes-btn" type="button" :disabled="dirty.size === 0" @click="save">
          <AppIcon name="save" />
          <span>Save Changes</span>
        </button>
      </div>
    </div>
    <div class="grid-toolbar">
      <label class="grid-search"><AppIcon name="search" /><input v-model="search" type="search" placeholder="Search this dataset..."></label>
      <select v-model="status" class="grid-filter"><option value="">All Status</option><option>Active</option><option>Approved</option><option>Pending</option><option>Completed</option><option>Draft</option></select>
      <button class="card-tool" type="button" @click="clearFilters">Clear Filters</button>
      <button v-if="!readOnly" class="card-tool" type="button" @click="requestDelete">Delete Selected</button>
      <input ref="fileInput" type="file" accept=".csv" hidden @change="onImportFile">
    </div>
    <div class="grid-shell">
      <div v-if="pending" class="platform-grid-loading">Loading data…</div>
      <div v-else-if="error" class="error-state"><div><AppIcon name="warning" /><h3>Unable to load data</h3><p>{{ error }}</p><button class="pa-btn primary" type="button" @click="load">Retry</button></div></div>
      <div v-else-if="filtered.length === 0" class="empty-state" style="display:grid"><div><AppIcon name="search" /><h3>No records found</h3><p>Try changing your filters or create a new record.</p><div class="state-actions"><button class="pa-btn" type="button" @click="clearFilters">Clear Filters</button><button v-if="!readOnly" class="pa-btn primary" type="button" @click="create">Create</button></div></div></div>
      <AppDataGrid v-else :rows="filtered" :columns="displayColumns" :read-only="readOnly" @change="onChange" @select="selected = $event" @detail="detailRow = $event" />
    </div>
    <footer class="grid-footer"><span>Showing {{ filtered.length }} of {{ rows.length }} records</span><div class="page-buttons"><button>‹</button><button class="active">1</button><button>2</button><button>3</button><button>›</button></div></footer>
  </section>
  <RecordDrawer :row="detailRow" :columns="effectiveColumns" :module="page.module" :duplicating="duplicating" @close="detailRow = null" @duplicate="duplicateDetail" @delete="requestDetailDelete" />
  <ConfirmDialog :open="confirmDelete" title="Delete selected record?" message="This action removes the selected record from the JSON data layer." @cancel="confirmDelete = false" @confirm="confirmDeleteSelected" />
</template>
