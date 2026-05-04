import { Injectable } from '@nestjs/common';
import * as fs from 'fs/promises';
import * as path from 'path';

@Injectable()
export class StorageService {
  async upload(filePath: string, buffer: Buffer): Promise<string> {
    const fullPath = path.join(__dirname, '..', '..', 'uploads', filePath);
    await fs.mkdir(path.dirname(fullPath), { recursive: true });
    await fs.writeFile(fullPath, buffer);
    return `http://localhost:4000/uploads/${filePath}`;
  }
}