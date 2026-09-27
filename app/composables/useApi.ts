export const useApi = () => {
  const config = useRuntimeConfig()
  type RequestOptions = NonNullable<Parameters<typeof $fetch>[1]>

  const request = <T>(path: string, options: RequestOptions = {}) =>
    $fetch<T>(path, {
      baseURL: config.public.apiBaseUrl,
      ...options,
    })

  return { request }
}
