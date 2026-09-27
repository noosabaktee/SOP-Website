<script setup lang="ts">
import type { PageConfig } from '~/types/platform'
const props = defineProps<{ page: PageConfig; routePath: string }>()
type GridActions = { load: () => Promise<unknown>; save: () => Promise<void>; create: () => Promise<void>; exportCsv: () => void; triggerImport: () => void; print: () => void }
const grid = ref<GridActions | null>(null)
const { showToast } = useToast()
const primary = computed(() => props.page.title === 'Approved' ? 'Create Sales Order' : props.page.title === 'Expired' ? 'Renew Quotation' : props.routePath === '/purchase/orders' ? 'Create PO' : props.routePath === '/sales/invoices' ? 'Create Invoice' : props.routePath === '/sales/orders' ? 'Create Sales Order' : 'Create')
</script>
<template>
  <PageActions :primary-label="primary" @create="grid?.create()" @refresh="grid?.load()" @export="grid?.exportCsv()" @import="grid?.triggerImport()" @filter="showToast('Use the search and status filters below.')" @more="grid?.print()" />
  <KpiCards :labels="page.kpis" />
  <DataGridSection ref="grid" :page="page" :route-path="routePath" />
</template>
