import { createRecord } from '~~/server/utils/jsonDatabase'
import { dataFileForRoute } from '~~/server/utils/routeData'
export default defineEventHandler(async(event)=>{const body=await readBody<Record<string, unknown>>(event);const data=await createRecord(dataFileForRoute("/meeting/agenda"),body);return {success:true,message:'Created',data}})
