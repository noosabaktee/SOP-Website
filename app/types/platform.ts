export type CellType = 'text' | 'number' | 'currency' | 'percent' | 'date' | 'email' | 'dropdown' | 'status' | 'progress' | 'checkbox' | 'detail'
export interface GridColumn { key: string; title: string; type: CellType; editable: boolean; width?: number; required?: boolean; source?: string[]; formula?: string; allowCustomOptions?: boolean }
export interface GridSelectOption { value: string; color?: string }
export interface GridOption extends GridSelectOption { id: string; scope: string; columnKey: string; createdAt?: string; updatedAt?: string }
export interface DataGridActions { load: () => Promise<unknown>; save: () => Promise<void>; create: () => Promise<void>; exportCsv: () => void; triggerImport: () => void; print: () => void }
export interface PageConfig { title: string; description: string; schema: string; type: string; module: string; statusFilter?: string | null; prefix?: string; kpis?: string[] }
export interface MenuItem { label: string; icon?: string; route?: string; children?: MenuItem[]; groups?: Array<{ label: string; children: MenuItem[] }> }
export interface PlatformConfig { company: string; product: string; fullName: string; tagline: string; routes: Record<string, PageConfig>; menu: MenuItem[] }
export interface ApiResponse<T> { success: boolean; message?: string; data: T }
export interface PaginatedResponse<T> { success: boolean; data: T[]; page: number; limit: number; total: number; totalPages: number }
export type DataRow = Record<string, string | number | boolean | null | undefined>
