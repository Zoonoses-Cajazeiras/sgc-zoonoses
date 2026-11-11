
import {
  IsDateString,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

import {
  EspecieAnimal,
  SexoAnimal,
  PorteAnimal,
} from '../../generated/prisma/client.js';

export class UpdateAnimalDto {
  @IsOptional()
  @IsString()
  @MaxLength(100)
  nome?: string;

  @IsOptional()
  @IsEnum(EspecieAnimal)
  especie?: EspecieAnimal;

  @IsOptional()
  @IsEnum(SexoAnimal)
  sexo?: SexoAnimal;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  raca?: string | null;

  @IsOptional()
  @IsString()
  @MaxLength(80)
  cor?: string | null;

  @IsOptional()
  @IsEnum(PorteAnimal)
  porte?: PorteAnimal;

  @IsOptional()
  @IsDateString()
  dataNascimento?: string | null;

  @IsOptional()
  @IsInt()
  @Min(0)
  idadeAproximadaMeses?: number | null;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  fotoUrl?: string | null;

  @IsOptional()
  @IsString()
  observacoes?: string | null;
}
