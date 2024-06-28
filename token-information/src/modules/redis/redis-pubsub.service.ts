import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { InjectRedis } from '@nestjs-modules/ioredis';
import * as Redis from 'ioredis';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';

@Injectable()
export class RedisPubSubService implements OnModuleInit, OnModuleDestroy {
    private subscriber: Redis.Redis;

    constructor(
        @InjectRedis() private readonly redis: Redis.Redis,
        private readonly eventEmitter: EventEmitter2,
    ) { }

    async onModuleInit() {
        this.subscriber = this.redis.duplicate();

        this.subscriber.on('message', (channel, message) => {
            this.eventEmitter.emit(channel, message);
        });

        this.subscriber.on('error', (error) => {
            console.error('Redis subscriber error:', error);
        });

        const channelsToSubscribe = ['access-key'];
        for (const channel of channelsToSubscribe) {
            await this.subscribe(channel);
        }
    }

    async onModuleDestroy() {
        await this.subscriber.quit();
    }



    async subscribe(channel: string): Promise<void> {
        await this.subscriber.subscribe(channel);
        console.log(`Subscribed to channel: ${channel}`);
    }

    async unsubscribe(channel: string): Promise<void> {
        await this.subscriber.unsubscribe(channel);
        console.log(`Unsubscribed from channel: ${channel}`);
    }

    @OnEvent('access-key')
    handleChannel2Event(payload: string) {
        console.log('Received message from channel2:', payload);
        // Handle the event for channel2
    }
}
