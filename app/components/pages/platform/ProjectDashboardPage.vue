<script setup lang="ts">
import type { PageConfig } from '~/types/platform'
defineProps<{ page: PageConfig }>()
const { showToast } = useToast()
const metrics = [['Progress','75%'],['Budget','Rp 3.20B'],['Actual Cost','Rp 2.18B'],['Revenue','Rp 4.10B'],['Profit','Rp 1.92B'],['Margin','46.8%']]
const tasks = ['Complete panel installation','UAT preparation','Milestone: System Integration','Customer training','BAST handover']
const risks = ['Material lead time','Site access window','Interface dependency']
</script>
<template>
  <PageActions primary-label="Project Action" @create="showToast('Project action ready.')" @import="showToast('Import wizard ready.')" @export="showToast('Project dashboard export prepared.')" @filter="showToast('Dashboard filters ready.')" @refresh="showToast('Dashboard refreshed.')" @more="showToast('More actions.')" />
  <section class="project-dashboard-grid">
    <article class="platform-card pd-overview"><div class="platform-card-head"><h2>Project Overview</h2></div><div class="metric-stack"><div v-for="metric in metrics" :key="metric[0]" class="metric-box"><small>{{metric[0]}}</small><b>{{metric[1]}}</b></div></div></article>
    <article class="platform-card pd-chart"><div class="platform-card-head"><h2>S-Curve</h2></div><div class="line-chart"><svg viewBox="0 0 500 180" preserveAspectRatio="none"><polyline class="planned" points="0,165 70,145 140,120 210,90 280,65 350,40 420,20 500,5"/><polyline class="actual" points="0,165 70,150 140,130 210,103 280,78 350,55 420,39 500,28"/></svg></div></article>
    <article class="platform-card pd-chart"><div class="platform-card-head"><h2>Budget vs Actual</h2></div><div class="bar-report"><div v-for="(height,index) in [80,55,67,48]" :key="index" class="rbar" :style="{height:`${height*2}px`}"><span>{{['Material','Labor','PO','Other'][index]}}</span></div></div></article>
    <article class="platform-card pd-wide"><div class="platform-card-head"><h2>Upcoming Tasks & Milestones</h2></div><div style="padding:10px"><div v-for="(task,index) in tasks" :key="task" class="drawer-field"><span>{{ 20+index }} Sep 2026</span><b>{{task}}</b></div></div></article>
    <article class="platform-card pd-list"><div class="platform-card-head"><h2>Risks & Issues</h2></div><div style="padding:10px"><div v-for="(risk,index) in risks" :key="risk" class="agenda-item"><b>{{risk}}</b><small>{{index===0?'High':'Medium'}} priority · Owner {{['Budi Santoso','Sari Dewi','Andi Wijaya'][index]}}</small></div></div></article>
  </section>
</template>
