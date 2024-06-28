import { Injectable, OnModuleInit, OnModuleDestroy, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRedis } from '@nestjs-modules/ioredis';
import * as Redis from 'ioredis';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { KeyDetails } from './key-details.interface';

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
        await this.redis.hmset(`access-key:${key}`, {
            rateLimit: keyDetails.rateLimit.toString(),
            expiration: keyDetails.expiration.toString(),
            tokens: keyDetails.rateLimit.toString(),
            lastRefill: Date.now().toString(),
        });
    }

    private async validateKey(key: string): Promise<KeyDetails> {
        const keyDetails = await this.redis.hgetall(`access-key:${key}`);
        if (!keyDetails || Object.keys(keyDetails).length === 0) {
            throw new HttpException('Invalid or expired key', HttpStatus.UNAUTHORIZED);
        }

        const expiration = parseInt(keyDetails.expiration);
        if (Date.now() > Date.parse(keyDetails.expiration)) {
            throw new HttpException('Key has expired', HttpStatus.UNAUTHORIZED);
        }

        return {
            rateLimit: parseInt(keyDetails.rateLimit),
            expiration,
            tokens: parseInt(keyDetails.tokens),
        };
    }


    async getTokenInfo(key: string): Promise<any> {
        await this.validateKey(key);
        await this.checkRateLimit(key);

        return {
            name: "Getting Response Successfully",
        };
    }


    private async checkRateLimit(key: string): Promise<void> {
        const keyDetails = await this.redis.hgetall(`access-key:${key}`);
        const tokens = parseInt(keyDetails.tokens);
        const rateLimit = parseInt(keyDetails.rateLimit);
        const lastRefill = parseInt(keyDetails.lastRefill);
        const now = Date.now();

        // Refill tokens
        const elapsedSeconds = (now - lastRefill) / 1000;
        const refillRate = rateLimit / 60; // tokens per second
        const newTokens = Math.min(rateLimit, tokens + Math.floor(elapsedSeconds * refillRate));

        if (newTokens > 0) {
            // Consume a token
            await this.redis.hmset(`access-key:${key}`, {
                tokens: (newTokens - 1).toString(),
                lastRefill: now.toString(),
            });
        } else {
            throw new HttpException('Rate limit exceeded', HttpStatus.TOO_MANY_REQUESTS);
        }
    }


}
