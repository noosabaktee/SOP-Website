import type { DataRow, GridColumn } from '~/types/platform'

const quote = (value: unknown) => `"${String(value ?? '').replaceAll('"', '""')}"`

export const downloadCsv = (filename: string, rows: DataRow[], columns: GridColumn[]) => {
  if (!import.meta.client) return
  const content = [
    columns.map(column => quote(column.title)).join(','),
    ...rows.map(row => columns.map(column => quote(row[column.key])).join(',')),
  ].join('\n')
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}

export const parseCsv = (text: string, columns: GridColumn[]) => {
  const lines = text.replace(/\r/g, '').split('\n').filter(Boolean)
  if (lines.length < 2) return []
  const split = (line: string) => {
    const result: string[] = []
    let current = ''
    let quoted = false
    for (let index = 0; index < line.length; index++) {
      const char = line[index]
      if (char === '"' && line[index + 1] === '"') { current += '"'; index++; continue }
      if (char === '"') { quoted = !quoted; continue }
      if (char === ',' && !quoted) { result.push(current); current = ''; continue }
      current += char
    }
    result.push(current)
    return result
  }
  const headers = split(lines[0]).map(item => item.trim().toLowerCase())
  const byHeader = new Map(columns.flatMap(column => [[column.title.toLowerCase(), column], [column.key.toLowerCase(), column]] as const))
  return lines.slice(1).map(line => {
    const values = split(line)
    const row: DataRow = {}
    headers.forEach((header, index) => {
      const column = byHeader.get(header)
      if (!column) return
      const raw = values[index] ?? ''
      row[column.key] = ['number', 'currency', 'percent', 'progress'].includes(column.type) ? Number(raw.replaceAll(/[^\d.-]/g, '')) || 0 : column.type === 'checkbox' ? ['true', '1', 'yes'].includes(raw.toLowerCase()) : raw
    })
    return row
  })
}
