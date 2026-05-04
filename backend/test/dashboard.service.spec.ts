// backend/test/dashboard.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { DashboardService } from './dashboard.service';
import { PrismaService } from '../prisma.service';
import { Redis } from 'ioredis';

describe('DashboardService', () => {
  let service: DashboardService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DashboardService,
        { provide: PrismaService, useValue: { egresados: { count: jest.fn().mockResolvedValue(100) } } },
        { provide: 'REDIS_CLIENT', useValue: { get: jest.fn(), setex: jest.fn() } },
      ],
    }).compile();
    service = module.get<DashboardService>(DashboardService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('debería retornar KPIs cacheados', async () => {
    const result = await service.getGlobalKpis();
    expect(prisma.egresados.count).toHaveBeenCalled();
    expect(result.totalEgresados).toBe(100);
  });
});