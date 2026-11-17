import { Controller, Get, HttpStatus, Res } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
// import { Response } from 'express';

@ApiTags('Health & Monitoring')
@Controller('health')
export class HealthController {
  private readonly startTime = Date.now();

  @Get()
  @ApiOperation({ summary: 'Comprehensive service health and system resource status' })
  @ApiResponse({ status: 200, description: 'Application is healthy.' })
  check() {
    const memoryUsage = process.memoryUsage();
    const uptimeSeconds = Math.floor((Date.now() - this.startTime) / 1000);

    const report = {
      status: 'ok',
      service: 'devops-ticket-manager-api',
      environment: process.env.NODE_ENV || 'development',
      timestamp: new Date().toISOString(),
      uptimeSeconds,
      system: {
        memory: {
          heapUsedMb: Math.round((memoryUsage.heapUsed / 1024 / 1024) * 100) / 100,
          heapTotalMb: Math.round((memoryUsage.heapTotal / 1024 / 1024) * 100) / 100,
          rssMb: Math.round((memoryUsage.rss / 1024 / 1024) * 100) / 100,
        },
        nodeVersion: process.version,
        pid: process.pid,
      },
    };

    return report;
  }

  @Get('liveness')
  @ApiOperation({ summary: 'Container liveness probe' })
  liveness() {
    return { status: 'alive', timestamp: new Date().toISOString() };
  }

  @Get('readiness')
  @ApiOperation({ summary: 'Load balancer readiness probe' })
  readiness() {
    return { status: 'ready', timestamp: new Date().toISOString() };
  }
}