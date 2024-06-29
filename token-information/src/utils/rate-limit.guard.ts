import { Injectable, CanActivate, ExecutionContext, HttpException, HttpStatus } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { InjectRedis } from '@nestjs-modules/ioredis';
import * as Redis from 'ioredis';

@Injectable()
export class RateLimitGuard implements CanActivate {
    constructor(
        private reflector: Reflector,
        @InjectRedis() private readonly redis: Redis.Redis,
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const key = request.headers['x-access-key'];

        if (!key) {
            throw new HttpException('Access key is required', HttpStatus.UNAUTHORIZED);
        }

        const keyDetails = await this.redis.hgetall(`access-key:${key}`);
        if (!keyDetails || !keyDetails.rateLimit) {
            throw new HttpException('Invalid or expired key', HttpStatus.UNAUTHORIZED);
        }

        const rateLimit = parseInt(keyDetails.rateLimit, 10);
        const currentRequests = await this.redis.incr(`rate-limit:${key}`);
        if (currentRequests === 1) {
            await this.redis.expire(`rate-limit:${key}`, 60); // 1-minute window
        }

        if (currentRequests > rateLimit) {
            throw new HttpException('Rate limit exceeded', HttpStatus.TOO_MANY_REQUESTS);
        }

        return true;
    }
}
