<script setup lang="ts">
import type { DataRow, GridColumn } from '~/types/platform'
const props = defineProps<{ row: DataRow | null; columns: GridColumn[]; module: string }>()
const emit = defineEmits<{ close: []; delete: [] }>()
const title = computed(() => {
  const row = props.row
  if (!row) return ''
  return String(row.customerName || row.vendorName || row.projectName || row.company || row.name || row.documentName || row[props.columns[1]?.key] || row[props.columns[0]?.key] || 'Record')
})
const recordId = computed(() => props.row ? String(props.row[props.columns[0]?.key] || props.row.id || 'Record') : '')
const status = computed(() => props.row ? String(props.row.status || props.row.approval || 'Active') : '')
const initials = computed(() => title.value.split(/\s+/).slice(0, 2).map(item => item[0]).join('').toUpperCase())
const printRecord = () => { if (import.meta.client) window.print() }
const format = (value: unknown, column: GridColumn) => {
  if (value == null) return '—'
  if (column.type === 'currency') return `Rp ${Number(value).toLocaleString('en-US')}`
  if (column.type === 'percent' || column.type === 'progress') return `${Number(value).toLocaleString('en-US')}%`
  return String(value)
}
</script>
<template>
  <Teleport to="body">
    <div v-if="row" class="drawer-overlay show" @click="emit('close')" />
    <aside v-if="row" class="detail-drawer show">
      <div class="drawer-head">
        <div class="drawer-avatar">{{ initials }}</div>
        <div class="drawer-title"><small>{{ recordId }}</small><h2>{{ title }}</h2><p>{{ module }} · {{ status }}</p></div>
        <button class="drawer-close" type="button" @click="emit('close')">×</button>
      </div>
      <div class="drawer-tabs"><button class="active">Summary</button><button>Details</button><button>Documents</button><button>Activities</button><button>History</button></div>
      <div class="drawer-body">
        <div class="drawer-section"><h3>Record Details</h3><div class="drawer-fields"><div v-for="column in columns.slice(0, 10)" :key="column.key" class="drawer-field"><span>{{ column.title }}</span><b>{{ format(row[column.key], column) }}</b></div></div></div>
        <div class="drawer-section"><h3>Auditability</h3><div class="drawer-fields"><div class="drawer-field"><span>Created Date</span><b>{{ row.createdAt || '—' }}</b></div><div class="drawer-field"><span>Updated Date</span><b>{{ row.updatedAt || '—' }}</b></div></div></div>
      </div>
      <div class="drawer-actions"><button class="primary" type="button">Edit</button><button type="button">Duplicate</button><button type="button" @click="printRecord">Print</button><button class="danger" type="button" @click="emit('delete')">Delete</button></div>
    </aside>
  </Teleport>
</template>
