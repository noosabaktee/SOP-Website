import { readCollection } from '~~/server/utils/jsonDatabase'

type GridOptionRecord = Record<string, unknown> & {
  id: string
  scope: string
  columnKey: string
  value: string
  color?: string
}

export default defineEventHandler(async (event) => {
  const scope = String(getQuery(event).scope || '').trim()
  if (!scope) throw createError({ statusCode: 400, statusMessage: 'Option scope is required' })

  const rows = await readCollection<GridOptionRecord>('settings/grid-options.json')
  const data = rows
    .filter(row => row.scope === scope)
    .sort((a, b) => a.value.localeCompare(b.value))

  return { success: true, data }
})
