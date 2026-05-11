// backend/src/common/storage/storage.service.ts
import { Injectable } from '@nestjs/common';
import * as fs from 'fs/promises';
import * as path from 'path';

@Injectable()
export class StorageService {
  private uploadDir = path.join(process.cwd(), 'uploads');

  async upload(filePath: string, buffer: Buffer): Promise<string> {
    try {
      const fullPath = path.join(this.uploadDir, filePath);
      const dir = path.dirname(fullPath);
      
      console.log(`📁 Guardando archivo en: ${fullPath}`);
      
      // Crear directorio si no existe
      await fs.mkdir(dir, { recursive: true });
      
      // Guardar el archivo
      await fs.writeFile(fullPath, buffer);
      
      // Verificar que el archivo existe
      const exists = await fs.access(fullPath).then(() => true).catch(() => false);
      if (!exists) {
        throw new Error(`No se pudo guardar el archivo en ${fullPath}`);
      }
      
      console.log(`✅ Archivo guardado exitosamente: ${fullPath}`);
      
      // Devolver la ruta accesible desde el navegador
      return `http://localhost:4000/uploads/${filePath}`;
    } catch (error) {
      console.error('❌ Error guardando archivo:', error);
      throw error;
    }
  }

  async getSignedUrl(filePath: string): Promise<string> {
    return filePath;
  }
}