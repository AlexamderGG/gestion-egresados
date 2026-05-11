import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
// import { BullModule } from '@nestjs/bull';
import { TrpcModule } from './trpc/trpc.module';
import { AuthModule } from './modules/auth/auth.module';
import { EgresadosModule } from './modules/egresados/egresados.module';
import { ReportesModule } from './modules/reportes/reportes.module';
import { UploadsController } from './uploads/uploads.controller';
import { CronService } from './services/cron.service';
import { PrismaService } from './prisma/prisma.service'; // ← Agregar
import { ScheduleModule } from '@nestjs/schedule'; // ← Agregar


@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    // BullModule.forRootAsync({
    //   imports: [ConfigModule],
    //   useFactory: async (configService: ConfigService) => ({
    //     redis: {
    //       host: configService.get('REDIS_HOST', 'localhost'),
    //       port: configService.get('REDIS_PORT', 6379),
    //     },
    //   }),
    //   inject: [ConfigService],
    // }),
    ScheduleModule.forRoot(), // ← Agregar
    AuthModule,
    EgresadosModule,
    ReportesModule,
    TrpcModule,
  ],

  controllers: [UploadsController],
  providers: [CronService, PrismaService],
})
export class AppModule {}