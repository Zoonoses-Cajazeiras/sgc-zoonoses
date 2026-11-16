
import {
  IsEmail,
  IsString,
  Length,
  Matches,
  MaxLength,
} from 'class-validator';

export class ChangeVerificationEmailDto {
  @IsEmail()
  @MaxLength(254)
  email!: string;

  @IsString()
  @Length(11, 11)
  @Matches(/^\d{11}$/, {
    message: 'O CPF deve conter exatamente 11 números.',
  })
  cpf!: string;

  @IsEmail()
  @MaxLength(254)
  novoEmail!: string;
}
