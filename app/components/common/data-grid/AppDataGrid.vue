<script setup lang="ts">
import type { DataRow, GridColumn, GridSelectOption } from '~/types/platform'

defineProps<{
  rows: DataRow[]
  columns: GridColumn[]
  readOnly?: boolean
  customOptions?: Record<string, GridSelectOption[]>
}>()

defineEmits<{
  change: [unknown]
  select: [DataRow]
  detail: [DataRow]
  optionCreate: [{ columnKey: string; columnTitle: string; value: string; color: string }]
}>()
</script>

<template>
  <ClientOnly>
    <HandsontableGrid
      :rows="rows"
      :columns="columns"
      :read-only="readOnly"
      :custom-options="customOptions"
      @change="$emit('change', $event)"
      @select="$emit('select', $event)"
      @detail="$emit('detail', $event)"
      @option-create="$emit('optionCreate', $event)"
    />
    <template #fallback><div class="platform-grid-loading">Loading data grid…</div></template>
  </ClientOnly>
</template>
