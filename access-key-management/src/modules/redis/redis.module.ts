import { Module } from '@nestjs/common';
import { RedisConfigModule } from './redis.config';
import { RedisPubSubService } from './redis-pubsub.service';

@Module({
    imports: [RedisConfigModule],
    providers: [RedisPubSubService],
    exports: [RedisPubSubService],
})
export class RedisModule { }