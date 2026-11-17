import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Version & Deployment')
@Controller('version')
export class VersionController {
  @Get()
  @ApiOperation({ summary: 'Deployment version, commit SHA, and release metadata' })
  @ApiResponse({ status: 200, description: 'Current release information.' })
  getVersion() {
    return {
      name: 'devops-ticket-manager-api',
      version: process.env.APP_VERSION || '1.0.0',
      commitSha: process.env.COMMIT_SHA || 'local-dev',
      environment: process.env.NODE_ENV || 'development',
      deployedAt: new Date().toISOString(),
    };
  }
}