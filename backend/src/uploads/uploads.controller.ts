// backend/src/uploads/uploads.controller.ts
import { Controller, Get, Param, Res } from '@nestjs/common';
import { Response } from 'express';
import * as fs from 'fs';
import * as path from 'path';

@Controller('uploads')
export class UploadsController {
  @Get('*')
  async getFile(@Param('0') filePath: string, @Res() res: Response) {
    const fullPath = path.join(process.cwd(), 'uploads', filePath);
    
    console.log(`📁 Solicitando archivo: ${fullPath}`);
    
    if (fs.existsSync(fullPath)) {
      res.sendFile(fullPath);
    } else {
      console.log(`❌ Archivo no encontrado: ${fullPath}`);
      res.status(404).json({ error: 'Archivo no encontrado' });
    }
  }
}