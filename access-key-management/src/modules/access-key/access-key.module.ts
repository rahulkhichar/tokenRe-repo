import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AccessKeyRepository } from './access-key.repository';
import { AccessKeyService } from './access-key.service';
import { UserModule } from '../User';

@Module({
    imports: [UserModule],
    providers: [AccessKeyService, AccessKeyRepository],
    controllers: [AdminController],
})
export class AccessKeyModule { }