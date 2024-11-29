import Redis from 'ioredis'
import {initializeRedis} from '../lib/redis.config'

type LogType="info" | "error" | "success"|"warning"
export class LogService {
    private publisher:Redis|undefined

    constructor() {
        try {
            const redis=initializeRedis()
            if(redis){
                this.publisher=redis
            }
        } catch (error) {
            console.log('redis error')
        }
        
    }

    public async publishLogs(diagramID:string,type:LogType,message:string){
        if(this.publisher){
            await this.publisher.rpush(`logs-${diagramID}`,JSON.stringify({type,message}))
        }
    }
}