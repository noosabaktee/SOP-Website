<script setup lang="ts">
import type { PageConfig } from '~/types/platform'
const props = defineProps<{ page: PageConfig; routePath: string }>()
const view = ref<'list' | 'calendar'>('list')
const grid = ref<{ create: () => Promise<void>; load: () => Promise<unknown>; exportCsv: () => void; triggerImport: () => void; print: () => void } | null>(null)
const { showToast } = useToast()
const events = ['Customer meeting', 'Follow up', 'Site visit', 'Proposal review']
</script>
<template>
  <PageActions primary-label="Create Activity" @create="grid?.create()" @refresh="grid?.load()" @export="grid?.exportCsv()" @import="grid?.triggerImport()" @filter="showToast('Use activity search filters below.')" @more="grid?.print()" />
  <KpiCards :labels="page.kpis" />
  <div class="platform-page-actions activity-view-actions">
    <div class="activity-toggle" role="group" aria-label="Activity view">
      <button type="button" :class="{ active: view === 'list' }" :aria-pressed="view === 'list'" @click="view='list'">
        <AppIcon name="list" />
        <span>List</span>
      </button>
      <button type="button" :class="{ active: view === 'calendar' }" :aria-pressed="view === 'calendar'" @click="view='calendar'">
        <AppIcon name="calendar" />
        <span>Calendar</span>
      </button>
    </div>
  </div>
  <DataGridSection v-if="view === 'list'" ref="grid" :page="page" :route-path="routePath" />
  <section v-else class="platform-card"><div class="platform-card-head"><h2>September 2026</h2></div><div class="activity-calendar"><div v-for="day in ['Mon','Tue','Wed','Thu','Fri','Sat','Sun']" :key="day" class="calendar-cell"><b>{{day}}</b></div><div v-for="day in 28" :key="day" class="calendar-cell"><b>{{day}}</b><div v-if="(day-1)%4===0" class="calendar-event">{{events[(day-1)%events.length]}}</div></div></div></section>
</template>
