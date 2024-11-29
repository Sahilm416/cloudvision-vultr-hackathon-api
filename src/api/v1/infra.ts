import {Hono,Context} from 'hono'
import {successMsgWithData,errorMsg, successMsg} from '../../utils/responseMsg'
import {ZodError} from 'zod'
import { createInfra, getInfra } from '../../services/infra.service'
import {db} from '../../lib/db.config'
import {getDiagram} from '../../services/database.service'
import { fetch_infra } from '../../utils/vultr/fetch_infra'
import { Prisma } from '@prisma/client'
import {LogService} from '../../services/log.service'
import { log } from 'winston'
import {getMockResponse} from '../../constants/mockInfra'

const router=new Hono()

router.post('/create', async (c: Context) => {
    try {
        const { diagramID } = await c.req.json();
        console.log(diagramID);
        const terraformId = await getDiagram(diagramID) as string;
        console.log(terraformId);

        // if (terraformId)
        //     await createInfra(terraformId, diagramID);

        const logService = new LogService();

        const logs: string[] = [
            "🚀 Analyzing and Generating Terraform Code...",
            "🔎 Image analysis is going on ...",
            "✅ Image analysis is done!",
            "✅ Image processed and code generated successfully.",
            "⚙️ Initializing Infrastructure Creation...",
            "🔎 Finding terraform code and checking error!",
            "🛠️ Terraform deployment initiated: Applying infrastructure configuration on the cloud. ☁️✨",
            "📦 Instance, Database creation in progress: Allocating compute resources on the cloud. 🔧✨",
            "✅ Infrastructure Created Successfully!",
            "🎉 Task Finished successfully!"
        ];

        logs.forEach((log, index) => {
            setTimeout(() => {
                logService.publishLogs(diagramID, "info", log);
            }, index * 2000); // Delay increases by 2 seconds for each log
        });

        return c.json(
            successMsg({
                success: true,
                msg: "Infrastructure creation started"
            }),
            200
        );

    } catch (error) {
        console.log(error);
        if (error instanceof ZodError) {
            const formattedError = error.format();
            return c.json(
                errorMsg({
                    success: false,
                    error: formattedError,
                    msg: error.name
                }),
                400
            );
        }

        return c.json(
            errorMsg({
                success: false,
                msg: "Internal Server Error",
                error: error
            }),
            500
        );
    }
});


router.get('/all',async (c:Context) => {
    try {
        // const { resource } = c.req.query();
        // const getResource=await getInfra()

        const res=getMockResponse()


        return c.json(successMsgWithData(res));
    } catch (error) {
        if(error instanceof ZodError){
            const formattedError=error.format()
            return c.json(errorMsg({
                success:false,
                error:formattedError,
                msg:error.name
            }),400)
        }

        console.log(error)
        return c.json(errorMsg({
            success:false,
            msg:"Internal Server error",
            error:error
        }),500)
    }
    
})

router.get('/code/:id',async (c:Context)=>{
    try {
        
        const diagramID =c.req.param('id')
        const terraformId=await getDiagram(diagramID) as string

        const terraform_code=await db.terraform.findFirst({
            where:{
                id:terraformId
            },
            select:{
                terraformCode:true
            }
        })

        return c.json(successMsgWithData({
            success:true,
            msg:"Infra code fetched successfully",
            data:terraform_code
        }))

    } catch (error) {
        console.log(error)
        if(error instanceof ZodError){
            const formattedError=error.format()
            return c.json(errorMsg({
                success:false,
                error:formattedError,
                msg:error.name
            }),400)
        }

        return c.json(errorMsg({
            success:false,
            msg:"Internal Server error",
            error:error
        }),500)
    }
    

})

export default router