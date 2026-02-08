import { Controller } from '@nestjs/common';
import { SkipThrottle } from '@nestjs/throttler';
import { PrometheusController } from '@willsoto/nestjs-prometheus';

@SkipThrottle() // Exclude metrics endpoint from rate limiting for Prometheus scraping
@Controller('metrics')
export class MetricsController extends PrometheusController {}
