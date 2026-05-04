import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { TrpcService } from './trpc/trpc.service';
import * as trpcExpress from '@trpc/server/adapters/express';
import { createContext } from './trpc/context';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
   app.enableCors(); 
  // Obtener instancia de TrpcService
  const trpcService = app.get(TrpcService);
  
  app.use('/trpc', trpcExpress.createExpressMiddleware({
    router: trpcService.appRouter,
    createContext,
  }));
  
  await app.listen(4000);
  console.log('Backend running on http://localhost:4000');
}
bootstrap();