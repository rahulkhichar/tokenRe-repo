import { Module } from '@nestjs/common';

import { UserModule } from '../User';
import { AdminController } from './admin.controller';
import { AccessKeyModule } from '../access-key';
import { AdminSerivce } from './admin.service';

@Module({
    imports: [UserModule, AccessKeyModule],
    providers: [AdminSerivce],
    controllers: [AdminController],
})
export class AdminModule { }