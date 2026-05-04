import { Module } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { EgresadosService } from './egresados.service';
import { EgresadosController } from './egresados.controller';

@Module({
  controllers: [EgresadosController],
  providers: [EgresadosService, PrismaService],
  exports: [EgresadosService],
})
export class EgresadosModule {}