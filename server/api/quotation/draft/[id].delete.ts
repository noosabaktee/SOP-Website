import { deleteRecord } from '~~/server/utils/jsonDatabase'
import { dataFileForRoute } from '~~/server/utils/routeData'
export default defineEventHandler(async(event)=>{const id=getRouterParam(event,'id')||'';await deleteRecord(dataFileForRoute("/quotation/draft"),id);return {success:true,message:'Deleted',data:{id}}})
