import { Controller, Get } from '@nestjs/common';
import { EgresadosService } from './egresados.service';

@Controller('egresados')
export class EgresadosController {
  constructor(private readonly egresadosService: EgresadosService) {}
}
