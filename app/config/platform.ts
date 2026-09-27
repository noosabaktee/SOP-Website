import platformJson from './platform.json'
import schemasJson from './schemas.json'
import type { GridColumn, PlatformConfig } from '~/types/platform'
export const platformConfig = platformJson as PlatformConfig
export const gridSchemas = schemasJson as Record<string, GridColumn[]>
export const getPageConfig = (route: string) => platformConfig.routes[route]
