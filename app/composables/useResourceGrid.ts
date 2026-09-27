import type { DataRow, PaginatedResponse } from '~/types/platform'
export const useResourceGrid = (routePath: string) => {
  const rows = ref<DataRow[]>([])
  const pending = ref(false)
  const error = ref<string | null>(null)
  const query = reactive({ page: 1, limit: 25, search: '', status: '' })
  const { request } = useApi()
  const endpoint = routePath
  const fetchRows = async () => {
    pending.value = true; error.value = null
    try {
      const result = await request<PaginatedResponse<DataRow>>(endpoint, { query })
      rows.value = result.data
      return result
    } catch (e) { error.value = e instanceof Error ? e.message : 'Failed to load data'; throw e }
    finally { pending.value = false }
  }
  const createRow = async (row: DataRow) => request(endpoint, { method: 'POST', body: row })
  const updateRow = async (id: string, row: DataRow) => request(`${endpoint}/${encodeURIComponent(id)}`, { method: 'PUT', body: row })
  const deleteRow = async (id: string) => request(`${endpoint}/${encodeURIComponent(id)}`, { method: 'DELETE' })
  return { rows, pending, error, query, fetchRows, createRow, updateRow, deleteRow }
}
