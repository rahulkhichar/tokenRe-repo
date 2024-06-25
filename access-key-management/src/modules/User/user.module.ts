import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserRepository } from './user.repository';
import { UserController } from './user.controller';

@Module({
    providers: [UserService, UserRepository],
    controllers: [UserController],
    exports: [UserService], // Export UserService for potential use in other modules
})
export class UserModule { }