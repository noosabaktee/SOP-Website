import { readCollection } from '~~/server/utils/jsonDatabase'
import { queryCollection } from '~~/server/utils/queryCollection'
import { dataFileForRoute } from '~~/server/utils/routeData'
export default defineEventHandler(async(event)=>{const rows=await readCollection(dataFileForRoute("/project/planning"));return {success:true,...queryCollection(rows,getQuery(event) as Record<string,unknown>)}})
