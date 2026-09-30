<script setup lang="ts">
import { gridSchemas } from '~/config/platform'
import type { DataRow, GridColumn, PageConfig } from '~/types/platform'
import { downloadCsv } from '~/utils/csv'
import { parseExcelFile } from '~/utils/excel'
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
const { optionsByColumn, fetchOptions, createOption } = useGridOptions(props.routePath)
const search = ref('')
const filterValue = ref('')
const selected = ref<DataRow | null>(null)
const detailRow = ref<DataRow | null>(null)
const dirty = ref(new Set<string>())
const confirmDelete = ref(false)
const duplicating = ref(false)
const fileInput = ref<HTMLInputElement | null>(null)
const gridRevision = ref(0)
const creating = ref(false)
const importing = ref(false)

const effectiveColumns = computed(() => props.columns || gridSchemas[props.page.schema] || gridSchemas.generic || [])
const displayColumns = computed<GridColumn[]>(() => [
  ...effectiveColumns.value,
  { key: '__detail', title: 'Detail', type: 'detail', editable: false, width: 74 },
])
const filterColumn = computed(() => {
  const selectColumns = effectiveColumns.value.filter(column => column.type === 'status' || column.type === 'dropdown')
  return selectColumns.find(column => column.key === 'status')
    || selectColumns.find(column => column.key === 'approval')
    || selectColumns.find(column => /status|stage|condition|qualification|priority/i.test(`${column.key} ${column.title}`))
    || selectColumns[0]
})
const filterOptions = computed(() => {
  const column = filterColumn.value
  if (!column) return []
  const values = rows.value.map(row => String(row[column.key] ?? '').trim()).filter(Boolean)
  return values.filter((value, index) => values.findIndex(candidate => candidate.toLocaleLowerCase() === value.toLocaleLowerCase()) === index)
})
const filtered = computed(() => {
  const query = search.value.toLowerCase().trim()
  const quickFilter = filterValue.value.toLowerCase().trim()
  const column = filterColumn.value
  return rows.value.filter(row => {
    const matchesSearch = !query || JSON.stringify(row).toLowerCase().includes(query)
    const currentValue = column ? String(row[column.key] ?? '').toLowerCase().trim() : ''
    const matchesFilter = !quickFilter || currentValue === quickFilter
    return matchesSearch && matchesFilter
  })
})

const refreshGrid = async () => {
  gridRevision.value++
  await nextTick()
  emit('loaded', [...rows.value])
}

