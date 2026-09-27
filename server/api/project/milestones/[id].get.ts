import { readCollection,findById } from '~~/server/utils/jsonDatabase'
import { dataFileForRoute } from '~~/server/utils/routeData'
export default defineEventHandler(async(event)=>{const id=getRouterParam(event,'id')||'';const row=findById(await readCollection(dataFileForRoute("/project/milestones")),id);if(!row)throw createError({statusCode:404,statusMessage:'Record not found'});return {success:true,data:row}})
