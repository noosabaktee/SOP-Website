<script setup lang="ts">
import type { GridColumn, PageConfig } from '~/types/platform'

type GridActions = {
  load: () => Promise<unknown>
  create: () => Promise<void>
  exportCsv: () => void
  triggerImport: () => void
  print: () => void
}

const grid = ref<GridActions | null>(null)
const { showToast } = useToast()

const page: PageConfig = {
  title: 'Leads',
  description: 'Capture, track, and convert potential customers into valuable opportunities.',
  schema: 'leads',
  type: 'grid',
  module: 'CRM & Sales',
  prefix: 'LEAD',
  kpis: ['Total Leads', 'New Leads', 'In Progress', 'Converted', 'Lost'],
}

const columns: GridColumn[] = [
  { key: 'id', title: 'Lead ID', type: 'text', editable: false, width: 110 },
  { key: 'name', title: 'Lead Name', type: 'text', editable: true, required: true, width: 150 },
  { key: 'company', title: 'Company', type: 'text', editable: true, required: true, width: 185 },
  { key: 'email', title: 'Email', type: 'email', editable: true, width: 185 },
  { key: 'phone', title: 'Phone', type: 'text', editable: true, width: 145 },
  { key: 'source', title: 'Lead Source', type: 'dropdown', editable: true, width: 125, source: ['Website', 'Referral', 'Event', 'Cold Call', 'LinkedIn'] },
  { key: 'status', title: 'Status', type: 'status', editable: true, width: 145, source: ['New', 'Contacted', 'In Progress', 'Qualified', 'Nurturing', 'Proposal', 'Converted', 'Lost'] },
  { key: 'potentialValue', title: 'Potential Value', type: 'currency', editable: true, width: 150 },
  { key: 'assignedTo', title: 'Assigned To', type: 'dropdown', editable: true, width: 145, source: ['Budi Santoso', 'Sari Dewi', 'Andi Wijaya', 'Rina Marlina'] },
  { key: 'createdDate', title: 'Created Date', type: 'date', editable: false, width: 130 },
]

useHead({ title: 'SOP — CRM Leads' })
</script>

<template>
  <PageActions
    primary-label="Add Lead"
    @create="grid?.create()"
    @refresh="grid?.load()"
    @export="grid?.exportCsv()"
    @import="grid?.triggerImport()"
    @filter="showToast('Use the search and status filters below.')"
    @more="grid?.print()"
  />
  <KpiCards :labels="page.kpis" />
  <DataGridSection ref="grid" :page="page" route-path="/crm/leads" :columns="columns" title="Leads Data" />
</template>
