<script setup lang="ts">
import type { DataRow, GridColumn } from '~/types/platform'
type DrawerTab = 'summary' | 'details' | 'documents' | 'activities' | 'history'

const props = withDefaults(defineProps<{
  row: DataRow | null
  columns: GridColumn[]
  module: string
  duplicating?: boolean
}>(), { duplicating: false })
const emit = defineEmits<{ close: []; delete: []; duplicate: [] }>()
const activeTab = ref<DrawerTab>('summary')
const tabs: Array<{ key: DrawerTab; label: string }> = [
  { key: 'summary', label: 'Summary' },
  { key: 'details', label: 'Details' },
  { key: 'documents', label: 'Documents' },
  { key: 'activities', label: 'Activities' },
  { key: 'history', label: 'History' },
]
const title = computed(() => {
  const row = props.row
  if (!row) return ''
  return String(row.customerName || row.vendorName || row.projectName || row.company || row.name || row.documentName || row[props.columns[1]?.key] || row[props.columns[0]?.key] || 'Record')
})
const recordId = computed(() => props.row ? String(props.row[props.columns[0]?.key] || props.row.id || 'Record') : '')
const status = computed(() => props.row ? String(props.row.status || props.row.approval || 'Active') : '')
const initials = computed(() => title.value.split(/\s+/).slice(0, 2).map(item => item[0]).join('').toUpperCase())
const dataColumns = computed(() => props.columns.filter(column => column.key !== '__detail'))
const documentColumns = computed(() => dataColumns.value.filter((column) => {
  if (!props.row) return false
  const value = props.row[column.key]
  return /document|attachment|file|url/i.test(`${column.key} ${column.title}`)
    && value !== null
    && value !== undefined
    && String(value).trim() !== ''
}))
const createdDate = computed(() => props.row?.createdAt || props.row?.createdDate || props.row?.date || '')
const updatedDate = computed(() => props.row?.updatedAt || '')
const assignedTo = computed(() => props.row?.assignedTo || props.row?.owner || props.row?.pic || props.row?.projectManager || '')

const format = (value: unknown, column: GridColumn) => {
  if (value == null || value === '') return '—'
  if (column.type === 'currency') return `Rp ${Number(value).toLocaleString('en-US')}`
  if (column.type === 'percent' || column.type === 'progress') return `${Number(value).toLocaleString('en-US')}%`
  if (column.type === 'checkbox') return value ? 'Yes' : 'No'
  return String(value)
}

const formatDate = (value: unknown) => {
  if (!value) return '—'
  const date = new Date(String(value))
  return Number.isNaN(date.getTime())
    ? String(value)
    : date.toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })
}

watch(() => props.row?.id, () => { activeTab.value = 'summary' })
</script>
<template>
  <Teleport to="body">
    <div v-if="row" class="detail-drawer-overlay show" @click="emit('close')" />
    <aside v-if="row" class="detail-drawer show">
      <div class="drawer-head">
        <div class="drawer-avatar">{{ initials }}</div>
        <div class="drawer-title"><small>{{ recordId }}</small><h2>{{ title }}</h2><p>{{ module }} · {{ status }}</p></div>
        <button class="drawer-close" type="button" @click="emit('close')">×</button>
      </div>
      <div class="drawer-tabs" role="tablist" aria-label="Record information">
        <button
          v-for="tab in tabs"
          :key="tab.key"
          type="button"
          role="tab"
          :class="{ active: activeTab === tab.key }"
          :aria-selected="activeTab === tab.key"
          @click="activeTab = tab.key"
        >{{ tab.label }}</button>
      </div>
      <div class="drawer-body">
        <template v-if="activeTab === 'summary'">
          <div class="drawer-section">
            <h3>Record Summary</h3>
            <div class="drawer-fields">
              <div v-for="column in dataColumns.slice(0, 10)" :key="column.key" class="drawer-field"><span>{{ column.title }}</span><b>{{ format(row[column.key], column) }}</b></div>
            </div>
          </div>
          <div class="drawer-section">
            <h3>Auditability</h3>
            <div class="drawer-fields"><div class="drawer-field"><span>Created Date</span><b>{{ formatDate(createdDate) }}</b></div><div class="drawer-field"><span>Updated Date</span><b>{{ formatDate(updatedDate) }}</b></div></div>
          </div>
        </template>

        <div v-else-if="activeTab === 'details'" class="drawer-section">
          <h3>Complete Record Details</h3>
          <div class="drawer-fields">
            <div v-for="column in dataColumns" :key="column.key" class="drawer-field"><span>{{ column.title }}</span><b>{{ format(row[column.key], column) }}</b></div>
          </div>
        </div>

        <div v-else-if="activeTab === 'documents'" class="drawer-section">
          <h3>Linked Documents</h3>
          <div v-if="documentColumns.length" class="drawer-document-list">
            <div v-for="column in documentColumns" :key="column.key" class="drawer-document">
              <span><AppIcon name="file" /></span>
              <div><b>{{ format(row[column.key], column) }}</b><small>{{ column.title }}</small></div>
            </div>
          </div>
          <div v-else class="drawer-empty"><AppIcon name="file" /><b>No linked documents</b><span>Documents attached to this record will appear here.</span></div>
        </div>

        <div v-else-if="activeTab === 'activities'" class="drawer-section">
          <h3>Recent Activities</h3>
          <div class="drawer-timeline">
            <div class="drawer-timeline-item current"><i></i><div><b>Status is {{ status }}</b><span>Current record status</span></div></div>
            <div v-if="assignedTo" class="drawer-timeline-item"><i></i><div><b>Assigned to {{ assignedTo }}</b><span>Responsible person for this record</span></div></div>
            <div v-if="updatedDate" class="drawer-timeline-item"><i></i><div><b>Record updated</b><span>{{ formatDate(updatedDate) }}</span></div></div>
            <div class="drawer-timeline-item"><i></i><div><b>Record created</b><span>{{ formatDate(createdDate) }}</span></div></div>
          </div>
        </div>

        <div v-else class="drawer-section">
          <h3>Change History</h3>
          <div class="drawer-history">
            <div><span>Current state</span><b>{{ status }}</b><small>{{ formatDate(updatedDate || createdDate) }}</small></div>
            <div v-if="updatedDate"><span>Last updated</span><b>Record information changed</b><small>{{ formatDate(updatedDate) }}</small></div>
            <div><span>Created</span><b>Record added to {{ module }}</b><small>{{ formatDate(createdDate) }}</small></div>
          </div>
        </div>
      </div>
      <div class="drawer-actions"><button class="primary" type="button">Edit</button><button type="button" :disabled="duplicating" @click="emit('duplicate')">{{ duplicating ? 'Duplicating…' : 'Duplicate' }}</button><button class="danger" type="button" @click="emit('delete')">Delete</button></div>
    </aside>
  </Teleport>
</template>
