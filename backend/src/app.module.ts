import { Module } from '@nestjs/common';
import { TrpcModule } from './trpc/trpc.module';
// ... otros imports

@Module({
  imports: [TrpcModule, /* otros módulos */],
})
export class AppModule {}