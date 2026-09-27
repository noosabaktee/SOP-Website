<script setup lang="ts">
import { HotTable } from '@handsontable/vue3'
import { registerAllModules } from 'handsontable/registry'
import type { GridSettings } from 'handsontable/settings'
import { HyperFormula } from 'hyperformula'
import 'handsontable/styles/handsontable.min.css'
import 'handsontable/styles/ht-theme-main.min.css'
import type { DataRow, GridColumn } from '~/types/platform'

registerAllModules()

const props = defineProps<{ rows: DataRow[]; columns: GridColumn[]; readOnly?: boolean }>()
const emit = defineEmits<{ change: [changes: unknown]; select: [row: DataRow] }>()
const config = useRuntimeConfig()

const numericTypes = new Set(['number', 'currency', 'percent', 'progress'])
const toHotType = (column: GridColumn) => {
  if (numericTypes.has(column.type)) return 'numeric'
  if (column.type === 'checkbox') return 'checkbox'
  if (column.type === 'date') return 'date'
  if (column.type === 'dropdown') return 'dropdown'
  return 'text'
}

const validatorFor = (column: GridColumn) => (value: unknown, callback: (valid: boolean) => void) => {
  if (column.required && String(value ?? '').trim() === '') return callback(false)
  if (column.type === 'email' && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value))) return callback(false)
  if (numericTypes.has(column.type) && value !== '' && value != null && !Number.isFinite(Number(value))) return callback(false)
  if ((column.type === 'percent' || column.type === 'progress') && value !== '' && value != null) {
    const number = Number(value)
    if (number < 0 || number > 100) return callback(false)
  }
  callback(true)
}

const hotColumns = computed(() => props.columns.map(column => ({
  data: column.key,
  type: toHotType(column),
  readOnly: props.readOnly || column.editable === false || Boolean(column.formula),
  width: column.width,
  source: column.source,
  allowInvalid: false,
  validator: validatorFor(column),
  dateFormat: column.type === 'date' ? 'DD MMM YYYY' : undefined,
  correctFormat: column.type === 'date' ? true : undefined,
  numericFormat: column.type === 'currency'
    ? { pattern: '0,0' }
    : numericTypes.has(column.type)
      ? { pattern: '0,0.[00]' }
      : undefined,
})))

const settings = computed<GridSettings>(() => ({
  data: props.rows,
  columns: hotColumns.value,
  colHeaders: props.columns.map(column => column.title),
  rowHeaders: true,
  rowHeaderWidth: 46,
  stretchH: 'last',
  height: 'auto',
  width: '100%',
  rowHeights: 38,
  columnHeaderHeight: 40,
  wordWrap: false,
  minSpareRows: 0,
  filters: true,
  dropdownMenu: true,
  contextMenu: true,
  copyPaste: true,
  undo: true,
  columnSorting: true,
  manualColumnResize: true,
  manualRowResize: true,
  manualColumnMove: true,
  fillHandle: true,
  search: true,
  fixedColumnsStart: 0,
  theme: 'ht-theme-main',
  licenseKey: String(config.public.handsontableLicenseKey),
  formulas: { engine: HyperFormula, sheetName: 'SOP' },
  afterChange: (changes, source) => {
    if (changes && source !== 'loadData') emit('change', changes)
  },
  afterSelectionEnd: (row) => {
    const item = props.rows[row]
    if (item) emit('select', item)
  },
}))
</script>

<template>
  <div class="sop-hot-wrap ht-theme-main">
    <HotTable :settings="settings" />
  </div>
</template>
