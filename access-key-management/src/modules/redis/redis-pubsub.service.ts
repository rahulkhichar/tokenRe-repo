import { Injectable } from '@nestjs/common';
import { InjectRedis } from '@nestjs-modules/ioredis';
import * as Redis from 'ioredis';

@Injectable()
export class RedisPubSubService {

    constructor(
        @InjectRedis() private readonly redis: Redis.Redis,
    ) { }

    async onModuleInit() {
    }




    async publish(channel: string, message: string): Promise<void> {
        return new Promise((resolve, reject) => {
            this.redis.publish(channel, message, (err) => {
                if (err) {
                    reject(err);
                    return;
                }
                console.log('Message published to channel:', channel, 'with message:', message);
                resolve();
            });
        });
    }


}
