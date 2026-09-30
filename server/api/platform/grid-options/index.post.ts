import { createRecord, readCollection } from '~~/server/utils/jsonDatabase'

type GridOptionRecord = Record<string, unknown> & {
  id: string
  scope: string
  columnKey: string
  value: string
  color?: string
}

const clean = (value: unknown, maxLength: number) => String(value || '').trim().replace(/\s+/g, ' ').slice(0, maxLength)
const defaultColor = '#2583E9'
const cleanColor = (value: unknown) => {
  const color = String(value || '').trim().toUpperCase()
  return /^#[0-9A-F]{6}$/.test(color) ? color : defaultColor
}

export default defineEventHandler(async (event) => {
  const body = await readBody<Record<string, unknown>>(event)
  const scope = clean(body.scope, 160)
  const columnKey = clean(body.columnKey, 80)
  const value = clean(body.value, 120)
  const color = cleanColor(body.color)

  if (!scope || !columnKey || !value) {
    throw createError({ statusCode: 400, statusMessage: 'Scope, column, and option value are required' })
  }

  const rows = await readCollection<GridOptionRecord>('settings/grid-options.json')
  const existing = rows.find(row => row.scope === scope
    && row.columnKey === columnKey
    && row.value.toLocaleLowerCase() === value.toLocaleLowerCase())

  if (existing) return { success: true, data: existing }

  const data = await createRecord<GridOptionRecord>('settings/grid-options.json', {
    id: '',
    scope,
    columnKey,
    value,
    color,
  })
  return { success: true, data }
})