const load = async () => {
  await Promise.all([
    fetchRows(),
    props.readOnly ? Promise.resolve([]) : fetchOptions().catch(() => []),
  ])
  await refreshGrid()
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

const onOptionCreate = async (payload: { columnKey: string; columnTitle: string; value: string; color: string }) => {
  try {
    await createOption(payload.columnKey, payload.value, payload.color)
    showToast(`Pilihan “${payload.value}” ditambahkan ke ${payload.columnTitle}.`)
  } catch (optionError) {
    showToast(optionError instanceof Error ? optionError.message : 'Pilihan baru belum dapat disimpan.')
  }
}

const save = async () => {
  const changed = rows.value.filter(row => row.id && dirty.value.has(String(row.id)))
  for (const row of changed) {
    const result = await updateRow(String(row.id), row) as { data?: DataRow }
    if (result?.data) Object.assign(row, result.data)
  }
  dirty.value.clear()
  dirty.value = new Set()
  showToast(changed.length ? `${changed.length} record(s) saved.` : 'No unsaved changes.')
}

const create = async () => {
  if (creating.value) return
  creating.value = true
  const draft: DataRow = {}
  for (const column of effectiveColumns.value) {
    if (column.formula || column.editable === false) continue
    if (['number', 'currency', 'percent', 'progress'].includes(column.type)) draft[column.key] = 0
    else if (column.type === 'checkbox') draft[column.key] = false
    else draft[column.key] = ''
  }
  recalculateRow(draft, effectiveColumns.value)
  const clientToken = `create-${Date.now()}-${Math.random().toString(36).slice(2)}`
  draft.__clientToken = clientToken
  search.value = ''
  filterValue.value = ''
  rows.value.unshift(draft)
  await refreshGrid()

  try {
    const payload = { ...draft }
    delete payload.__clientToken
    const result = await createRow(payload) as { data?: DataRow }
    if (!result?.data) throw new Error('Server tidak mengembalikan data baru.')
    const index = rows.value.findIndex(row => row.__clientToken === clientToken)
    if (index >= 0) rows.value[index] = { ...draft, ...result.data, __clientToken: undefined }
    await refreshGrid()
    showToast('Record langsung ditambahkan. Lengkapi data lalu simpan perubahan.')
  } catch (createError) {
    rows.value = rows.value.filter(row => row.__clientToken !== clientToken)
    await refreshGrid()
    showToast(createError instanceof Error ? createError.message : 'Record baru gagal dibuat.')
  } finally {
    creating.value = false
  }
}

const requestDelete = () => {
  if (!selected.value?.id) return showToast('Select a record first.')
  confirmDelete.value = true
}

const confirmDeleteSelected = async () => {
  if (!selected.value?.id) return
  const target = selected.value
  const id = String(target.id)
  const index = rows.value.findIndex(row => String(row.id) === id)
  if (index < 0) return
  rows.value.splice(index, 1)
  if (String(detailRow.value?.id) === id) detailRow.value = null
  selected.value = null
  confirmDelete.value = false
  await refreshGrid()

  try {
    await deleteRow(id)
    dirty.value.delete(id)
    dirty.value = new Set(dirty.value)
    showToast('Record langsung dihapus.')
  } catch (deleteError) {
    rows.value.splice(index, 0, target)
    await refreshGrid()
    showToast(deleteError instanceof Error ? deleteError.message : 'Penghapusan gagal. Data dikembalikan.')
  }
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
  if (!file.name.toLowerCase().endsWith('.xlsx')) {
    showToast('Gunakan file Excel dengan format .xlsx.')
    input.value = ''
    return
  }
  if (importing.value) return
  importing.value = true
  try {
    const imported = await parseExcelFile(file, effectiveColumns.value)
    const batchToken = `import-${Date.now()}-`
    imported.forEach((row, index) => {
      recalculateRow(row, effectiveColumns.value)
      row.__clientToken = `${batchToken}${index}`
    })
    search.value = ''
    filterValue.value = ''
    rows.value.unshift(...imported)
    await refreshGrid()

    let importedCount = 0
    let failedCount = 0
    for (const row of imported) {
      const token = String(row.__clientToken)
      try {
        const payload = { ...row }
        delete payload.__clientToken
        const result = await createRow(payload) as { data?: DataRow }
        if (!result?.data) throw new Error('Import response is empty')
        const index = rows.value.findIndex(item => item.__clientToken === token)
        if (index >= 0) rows.value[index] = result.data
        importedCount++
      } catch {
        rows.value = rows.value.filter(item => item.__clientToken !== token)
        failedCount++
      }
    }
    await refreshGrid()
    showToast(failedCount
      ? `${importedCount} baris berhasil, ${failedCount} baris gagal diimport.`
      : `${importedCount} baris Excel berhasil diimport.`)
  } catch (importError) {
    showToast(importError instanceof Error ? importError.message : 'File Excel gagal diimport.')
  } finally {
    importing.value = false
    input.value = ''
  }
}

const clearFilters = () => { search.value = ''; filterValue.value = '' }
watch([search, filterValue], () => {
  if (selected.value && !filtered.value.includes(selected.value)) selected.value = null
})
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
    await refreshGrid()
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
      <select v-if="filterColumn" v-model="filterValue" class="grid-filter" :aria-label="`Filter ${filterColumn.title}`">
        <option value="">All {{ filterColumn.title }}</option>
        <option v-for="option in filterOptions" :key="option" :value="option">{{ option }}</option>
      </select>
      <button class="card-tool" type="button" @click="clearFilters">Clear Filters</button>
      <button v-if="!readOnly" class="card-tool" type="button" @click="requestDelete">Delete Selected</button>
      <input ref="fileInput" type="file" accept=".xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" hidden @change="onImportFile">
    </div>
    <div class="grid-shell">
      <div v-if="pending" class="platform-grid-loading">Loading data…</div>
      <div v-else-if="error" class="error-state"><div><AppIcon name="warning" /><h3>Unable to load data</h3><p>{{ error }}</p><button class="pa-btn primary" type="button" @click="load">Retry</button></div></div>
      <div v-else-if="filtered.length === 0" class="empty-state" style="display:grid"><div><AppIcon name="search" /><h3>No records found</h3><p>Try changing your filters or create a new record.</p><div class="state-actions"><button class="pa-btn" type="button" @click="clearFilters">Clear Filters</button><button v-if="!readOnly" class="pa-btn primary" type="button" @click="create">Create</button></div></div></div>
      <AppDataGrid
        :key="gridRevision"
        v-else
        :rows="filtered"
        :columns="displayColumns"
        :read-only="readOnly"
        :custom-options="optionsByColumn"
        @change="onChange"
        @select="selected = $event"
        @detail="detailRow = $event"
        @option-create="onOptionCreate"
      />
    </div>
    <footer class="grid-footer"><span>Showing {{ filtered.length }} of {{ rows.length }} records</span><div class="page-buttons"><button>‹</button><button class="active">1</button><button>2</button><button>3</button><button>›</button></div></footer>
  </section>
  <RecordDrawer :row="detailRow" :columns="effectiveColumns" :module="page.module" :duplicating="duplicating" @close="detailRow = null" @duplicate="duplicateDetail" @delete="requestDetailDelete" />
  <ConfirmDialog :open="confirmDelete" title="Delete selected record?" message="This action removes the selected record from the JSON data layer." @cancel="confirmDelete = false" @confirm="confirmDeleteSelected" />
</template>
