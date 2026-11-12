
import {
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';

export class CreateSolicitationDto {
  @IsUUID()
  animalId: string;

  @IsUUID()
  servicoId: string;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  observacoes?: string;
}
