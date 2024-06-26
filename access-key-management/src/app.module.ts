import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccessKey, User } from './entities';
import { AdminSerivce } from './services/admin.service';
import { UserService } from './services/user.service';
import { AccessKeyService } from './services/access-key.service';
import { AccessKeyRepository } from './Repositories/access-key.repository';
import { UserRepository } from './Repositories/user.repository';
import { AdminController } from './controllers/admin.controller';
import { UserController } from './controllers/user.controller';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3305,
      username: 'root',
      password: 'password',
      database: 'access_key_management',
      entities: [User, AccessKey],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([User, AccessKey]),
  ],
  controllers: [AppController, AdminController, UserController],
  providers: [AppService, AdminSerivce, UserService, AccessKeyService, AccessKeyRepository, UserRepository],
})
export class AppModule {}
