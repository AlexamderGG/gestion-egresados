import { Global, Module } from '@nestjs/common';
import { TrpcService } from './trpc.service';
import { PrismaService } from '../prisma/prisma.service';

@Global() // opcional, para que esté disponible sin importar en cada módulo
@Module({
  providers: [TrpcService, PrismaService],
  exports: [TrpcService],
})
export class TrpcModule {}