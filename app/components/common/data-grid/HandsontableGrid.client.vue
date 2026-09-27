<script setup lang="ts">
import { HotTable } from '@handsontable/vue3'
import { registerAllModules } from 'handsontable/registry'
import type { GridSettings } from 'handsontable/settings'
import { checkboxRenderer, numericRenderer, textRenderer } from 'handsontable/renderers'
import { HyperFormula } from 'hyperformula'
import 'handsontable/styles/handsontable.min.css'
import 'handsontable/styles/ht-theme-main.min.css'
import type { DataRow, GridColumn } from '~/types/platform'

registerAllModules()

const props = defineProps<{ rows: DataRow[]; columns: GridColumn[]; readOnly?: boolean }>()
const emit = defineEmits<{ change: [changes: unknown]; select: [row: DataRow] }>()
const config = useRuntimeConfig()
const hotTable = ref<InstanceType<typeof HotTable> | null>(null)

const numericTypes = new Set(['number', 'currency', 'percent', 'progress'])
const visualCellClasses = [
  'sop-hot-cell--badge',
  'sop-hot-cell--currency',
  'sop-hot-cell--date',
  'sop-hot-cell--dropdown',
  'sop-hot-cell--progress',
]

const defaultStatusOptions = [
  'Draft',
  'New',
  'Open',
  'In Progress',
  'Pending Approval',
  'Submitted',
  'Approved',
  'Qualified',
  'Completed',
  'Active',
  'Rejected',
  'Cancelled',
  'Expired',
  'Closed',
]

const resetVisualCell = (cell: HTMLTableCellElement) => {
  cell.classList.remove(...visualCellClasses)
}

const semanticTone = (value: unknown) => {
  const normalized = String(value ?? '').trim().toLowerCase()
  if (/approved|completed|active|paid|converted|qualified|matched|signed|won|success|balanced|delivered|closed|on track|available|received|posted|healthy/.test(normalized)) return 'success'
  if (/rejected|lost|overdue|cancelled|canceled|out of stock|failed|unmatched|inactive|blocked|void|expired|delayed/.test(normalized)) return 'danger'
  if (/pending|negotiation|nurturing|at risk|low stock|submitted|scheduled|open|waiting|review/.test(normalized)) return 'warning'
  if (/draft|hold|not started|unknown/.test(normalized)) return 'neutral'
  if (/progress|new|proposal|sent|contacted|processing/.test(normalized)) return 'info'
  return ''
}

const fallbackTone = (value: unknown) => {
  const tones = ['info', 'success', 'purple', 'warning']
  const hash = Array.from(String(value ?? '')).reduce((total, char) => total + char.charCodeAt(0), 0)
  return tones[hash % tones.length]
}

const makeBadge = (value: unknown, status = false) => {
  const text = String(value ?? '').trim() || '—'
  const tone = semanticTone(text) || (status ? 'neutral' : fallbackTone(text))
  const badge = document.createElement('span')
  badge.className = `sop-hot-badge sop-hot-badge--${tone}`

  const marker = document.createElement('span')
  marker.className = 'sop-hot-badge__marker'
  marker.setAttribute('aria-hidden', 'true')
  badge.append(marker, document.createTextNode(text))
  return badge
}

const badgeRenderer = (status = false): typeof textRenderer => (hot, cell, row, col, prop, value, cellProperties) => {
  textRenderer(hot, cell, row, col, prop, value, cellProperties)
  resetVisualCell(cell)
  cell.classList.add('sop-hot-cell--badge', 'sop-hot-cell--dropdown')
  cell.replaceChildren(makeBadge(value, status))
  cell.title = String(value ?? '')
}

const toCurrencyNumber = (value: unknown): number | null => {
  if (typeof value === 'number') return Number.isFinite(value) ? value : null
  if (value == null || value === '') return 0

  const text = String(value).trim().replace(/\s/g, '').replace(/^rp/i, '')
  if (!text) return 0

  let normalized = text.replace(/[^0-9,.-]/g, '')
  if (!normalized || normalized === '-' || normalized === '.' || normalized === ',') return null
  if (/^-?\d{1,3}(,\d{3})+(\.\d+)?$/.test(normalized)) normalized = normalized.replaceAll(',', '')
  else if (/^-?\d{1,3}(\.\d{3})+(,\d+)?$/.test(normalized)) normalized = normalized.replaceAll('.', '').replace(',', '.')
  else if (normalized.includes(',') && !normalized.includes('.')) normalized = normalized.replace(',', '.')

  const number = Number(normalized)
  return Number.isFinite(number) ? number : null
}

