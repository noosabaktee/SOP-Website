<script setup lang="ts">
import type { DataGridActions, PageConfig } from '~/types/platform'

defineProps<{ page: PageConfig; routePath: string }>()
const grid = ref<DataGridActions | null>(null)
const { showToast } = useToast()
const modules = ['CRM & Sales', 'Quotation', 'Sales', 'Project', 'Purchase', 'Inventory', 'Finance & Accounting', 'Reports']
</script>

<template>
  <PageActions primary-label="Add User" @create="grid?.create()" @import="grid?.triggerImport()" @export="grid?.exportCsv()" @filter="showToast('Gunakan pencarian dan filter tabel di bawah.')" @refresh="grid?.load()" @more="grid?.print()" />
  <DataGridSection ref="grid" :page="page" :route-path="routePath" />
  <section class="platform-card platform-grid-card"><div class="platform-card-head"><h2>Role Permission Matrix</h2></div><div class="permission-matrix"><table><thead><tr><th>Module</th><th>View</th><th>Create</th><th>Edit</th><th>Delete</th><th>Approve</th><th>Export</th></tr></thead><tbody><tr v-for="(module, i) in modules" :key="module"><td>{{ module }}</td><td v-for="j in 6" :key="j"><input type="checkbox" :checked="j <= 3 || i < 2"></td></tr></tbody></table></div></section>
</template>
