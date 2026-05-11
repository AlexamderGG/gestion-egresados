import { Controller, Post, Get, Param, Body, UseGuards, Request } from '@nestjs/common';
import { ReportesService } from './reportes.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@Controller('reportes')
@UseGuards(JwtAuthGuard)
export class ReportesController {
  constructor(private readonly reportesService: ReportesService) {}

  @Post()
  async solicitarReporte(@Request() req, @Body() body: { tipo: string; filtros: any }) {
    return this.reportesService.solicitarReporte(req.user.id, body.tipo, body.filtros);
  }

  @Get(':id/descargar')
  async descargarReporte(@Param('id') id: string) {
    return this.reportesService.descargarReporte(id);
  }
}
