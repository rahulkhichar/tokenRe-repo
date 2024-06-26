import { Module } from '@nestjs/common';
import { AccessKeyRepository } from './access-key.repository';
import { AccessKeyService } from './access-key.service';
import { UserModule } from '../User';

@Module({
    imports: [],
    providers: [AccessKeyService, AccessKeyRepository],
    exports: [AccessKeyModule],
    controllers: [],
})
export class AccessKeyModule { }