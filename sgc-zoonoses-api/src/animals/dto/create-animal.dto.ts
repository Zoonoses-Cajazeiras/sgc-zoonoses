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

export class CreateAnimalDto {
  @IsString()
  @MaxLength(100)
  nome: string;

  @IsEnum(EspecieAnimal)
  especie: EspecieAnimal;

  @IsOptional()
  @IsEnum(SexoAnimal)
  sexo?: SexoAnimal;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  raca?: string;

  @IsOptional()
  @IsString()
  @MaxLength(80)
  cor?: string;

  @IsOptional()
  @IsEnum(PorteAnimal)
  porte?: PorteAnimal;

  @IsOptional()
  @IsDateString()
  dataNascimento?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  idadeAproximadaMeses?: number;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  fotoUrl?: string;

  @IsOptional()
  @IsString()
  observacoes?: string;
}