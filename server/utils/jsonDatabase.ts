import { randomUUID } from 'node:crypto'
import { promises as fs } from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import type { JsonRecord } from '../types/api'

const seedRoot = path.resolve(process.cwd(), 'server/data')
const isServerless = Boolean(
  process.env.VERCEL
  || process.env.NETLIFY
  || process.env.AWS_LAMBDA_FUNCTION_NAME
  || process.env.LAMBDA_TASK_ROOT,
)
const configuredDataRoot = process.env.SOP_DATA_DIR?.trim()
const dataRoot = configuredDataRoot
  ? path.resolve(configuredDataRoot)
  : isServerless
    ? path.join(os.tmpdir(), 'sop-data')
    : seedRoot

const safePath = (relative: string) => {
  const resolved = path.resolve(dataRoot, relative)
  const rootPrefix = `${dataRoot}${path.sep}`
  if (resolved !== dataRoot && !resolved.startsWith(rootPrefix)) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid data path' })
  }
  return resolved
}

export async function readCollection<T extends JsonRecord>(relative: string): Promise<T[]> {
  const filePath = safePath(relative)
  try {
    return JSON.parse(await fs.readFile(filePath, 'utf8')) as T[]
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'code' in error && error.code === 'ENOENT') {
      const seed = await useStorage('assets:sop-data').getItemRaw<string>(relative)
      return seed ? JSON.parse(seed) as T[] : []
    }
    throw error
  }
}

export async function writeCollection<T extends JsonRecord>(relative: string, rows: T[]) {
  const filePath = safePath(relative)
  await fs.mkdir(path.dirname(filePath), { recursive: true })
  const temp = `${filePath}.${process.pid}.${Date.now()}.tmp`
  await fs.writeFile(temp, `${JSON.stringify(rows, null, 2)}\n`, 'utf8')
  await fs.rename(temp, filePath)
}

export const findById = <T extends JsonRecord>(rows: T[], id: string) =>
  rows.find(row => String(row.id) === String(id))

export async function createRecord<T extends JsonRecord>(relative: string, input: T) {
  const rows = await readCollection<T>(relative)
  const row = {
    ...input,
    id: String(input.id || randomUUID()),
    createdAt: String(input.createdAt || new Date().toISOString()),
    updatedAt: new Date().toISOString(),
  } as T

  if (rows.some(item => String(item.id) === String(row.id))) {
    throw createError({ statusCode: 409, statusMessage: 'Duplicate ID' })
  }

  rows.unshift(row)
  await writeCollection(relative, rows)
  return row
}

export async function updateRecord<T extends JsonRecord>(relative: string, id: string, input: Partial<T>) {
  const rows = await readCollection<T>(relative)
  const index = rows.findIndex(row => String(row.id) === String(id))
  if (index < 0) throw createError({ statusCode: 404, statusMessage: 'Record not found' })

  rows[index] = {
    ...rows[index],
    ...input,
    id: rows[index].id,
    updatedAt: new Date().toISOString(),
  } as T
  await writeCollection(relative, rows)
  return rows[index]
}

export async function deleteRecord<T extends JsonRecord>(relative: string, id: string) {
  const rows = await readCollection<T>(relative)
  const next = rows.filter(row => String(row.id) !== String(id))
  if (next.length === rows.length) throw createError({ statusCode: 404, statusMessage: 'Record not found' })
  await writeCollection(relative, next)
  return true
}
