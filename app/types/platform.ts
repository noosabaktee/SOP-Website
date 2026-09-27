export type CellType = 'text' | 'number' | 'currency' | 'percent' | 'date' | 'email' | 'dropdown' | 'status' | 'progress' | 'checkbox'
export interface GridColumn { key: string; title: string; type: CellType; editable: boolean; width?: number; required?: boolean; source?: string[]; formula?: string }
export interface PageConfig { title: string; description: string; schema: string; type: string; module: string; statusFilter?: string | null; prefix?: string; kpis?: string[] }
export interface MenuItem { label: string; icon?: string; route?: string; children?: MenuItem[]; groups?: Array<{ label: string; children: MenuItem[] }> }
export interface PlatformConfig { company: string; product: string; fullName: string; tagline: string; routes: Record<string, PageConfig>; menu: MenuItem[] }
export interface ApiResponse<T> { success: boolean; message?: string; data: T }
export interface PaginatedResponse<T> { success: boolean; data: T[]; page: number; limit: number; total: number; totalPages: number }
export type DataRow = Record<string, string | number | boolean | null | undefined>
