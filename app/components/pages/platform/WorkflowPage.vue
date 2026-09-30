<script setup lang="ts">
import type { DataGridActions, PageConfig } from '~/types/platform'

defineProps<{ page: PageConfig; routePath: string }>()
const grid = ref<DataGridActions | null>(null)
const { showToast } = useToast()
const steps = [['Quotation Submitted', 'Start event'], ['Sales Manager', 'Commercial approval'], ['Finance', 'Margin & tax review'], ['Director', 'Final approval above threshold']]
</script>

<template>
  <PageActions primary-label="Add Workflow" @create="grid?.create()" @import="grid?.triggerImport()" @export="grid?.exportCsv()" @filter="showToast('Gunakan pencarian dan filter tabel di bawah.')" @refresh="grid?.load()" @more="grid?.print()" />
  <section class="platform-card platform-grid-card"><div class="platform-card-head"><h2>Workflow Builder</h2></div><div class="workflow-canvas"><template v-for="(step, index) in steps" :key="step[0]"><div class="workflow-step"><b>{{ step[0] }}</b><small>{{ step[1] }}</small></div><div v-if="index < steps.length - 1" class="workflow-arrow">→</div></template></div></section>
  <DataGridSection ref="grid" :page="page" :route-path="routePath" />
</template>
