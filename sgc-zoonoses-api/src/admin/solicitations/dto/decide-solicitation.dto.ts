
import { IsIn, IsOptional, IsString, MaxLength } from 'class-validator';

export class DecideSolicitationDto {
  @IsIn(['APROVADA', 'RECUSADA'], {
    message: 'A decisão deve ser APROVADA ou RECUSADA.',
  })
  status: 'APROVADA' | 'RECUSADA';

  @IsOptional()
  @IsString({ message: 'A observação deve ser um texto.' })
  @MaxLength(2000, {
    message: 'A observação deve ter no máximo 2000 caracteres.',
  })
  observacao?: string;
}
