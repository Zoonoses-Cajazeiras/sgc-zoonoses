
import {
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
  Length,
  Matches,
} from 'class-validator';

export class UpdateTutorProfileDto {
  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(120)
  nome?: string;

  @IsOptional()
  @IsString()
  @MaxLength(30)
  telefone?: string;

  @IsOptional()
  @IsString()
  @MaxLength(180)
  endereco?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  numero?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  bairro?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  cidade?: string;

  @IsOptional()
  @IsString()
  @Length(8, 8)
  @Matches(/^\d{8}$/, {
    message: 'O CEP deve conter exatamente 8 números.',
  })
  cep?: string;
}
