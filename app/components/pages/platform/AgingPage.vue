<script setup lang="ts">
import type { PageConfig } from '~/types/platform'
defineProps<{ page: PageConfig; routePath: string }>()
const bars = [85,62,44,28,19]
const amounts = ['Rp 1.82B','Rp 760M','Rp 420M','Rp 215M','Rp 145M']
const labels = ['Current','1-30','31-60','61-90','>90']
const exposure = [72,58,47,34,25]
const customers = ['ABC','Kalbe','Uniguard','Dankos','Cimory']
const { showToast } = useToast()
</script>
<template>
  <PageActions primary-label="Create Collection Task" @create="showToast('Collection task ready.')" @export="showToast('AR aging export prepared.')" @refresh="showToast('AR aging refreshed.')" @import="showToast('Import available from the grid toolbar.')" @filter="showToast('Use grid filters below.')" @more="showToast('More actions.')" />
  <KpiCards :labels="page.kpis" />
  <section class="report-layout"><article class="platform-card report-chart"><div class="platform-card-head"><h2>AR Aging</h2></div><div class="bar-report"><div v-for="(height,index) in bars" :key="labels[index]" class="rbar" :style="{height:`${height*2}px`}"><b>{{amounts[index]}}</b><span>{{labels[index]}}</span></div></div></article><article class="platform-card report-chart"><div class="platform-card-head"><h2>Customer Aging Exposure</h2></div><div class="bar-report"><div v-for="(height,index) in exposure" :key="customers[index]" class="rbar" :style="{height:`${height*2}px`}"><span>{{customers[index]}}</span></div></div></article></section>
  <DataGridSection :page="page" :route-path="routePath" />
</template>
