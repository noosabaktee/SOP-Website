import readXlsxFile from 'read-excel-file'
import type { DataRow, GridColumn } from '~/types/platform'

const maxFileSize = 10 * 1024 * 1024
const maxRows = 2000

const normalizeHeader = (value: unknown) => String(value ?? '').trim().toLocaleLowerCase()

const formatDate = (value: Date) => value.toLocaleDateString('en-GB', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
}).replace(',', '')

const parseNumber = (value: unknown) => {
  if (typeof value === 'number') return Number.isFinite(value) ? value : 0
  let normalized = String(value).trim().replace(/\s/g, '').replace(/[^\d,.-]/g, '')
  if (/^-?\d{1,3}(,\d{3})+(\.\d+)?$/.test(normalized)) normalized = normalized.replaceAll(',', '')
  else if (/^-?\d{1,3}(\.\d{3})+(,\d+)?$/.test(normalized)) normalized = normalized.replaceAll('.', '').replace(',', '.')
  else if (normalized.includes(',') && !normalized.includes('.')) normalized = normalized.replace(',', '.')
  const parsed = Number(normalized)
  return Number.isFinite(parsed) ? parsed : 0
}

const toCellValue = (value: unknown, column: GridColumn) => {
  if (value == null || value === '') {
    if (['number', 'currency', 'percent', 'progress'].includes(column.type)) return 0
    if (column.type === 'checkbox') return false
    return ''
  }

  if (column.type === 'date') return value instanceof Date ? formatDate(value) : String(value).trim()
  if (column.type === 'checkbox') {
    if (typeof value === 'boolean') return value
    return ['true', '1', 'yes', 'ya'].includes(String(value).trim().toLocaleLowerCase())
  }
  if (['number', 'currency', 'percent', 'progress'].includes(column.type)) {
    const number = parseNumber(value)
    return column.type === 'percent' && number > 0 && number <= 1 ? number * 100 : number
  }
  return String(value).trim()
}

export const parseExcelFile = async (file: File, columns: GridColumn[]) => {
  if (file.size > maxFileSize) throw new Error('Ukuran file Excel maksimal 10 MB.')

  const sheet = await readXlsxFile(file)
  if (sheet.length < 2) throw new Error('File Excel harus memiliki header dan minimal satu baris data.')
  if (sheet.length - 1 > maxRows) throw new Error(`Maksimal ${maxRows.toLocaleString('en-US')} baris per import.`)

  const byHeader = new Map(columns.flatMap(column => [
    [normalizeHeader(column.title), column],
    [normalizeHeader(column.key), column],
  ] as const))
  const headers = sheet[0].map(normalizeHeader)
  const matchedColumns = headers.map(header => byHeader.get(header))
  if (!matchedColumns.some(Boolean)) throw new Error('Header Excel tidak cocok dengan kolom tabel ini.')

  const rows = sheet.slice(1).filter(values => matchedColumns.some((column, index) => {
    const value = values[index]
    return column && value !== '' && value !== null && value !== undefined
  })).map(values => {
    const row: DataRow = {}
    matchedColumns.forEach((column, index) => {
      if (!column || column.formula || column.type === 'detail') return
      row[column.key] = toCellValue(values[index], column)
    })
    return row
  })

  if (!rows.length) throw new Error('Tidak ada baris data yang dapat diimport.')
  return rows
}
