import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { HealthController } from './health/health.controller.js';
import { VersionController } from './version/version.controller.js';
import { TicketsModule } from './tickets/tickets.module.js';

@Module({
  imports: [TicketsModule],
  controllers: [AppController, HealthController, VersionController],
  providers: [AppService],
})
export class AppModule {}