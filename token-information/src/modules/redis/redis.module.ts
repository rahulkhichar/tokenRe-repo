import { Module } from '@nestjs/common';
import { RedisConfigModule } from './redis.config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { RedisPubSubService } from './redis-pubsub.service';

@Module({
    imports: [RedisConfigModule, EventEmitterModule.forRoot()],
    providers: [RedisPubSubService],
    exports: [RedisPubSubService],
})
export class RedisModule { }
