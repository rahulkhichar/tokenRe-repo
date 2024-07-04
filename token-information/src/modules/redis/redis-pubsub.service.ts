import { Injectable, OnModuleInit, OnModuleDestroy, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRedis } from '@nestjs-modules/ioredis';
import * as Redis from 'ioredis';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { KeyDetails } from './key-details.interface';
import { TokenService } from '../access-key-info';

@Injectable()
export class RedisPubSubService implements OnModuleInit, OnModuleDestroy {
    private subscriber: Redis.Redis;

    constructor(
        @InjectRedis() private readonly redis: Redis.Redis,
        private readonly eventEmitter: EventEmitter2,
        private readonly tokenService: TokenService
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

        const parsedJSON = JSON.parse(payload);
        const key = parsedJSON.id;
        const keyDetails = {
            rateLimit: parsedJSON.rateLimit,
            expiration: parsedJSON.expiration,
            tokens: parsedJSON.tokens
        };

        this.storeKeyDetails(key, keyDetails);

        console.log('Received message from channel2:', payload);
    }

    async storeKeyDetails(key: string, keyDetails: KeyDetails): Promise<void> {
        await this.tokenService.saveToken({
            accessKey: key,
            rateLimit: keyDetails.rateLimit,
            expiration: new Date(keyDetails.expiration),
            tokens: keyDetails.tokens
        })
    }

}
