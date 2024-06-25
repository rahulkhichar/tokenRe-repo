import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccessKey, AccessKeyModule, User, UserModule } from './modules';

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
    UserModule,
    AccessKeyModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
