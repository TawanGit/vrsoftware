import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';

import { RabbitMQService } from '../rabbitmq/rabbitmq.service';
import { NotificationController } from './notification.controller';
import { NotificationGateway } from './notification.gateway';

@Module({
  imports: [],
  controllers: [NotificationController],
  providers: [NotificationService, RabbitMQService, NotificationGateway],
})
export class NotificationModule {}
