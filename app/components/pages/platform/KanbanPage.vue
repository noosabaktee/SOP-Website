<script setup lang="ts">
import type { DataRow, PageConfig } from '~/types/platform'
const props = defineProps<{ page: PageConfig; routePath: string }>()
const stages = ['New', 'Qualified', 'Proposal', 'Negotiation', 'Won', 'Lost']
const { rows: cards, fetchRows, updateRow } = useResourceGrid(props.routePath)
const { showToast } = useToast()
onMounted(fetchRows)
const onDragStart = (event: DragEvent, id: string) => event.dataTransfer?.setData('text/plain', id)
const onDrop = async (event: DragEvent, stage: string) => {
  const id = event.dataTransfer?.getData('text/plain')
  const card = cards.value.find(item => String(item.id) === id)
  if (!card) return
  card.stage = stage
  await updateRow(id, card)
  showToast(`Opportunity moved to ${stage}.`)
}
const value=(card:DataRow)=>Number(card.value||0).toLocaleString('en-US')
</script>
<template>
  <PageActions primary-label="Add Opportunity" @create="showToast('Opportunity form ready.')" @import="showToast('Pipeline import ready.')" @export="showToast('Pipeline export prepared.')" @filter="showToast('Pipeline filter ready.')" @refresh="fetchRows" @more="showToast('More actions.')" />
  <KpiCards :labels="page.kpis" />
  <section class="kanban-board"><div v-for="stage in stages" :key="stage" class="kanban-col" @dragover.prevent @drop="onDrop($event, stage)"><div class="kanban-col-head">{{stage}}<span>{{cards.filter(card=>card.stage===stage).length}}</span></div><div class="kanban-drop"><article v-for="card in cards.filter(item=>item.stage===stage)" :key="String(card.id)" class="kanban-card" draggable="true" @dragstart="onDragStart($event,String(card.id))" @click="showToast('Opportunity detail drawer demo.')"><h3>{{card.name}}</h3><p>{{card.customer}}</p><div class="kanban-meta"><span class="kanban-value">Rp {{value(card)}}</span><span>{{card.probability}}%</span></div><div class="kanban-meta" style="margin-top:7px"><span>{{card.closeDate}}</span><span>{{card.owner}}</span></div></article></div></div></section>
</template>
