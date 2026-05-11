import { Job } from 'bull';
import { PrismaService } from '../../prisma/prisma.service';
import { StorageService } from '../../common/storage/storage.service';
export declare class ReportesProcessor {
    private prisma;
    private storage;
    constructor(prisma: PrismaService, storage: StorageService);
    handlePdfGeneration(job: Job): Promise<void>;
}
