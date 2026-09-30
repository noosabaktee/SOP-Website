<script setup lang="ts">
import type { DataGridActions, PageConfig } from '~/types/platform'

defineProps<{ page: PageConfig; routePath: string }>()
const grid = ref<DataGridActions | null>(null)
const { showToast } = useToast()
</script>

<template>
  <PageActions primary-label="Update Progress" @create="grid?.save()" @import="grid?.triggerImport()" @export="grid?.exportCsv()" @filter="showToast('Gunakan pencarian dan filter tabel di bawah.')" @refresh="grid?.load()" @more="grid?.print()" />
  <section class="report-layout"><article class="platform-card report-chart"><div class="platform-card-head"><h2>S-Curve — Planned vs Actual</h2></div><div class="line-chart"><svg viewBox="0 0 500 180" preserveAspectRatio="none"><polyline class="planned" points="0,165 70,150 140,130 210,100 280,75 350,45 420,20 500,3" /><polyline class="actual" points="0,165 70,155 140,138 210,112 280,88 350,61 420,38 500,20" /></svg></div></article><article class="platform-card report-chart"><div class="platform-card-head"><h2>Variance</h2></div><div class="bar-report"><div v-for="(height, index) in [20, 32, 45, 38, 55, 62]" :key="index" class="rbar" :style="{ height: `${height * 2}px` }"><span>P{{ index + 1 }}</span></div></div></article></section>
  <DataGridSection ref="grid" :page="page" :route-path="routePath" />
</template>
