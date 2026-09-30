import type { ApiResponse, GridOption, GridSelectOption } from '~/types/platform'

export const useGridOptions = (scope: string) => {
  const { request } = useApi()
  const items = ref<GridOption[]>([])

  const optionsByColumn = computed<Record<string, GridSelectOption[]>>(() => {
    const grouped: Record<string, GridSelectOption[]> = {}
    for (const option of items.value) {
      const values = grouped[option.columnKey] ||= []
      if (!values.some(item => item.value.toLocaleLowerCase() === option.value.toLocaleLowerCase())) {
        values.push({ value: option.value, color: option.color })
      }
    }
    return grouped
  })

  const fetchOptions = async () => {
    const result = await request<ApiResponse<GridOption[]>>('/platform/grid-options', { query: { scope } })
    items.value = result.data
    return result.data
  }

  const createOption = async (columnKey: string, value: string, color: string) => {
    const normalized = value.trim()
    const existing = items.value.find(option => option.columnKey === columnKey && option.value.toLocaleLowerCase() === normalized.toLocaleLowerCase())
    if (existing) return existing

    const result = await request<ApiResponse<GridOption>>('/platform/grid-options', {
      method: 'POST',
      body: { scope, columnKey, value: normalized, color },
    })
    items.value = [...items.value, result.data]
    return result.data
  }

  return { optionsByColumn, fetchOptions, createOption }
}
