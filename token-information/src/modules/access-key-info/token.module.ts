import { Module } from '@nestjs/common';
import { TokenService } from './token.service';
import { TokenController } from './token.controller';
import { RedisModule } from '../redis';

@Module({
    imports: [RedisModule],
    providers: [TokenService],
    exports: [],
    controllers: [TokenController],
})
export class TokenModule { }
