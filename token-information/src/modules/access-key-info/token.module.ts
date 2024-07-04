import { Module } from '@nestjs/common';
import { TokenService } from './token.service';
import { TokenController } from './token.controller';
import { AccessKeyRepository } from './access-key-info.repository';

@Module({
    imports: [],
    providers: [TokenService, AccessKeyRepository],
    exports: [TokenService],
    controllers: [TokenController],
})
export class TokenModule { }
