
import {
  IsIn,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateCampaignDto {
  @IsString()
  @MinLength(1)
  @MaxLength(180)
  title!: string;

  @IsString()
  @MinLength(1)
  @MaxLength(5000)
  description!: string;

  @IsIn(['ativa', 'encerrada', 'rascunho'])
  status!: 'ativa' | 'encerrada' | 'rascunho';

  @IsOptional()
  @IsString()
  @MaxLength(180)
  schedule?: string | null;

  @IsOptional()
  @IsString()
  @MaxLength(180)
  location?: string | null;

  @IsOptional()
  @IsString()
  @MaxLength(80)
  buttonText?: string;
}
