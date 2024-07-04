import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TokenModule } from './modules/access-key-info/token.module';
import { AccessKey } from './modules';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getConfig } from './utils';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      ...getConfig().database,
      entities: [AccessKey],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([AccessKey]),
    TokenModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
