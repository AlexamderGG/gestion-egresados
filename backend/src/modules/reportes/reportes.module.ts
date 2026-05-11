// backend/src/modules/reportes/reportes.module.ts
import { Module } from '@nestjs/common';
import { ReportesService } from './reportes.service';
import { PrismaService } from '../../prisma/prisma.service';
import { StorageService } from '../../common/storage/storage.service';

@Module({
  providers: [ReportesService, PrismaService, StorageService],
  exports: [ReportesService],
})
export class ReportesModule {}