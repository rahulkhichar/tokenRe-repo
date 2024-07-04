import { Module } from '@nestjs/common';
import { RedisConfigModule } from './redis.config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { RedisPubSubService } from './redis-pubsub.service';
import { TokenModule } from '../access-key-info';

@Module({
    imports: [RedisConfigModule, EventEmitterModule.forRoot(), TokenModule],
    providers: [RedisPubSubService],
    exports: [RedisPubSubService],
})
export class RedisModule { }
