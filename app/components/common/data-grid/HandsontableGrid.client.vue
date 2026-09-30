<script setup lang="ts">
import { HotTable } from '@handsontable/vue3'
import { registerAllModules } from 'handsontable/registry'
import type { GridSettings } from 'handsontable/settings'
import { checkboxRenderer, numericRenderer, textRenderer } from 'handsontable/renderers'
import { HyperFormula } from 'hyperformula'
import 'handsontable/styles/handsontable.min.css'
import 'handsontable/styles/ht-theme-main.min.css'
import type { DataRow, GridColumn, GridSelectOption } from '~/types/platform'

registerAllModules()

const props = defineProps<{
  rows: DataRow[]
  columns: GridColumn[]
  readOnly?: boolean
  customOptions?: Record<string, GridSelectOption[]>
}>()
const emit = defineEmits<{
  change: [changes: unknown]
  select: [row: DataRow]
  detail: [row: DataRow]
  optionCreate: [payload: { columnKey: string; columnTitle: string; value: string; color: string }]
}>()
const config = useRuntimeConfig()
const hotTable = ref<InstanceType<typeof HotTable> | null>(null)
const manualWidths = ref<Record<string, number>>({})
const selectMenu = ref<{
  row: number
  columnKey: string
  columnTitle: string
  value: string
  anchor: { top: number; right: number; bottom: number; left: number; width: number }
} | null>(null)

