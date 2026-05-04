import { Injectable } from '@nestjs/common';
import { appRouter } from './trpc.router';

@Injectable()
export class TrpcService {
  public readonly appRouter = appRouter;
}