import { Job } from 'bull';
import { StorageService } from '../common/storage/storage.service';
import { PrismaService } from '../prisma/prisma.service';
export declare class PdfWorker {
    private storage;
    private prisma;
    constructor(storage: StorageService, prisma: PrismaService);
    handlePdfGeneration(job: Job): Promise<void>;
}
