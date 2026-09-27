import { updateRecord } from '~~/server/utils/jsonDatabase'
import { dataFileForRoute } from '~~/server/utils/routeData'
export default defineEventHandler(async(event)=>{const id=getRouterParam(event,'id')||'';const data=await updateRecord(dataFileForRoute("/quotation/approved"),id,await readBody<Record<string, unknown>>(event));return {success:true,message:'Updated',data}})
