<script setup lang="ts">
import type { DataRow, PageConfig } from '~/types/platform'
const props = defineProps<{ page: PageConfig; routePath: string }>()
const { request } = useApi()
const { showToast } = useToast()
const tasks = ref<DataRow[]>([])
const positions = ref<number[]>([])
onMounted(async()=>{ const result=await request<{data:DataRow[]}>(props.routePath,{query:{limit:25}});tasks.value=result.data.slice(0,8);positions.value=tasks.value.map((_,i)=>4+i*8) })
const dragEnd=(event:DragEvent,index:number)=>{const parent=(event.currentTarget as HTMLElement)?.parentElement;if(!parent)return;const rect=parent.getBoundingClientRect();positions.value[index]=Math.max(0,Math.min(90,((event.clientX-rect.left)/rect.width)*100));showToast('Timeline updated and draft autosaved.')}
</script>
<template>
  <PageActions primary-label="Add Task" @create="showToast('Task form ready.')" @import="showToast('Import wizard ready.')" @export="showToast('Gantt export prepared.')" @filter="showToast('Timeline filter ready.')" @refresh="showToast('Timeline refreshed.')" @more="showToast('More actions.')" />
  <section class="platform-card platform-grid-card"><div class="platform-card-head"><div><h2>Project Timeline</h2><p>Drag bars horizontally to simulate start-date changes.</p></div><div class="card-tools"><button class="card-tool">Week</button><button class="card-tool">Month</button></div></div><div class="gantt-wrap"><div class="gantt"><div v-for="(task,index) in tasks" :key="String(task.id)" class="gantt-row"><div class="gantt-task"><b>{{index+1}}. {{task.task || task.name || `Task ${index+1}`}}</b><br><small>{{task.pic || 'Project Team'}} · {{task.progress || 0}}%</small></div><div class="gantt-timeline"><div class="gantt-bar" :class="{complete:index<2,warning:index===3}" draggable="true" :style="{left:`${positions[index] || 0}%`,width:`${14+(index%3)*5}%`}" @dragend="dragEnd($event,index)">{{task.progress || 0}}%</div></div></div></div></div></section>
</template>
