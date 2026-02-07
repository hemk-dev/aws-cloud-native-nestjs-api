import { Injectable } from '@nestjs/common';

@Injectable()
export class HealthService {
  getHealthCheck() {
    return {
      status: 'ok',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    };
  }

  getMetrics() {
    const memoryUsage = process.memoryUsage();
    const cpuUsage = process.cpuUsage();

    return {
      uptime: process.uptime(),
      memory: {
        rss: `${(memoryUsage.rss / 1024 / 1024).toFixed(2)} MB`,
        heapTotal: `${(memoryUsage.heapTotal / 1024 / 1024).toFixed(2)} MB`,
        heapUsed: `${(memoryUsage.heapUsed / 1024 / 1024).toFixed(2)} MB`,
        external: `${(memoryUsage.external / 1024 / 1024).toFixed(2)} MB`,
      },
      cpu: {
        user: `${(cpuUsage.user / 1000).toFixed(2)} ms`,
        system: `${(cpuUsage.system / 1000).toFixed(2)} ms`,
      },
      pid: process.pid,
      nodeVersion: process.version,
      platform: process.platform,
      timestamp: new Date().toISOString(),
    };
  }
}