const progressRenderer: typeof numericRenderer = (hot, cell, row, col, prop, value, cellProperties) => {
  numericRenderer(hot, cell, row, col, prop, value, cellProperties)
  resetVisualCell(cell)
  cell.classList.add('sop-hot-cell--progress')

  const number = Math.min(100, Math.max(0, toCurrencyNumber(value) ?? 0))
  const wrap = document.createElement('span')
  wrap.className = 'sop-hot-progress'
  const track = document.createElement('span')
  track.className = 'sop-hot-progress__track'
  const fill = document.createElement('span')
  fill.className = 'sop-hot-progress__fill'
  fill.style.width = `${number}%`
  const label = document.createElement('strong')
  label.textContent = `${number.toLocaleString('en-US', { maximumFractionDigits: 1 })}%`
  track.append(fill)
  wrap.append(track, label)
  cell.replaceChildren(wrap)
  cell.title = `${number}%`
}

const currencyRenderer: typeof numericRenderer = (hot, cell, row, col, prop, value, cellProperties) => {
  numericRenderer(hot, cell, row, col, prop, value, cellProperties)
  resetVisualCell(cell)
  cell.classList.add('sop-hot-cell--currency')

  const wrap = document.createElement('span')
  wrap.className = 'sop-hot-money'
  const prefix = document.createElement('small')
  prefix.textContent = 'Rp'
  const amount = document.createElement('strong')
  const number = toCurrencyNumber(value)
  amount.textContent = number == null ? '—' : number.toLocaleString('en-US', { maximumFractionDigits: 2 })
  wrap.append(prefix, amount)
  cell.replaceChildren(wrap)
  cell.title = number == null ? String(value ?? '') : `Rp ${amount.textContent}`
}

const dateCellRenderer: typeof textRenderer = (hot, cell, row, col, prop, value, cellProperties) => {
  textRenderer(hot, cell, row, col, prop, value, cellProperties)
  resetVisualCell(cell)
  cell.classList.add('sop-hot-cell--date')
  const date = document.createElement('span')
  date.className = 'sop-hot-date'
  date.textContent = String(value ?? '') || '—'
  cell.replaceChildren(date)
}

const rendererFor = (column: GridColumn) => {
  if (column.type === 'status') return badgeRenderer(true)
  if (column.type === 'dropdown' && /status|approval|source|industry|type|category|priority|qualification|stage|condition|method|terms|currency|tax|department|role|classification|movement/i.test(`${column.key} ${column.title}`)) return badgeRenderer(false)
  if (column.type === 'percent' || column.type === 'progress') return progressRenderer
  if (column.type === 'currency') return currencyRenderer
  if (column.type === 'date') return dateCellRenderer
  if (column.type === 'checkbox') return checkboxRenderer
  return undefined
}

const toHotType = (column: GridColumn) => {
  if (numericTypes.has(column.type)) return 'numeric'
  if (column.type === 'checkbox') return 'checkbox'
  if (column.type === 'date') return 'date'
  if (column.type === 'dropdown') return 'dropdown'
  if (column.type === 'status') return 'dropdown'
  return 'text'
}

const sourceFor = (column: GridColumn) => {
  if (column.type !== 'dropdown' && column.type !== 'status') return column.source
  const values = props.rows.map(row => String(row[column.key] ?? '').trim()).filter(Boolean)
  const defaults = column.type === 'status' && !column.source?.length ? defaultStatusOptions : []
  return Array.from(new Set([...(column.source || []), ...defaults, ...values]))
}

const validatorFor = (column: GridColumn) => (value: unknown, callback: (valid: boolean) => void) => {
  if (column.required && String(value ?? '').trim() === '') return callback(false)
  if (column.type === 'email' && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value))) return callback(false)
  if (column.type === 'currency' && value !== '' && value != null && toCurrencyNumber(value) == null) return callback(false)
  if (numericTypes.has(column.type) && column.type !== 'currency' && value !== '' && value != null && !Number.isFinite(Number(value))) return callback(false)
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
  source: sourceFor(column),
  allowInvalid: false,
  validator: validatorFor(column),
  renderer: rendererFor(column),
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
  stretchH: 'none',
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
  afterOnCellMouseDown: (event, coords) => {
    if (coords.row < 0 || coords.col < 0) return
    const column = props.columns[coords.col]
    if (!column || (column.type !== 'dropdown' && column.type !== 'status')) return
    if (props.readOnly || column.editable === false || column.formula) return

    window.requestAnimationFrame(() => {
      const hot = hotTable.value?.hotInstance
      if (!hot || hot.isDestroyed) return
      hot.selectCell(coords.row, coords.col)
      const editor = hot.getActiveEditor()
      if (editor && !editor.isOpened()) editor.beginEditing(undefined, event)
    })
  },
}))
</script>

<template>
  <div class="sop-hot-wrap ht-theme-main">
    <HotTable ref="hotTable" :settings="settings" />
  </div>
</template>
