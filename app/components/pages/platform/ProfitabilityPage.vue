<script setup lang="ts">
import type { DataGridActions, PageConfig } from '~/types/platform'

defineProps<{ page: PageConfig; routePath: string }>()
const grid = ref<DataGridActions | null>(null)
const { showToast } = useToast()
const metrics = [['Revenue', 'Rp 4.10B'], ['Budget', 'Rp 3.20B'], ['Actual Cost', 'Rp 2.18B'], ['Gross Profit', 'Rp 1.92B'], ['Margin', '46.8%']]
</script>

<template>
  <PageActions primary-label="Recalculate" @create="grid?.save()" @import="grid?.triggerImport()" @export="grid?.exportCsv()" @filter="showToast('Gunakan pencarian dan filter tabel di bawah.')" @refresh="grid?.load()" @more="grid?.print()" />
  <section class="platform-kpis"><article v-for="(metric, index) in metrics" :key="metric[0]" class="platform-kpi"><span class="platform-kpi-icon" :class="['blue', 'orange', 'red', 'green', 'purple'][index]"><AppIcon name="chart" /></span><div><small>{{ metric[0] }}</small><strong>{{ metric[1] }}</strong><p>Connected project data</p></div></article></section>
  <DataGridSection ref="grid" :page="page" :route-path="routePath" />
</template>
