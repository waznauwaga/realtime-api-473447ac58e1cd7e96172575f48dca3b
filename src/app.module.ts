import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { StateUsersGateway } from 'gateways/state-users/state-users.gateway';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService,StateUsersGateway],
})
export class AppModule {}
