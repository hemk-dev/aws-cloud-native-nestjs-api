import { Controller, Get } from '@nestjs/common';
import { HealthService } from './health.service';

@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get('check')
  healthCheck() {
    return this.healthService.getHealthCheck();
  }

  @Get('metrics')
  metrics() {
    return this.healthService.getMetrics();
  }
}
