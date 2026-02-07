import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { TypeOrmModule } from '@nestjs/typeorm';
import { databaseConfig } from './config/database.config';
import { HealthModule } from './health/health.module';
import { TasksModule } from './tasks/tasks.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    // ── Rate Limiting (@nestjs/throttler) ──────────────────────────────
    // 10 requests per 1-minute window per IP → 429 Too Many Requests
    ThrottlerModule.forRoot({
      throttlers: [
        {
          name: 'default',
          ttl: 60 * 1000, // 1 minute (in milliseconds)
          limit: 10, // max 10 requests per window per IP
        },
      ],
    }),

    TypeOrmModule.forRootAsync(databaseConfig),
    HealthModule,
    TasksModule,
  ],
  providers: [
    // Apply ThrottlerGuard globally to all routes
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
