import { Module } from '@nestjs/common';
import { RedisModule } from '@nestjs-modules/ioredis';

@Module({
    imports: [
        RedisModule.forRoot({
            type: 'single',
            url: 'redis://0.0.0.0:8000'
        }),
    ],
    exports: [RedisModule],
})
export class RedisConfigModule { }