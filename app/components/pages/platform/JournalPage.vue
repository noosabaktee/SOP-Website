<script setup lang="ts">
import type { DataGridActions, DataRow, PageConfig } from '~/types/platform'

defineProps<{ page: PageConfig; routePath: string }>()
const grid = ref<DataGridActions | null>(null)
const { showToast } = useToast()
const data = ref<DataRow[]>([])
const debit = computed(() => data.value.reduce((sum, row) => sum + Number(row.debit || 0), 0))
const credit = computed(() => data.value.reduce((sum, row) => sum + Number(row.credit || 0), 0))
const money = (value: number) => `Rp ${value.toLocaleString('en-US')}`
</script>

<template>
  <PageActions primary-label="Post Journal" @create="showToast(debit === credit ? 'Journal is balanced and ready to post.' : 'Journal is not balanced.')" @import="grid?.triggerImport()" @export="grid?.exportCsv()" @filter="showToast('Gunakan pencarian dan filter tabel di bawah.')" @refresh="grid?.load()" @more="grid?.print()" />
  <section class="platform-kpis"><article v-for="metric in [['Total Debit', money(debit)], ['Total Credit', money(credit)], ['Difference', money(Math.abs(debit - credit))], ['Status', debit === credit ? 'Balanced' : 'Unbalanced']]" :key="metric[0]" class="platform-kpi"><span class="platform-kpi-icon blue"><AppIcon name="file" /></span><div><small>{{ metric[0] }}</small><strong>{{ metric[1] }}</strong><p>Calculated automatically</p></div></article></section>
  <DataGridSection ref="grid" :page="page" :route-path="routePath" @loaded="data = $event" />
</template>
