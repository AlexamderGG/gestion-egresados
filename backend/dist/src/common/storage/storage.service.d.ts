export declare class StorageService {
    private uploadDir;
    upload(filePath: string, buffer: Buffer): Promise<string>;
    getSignedUrl(filePath: string): Promise<string>;
}