const numericTypes = new Set(['number', 'currency', 'percent', 'progress'])
const visualCellClasses = [
  'sop-hot-cell--badge',
  'sop-hot-cell--currency',
  'sop-hot-cell--date',
  'sop-hot-cell--detail',
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

const colorWithAlpha = (color: string, alpha: number) => {
  const red = Number.parseInt(color.slice(1, 3), 16)
  const green = Number.parseInt(color.slice(3, 5), 16)
  const blue = Number.parseInt(color.slice(5, 7), 16)
  return `rgba(${red}, ${green}, ${blue}, ${alpha})`
}

const customColorFor = (column: GridColumn, value: unknown) => props.customOptions?.[column.key]
  ?.find(option => option.value.toLocaleLowerCase() === String(value ?? '').trim().toLocaleLowerCase())?.color

const makeBadge = (value: unknown, status = false, color?: string) => {
  const text = String(value ?? '').trim() || '—'
  const tone = semanticTone(text) || (status ? 'neutral' : fallbackTone(text))
  const badge = document.createElement('span')
  badge.className = `sop-hot-badge sop-hot-badge--${tone}`
  if (color && /^#[0-9A-F]{6}$/i.test(color)) {
    badge.style.color = color
    badge.style.backgroundColor = colorWithAlpha(color, .11)
    badge.style.borderColor = colorWithAlpha(color, .28)
  }

  const marker = document.createElement('span')
  marker.className = 'sop-hot-badge__marker'
  marker.setAttribute('aria-hidden', 'true')
  badge.append(marker, document.createTextNode(text))
  return badge
}

const badgeRenderer = (column: GridColumn, status = false): typeof textRenderer => (hot, cell, row, col, prop, value, cellProperties) => {
  textRenderer(hot, cell, row, col, prop, value, cellProperties)
  resetVisualCell(cell)
  cell.classList.add('sop-hot-cell--badge', 'sop-hot-cell--dropdown')
  cell.replaceChildren(makeBadge(value, status, customColorFor(column, value)))
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

const detailRenderer: typeof textRenderer = (hot, cell, row, col, prop, value, cellProperties) => {
  textRenderer(hot, cell, row, col, prop, value, cellProperties)
  resetVisualCell(cell)
  cell.classList.add('sop-hot-cell--detail')

  const button = document.createElement('button')
  button.type = 'button'
  button.className = 'sop-hot-detail-btn'
  button.title = 'View details'
  button.setAttribute('aria-label', `View details for row ${row + 1}`)

  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
  svg.setAttribute('aria-hidden', 'true')
  const use = document.createElementNS('http://www.w3.org/2000/svg', 'use')
  use.setAttribute('href', '#ps-eye')
  svg.append(use)
  button.append(svg)
  cell.replaceChildren(button)
}

const rendererFor = (column: GridColumn) => {
  if (column.type === 'detail') return detailRenderer
  if (column.type === 'status') return badgeRenderer(column, true)
  if (column.type === 'dropdown' && /status|approval|source|industry|type|category|priority|qualification|stage|condition|method|terms|currency|tax|department|role|classification|movement/i.test(`${column.key} ${column.title}`)) return badgeRenderer(column, false)
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
  const custom = (props.customOptions?.[column.key] || []).map(option => option.value)
  const options = [...(column.source || []), ...defaults, ...custom, ...values]
  return options.filter((value, index) => options.findIndex(candidate => candidate.toLocaleLowerCase() === value.toLocaleLowerCase()) === index)
}

const activeSelectColumn = computed(() => props.columns.find(column => column.key === selectMenu.value?.columnKey))
const activeSelectOptions = computed<GridSelectOption[]>(() => {
  const column = activeSelectColumn.value
  if (!column) return []
  const custom = props.customOptions?.[column.key] || []
  return (sourceFor(column) || []).map(value => ({
    value,
    color: custom.find(option => option.value.toLocaleLowerCase() === value.toLocaleLowerCase())?.color,
  }))
})

const rowAtVisualIndex = (row: number) => {
  const hot = hotTable.value?.hotInstance
  if (!hot || hot.isDestroyed) return props.rows[row]
  return hot.getSourceDataAtRow(hot.toPhysicalRow(row)) as DataRow | undefined
}

const closeSelectMenu = () => { selectMenu.value = null }

const selectOption = (value: string) => {
  const menu = selectMenu.value
  const hot = hotTable.value?.hotInstance
  if (!menu || !hot || hot.isDestroyed) return closeSelectMenu()
  hot.setDataAtRowProp(menu.row, menu.columnKey, value, 'select-menu')
  closeSelectMenu()
}

const createOption = (payload: { value: string; color: string }) => {
  const menu = selectMenu.value
  if (!menu) return
  emit('optionCreate', { columnKey: menu.columnKey, columnTitle: menu.columnTitle, ...payload })
  selectOption(payload.value)
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
  editor: column.type === 'dropdown' || column.type === 'status' ? false : undefined,
  readOnly: props.readOnly || column.editable === false || Boolean(column.formula),
  width: manualWidths.value[column.key] ?? column.width,
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
    const hot = hotTable.value?.hotInstance
    if (changes && source !== 'loadData') {
      const normalized = hot
        ? changes.map(([row, property, oldValue, newValue]) => [hot.toPhysicalRow(Number(row)), property, oldValue, newValue])
        : changes
      emit('change', normalized)
    }
  },
  afterColumnResize: (newSize, column) => {
    const hot = hotTable.value?.hotInstance
    const property = hot?.getCellMeta(0, column).prop
    const key = typeof property === 'string' ? property : props.columns[column]?.key
    if (!key || !Number.isFinite(newSize)) return
    manualWidths.value = { ...manualWidths.value, [key]: newSize }
  },
  afterSelectionEnd: (row) => {
    const item = rowAtVisualIndex(row)
    if (item) emit('select', item)
  },
  afterOnCellMouseDown: (event, coords) => {
    if (coords.row < 0 || coords.col < 0) return
    const hot = hotTable.value?.hotInstance
    const property = hot?.colToProp(coords.col)
    const column = props.columns.find(item => item.key === property) || props.columns[coords.col]
    if (column?.type === 'detail') {
      const target = event.target as HTMLElement | null
      const button = target?.closest('.sop-hot-detail-btn')
      const item = rowAtVisualIndex(coords.row)
      if (button && item) emit('detail', item)
      return
    }
    if (!column || (column.type !== 'dropdown' && column.type !== 'status')) return
    if (props.readOnly || column.editable === false || column.formula) return
    const cell = (event.target as HTMLElement | null)?.closest('td')
    if (!hot || !cell) return
    const rect = cell.getBoundingClientRect()
    hot.selectCell(coords.row, coords.col)
    selectMenu.value = {
      row: coords.row,
      columnKey: column.key,
      columnTitle: column.title,
      value: String(rowAtVisualIndex(coords.row)?.[column.key] ?? ''),
      anchor: { top: rect.top, right: rect.right, bottom: rect.bottom, left: rect.left, width: rect.width },
    }
  },
}))
</script>

<template>
  <div class="sop-hot-wrap ht-theme-main">
    <HotTable ref="hotTable" :settings="settings" />
    <GridSelectMenu
      :open="Boolean(selectMenu)"
      :title="selectMenu?.columnTitle || ''"
      :options="activeSelectOptions"
      :current-value="selectMenu?.value"
      :anchor="selectMenu?.anchor"
      :allow-create="activeSelectColumn?.allowCustomOptions !== false"
      @close="closeSelectMenu"
      @select="selectOption"
      @create="createOption"
    />
  </div>
</template>
