// dto/update-egresado.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { CreateEgresadoDto } from './create-egresado.dto';

export class UpdateEgresadoDto extends PartialType(CreateEgresadoDto) {}