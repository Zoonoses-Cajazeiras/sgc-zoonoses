import {
  IsEmail,
  IsOptional,
  IsString,
  Length,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class RegisterTutorDto {
  @IsString()
  @MinLength(3)
  @MaxLength(120)
  nome!: string;

  @IsEmail()
  @MaxLength(254)
  email!: string;

  @IsString()
  @MinLength(8)
  @MaxLength(128)
  password!: string;

  @IsString()
  @Length(11, 11)
  @Matches(/^\d{11}$/, {
    message: 'O CPF deve conter exatamente 11 números.',
  })
  cpf!: string;

  @IsString()
  @MaxLength(30)
  telefone!: string;

  @IsString()
  @MaxLength(180)
  endereco!: string;

  @IsString()
  @MaxLength(20)
  numero!: string;

  @IsString()
  @MaxLength(100)
  bairro!: string;

  @IsString()
  @MaxLength(100)
  cidade!: string;

  @IsString()
  @Length(8, 8)
  @Matches(/^\d{8}$/, {
    message: 'O CEP deve conter exatamente 8 números.',
  })
  cep!: string;

  @IsString()
  dataNascimento!: string;
}