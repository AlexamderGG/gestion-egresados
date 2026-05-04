import { IsString, IsInt, IsOptional, IsArray, ValidateNested, IsUUID, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

class HabilidadDto {
  @IsUUID()
  habilidadId: string;

  @IsInt()
  @Min(1)
  @Max(5)
  nivel: number;
}

export class CreateEgresadoDto {
  @IsString()
  nombres: string;

  @IsString()
  apellidos: string;

  @IsOptional()
  @IsString()
  telefono?: string;

  @IsString()
  carrera: string;

  @IsInt()
  anio_egreso: number;

  @IsOptional()
  @IsString()
  cv_url?: string;

  @IsOptional()
  @IsString()
  habilidades_blandas?: string;

  @IsOptional()
  fecha_nacimiento?: Date;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => HabilidadDto)
  habilidades: HabilidadDto[];
}