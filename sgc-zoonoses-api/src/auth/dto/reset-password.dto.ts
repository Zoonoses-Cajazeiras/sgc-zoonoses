
import {
  IsEmail,
  IsString,
  Length,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class ResetPasswordDto {
  @IsEmail()
  @MaxLength(254)
  email!: string;

  @IsString()
  @Length(11, 11)
  @Matches(/^\d{11}$/, {
    message: 'O CPF deve conter exatamente 11 números.',
  })
  cpf!: string;

  @IsString()
  @Length(6, 6)
  @Matches(/^\d{6}$/, {
    message: 'O código deve conter exatamente seis números.',
  })
  codigo!: string;

  @IsString()
  @MinLength(8)
  @MaxLength(128)
  novaSenha!: string;
}
