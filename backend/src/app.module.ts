import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HealthController } from './health/health.controller';
import { VersionController } from './version/version.controller';

@Module({
  imports: [],
  controllers: [AppController, HealthController, VersionController],
  providers: [AppService],
})
export class AppModule {}