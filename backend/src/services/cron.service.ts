// backend/src/services/cron.service.ts
import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CronService {
  constructor(private prisma: PrismaService) {}

  // Ejecuta cada día a medianoche
  @Cron('0 0 * * *')
  async cerrarOfertasVencidas() {
    const hoy = new Date();
    console.log(`🕐 Ejecutando: cerrar ofertas vencidas - ${hoy.toLocaleString()}`);
    
    try {
      const result = await this.prisma.oferta.updateMany({
        where: {
          activa: true,
          fechaCierre: {
            lt: hoy,
          },
        },
        data: { activa: false },
      });
      
      if (result.count > 0) {
        console.log(`🔒 Se cerraron ${result.count} ofertas por fecha de vencimiento`);
      }
    } catch (error) {
      console.error('❌ Error al cerrar ofertas vencidas:', error);
    }
  }

  // Ejecuta cada hora para verificar vacantes completas
  @Cron('0 * * * *')
  async verificarVacantesCompletas() {
    try {
      const ofertas = await this.prisma.oferta.findMany({
        where: {
          activa: true,
        },
      });
      
      for (const oferta of ofertas) {
        if (oferta.vacantesCubiertas >= oferta.vacantes) {
          await this.prisma.oferta.update({
            where: { id: oferta.id },
            data: { activa: false, fechaCierre: new Date() },
          });
          console.log(`🔒 Oferta "${oferta.titulo}" cerrada por completar vacantes`);
        }
      }
    } catch (error) {
      console.error('Error verificando vacantes:', error);
    }
  }
}