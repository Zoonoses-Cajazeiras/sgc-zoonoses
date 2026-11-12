
import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import nodemailer, { Transporter } from 'nodemailer';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private readonly transporter: Transporter;
  private readonly remetente: string;

  constructor(private readonly configService: ConfigService) {
    const email = this.configService.get<string>('EMAIL_USER');
    const senha = this.configService.get<string>('EMAIL_PASS');

    if (!email || !senha) {
      throw new Error('EMAIL_USER ou EMAIL_PASS não configurados no .env');
    }

    this.remetente = email;

    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: email,
        pass: senha,
      },
    });
  }

  async enviarCodigoVerificacao(email: string, codigo: string) {
    try {
      const resultado = await this.transporter.sendMail({
        from: `"Núcleo de Zoonoses" <${this.remetente}>`,
        to: email,
        subject: 'Código de verificação - Núcleo de Zoonoses',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 30px; color: #333;">
            <h2 style="color: #026B6D;">Núcleo de Zoonoses</h2>

            <p>Olá!</p>

            <p>
              Recebemos uma solicitação de cadastro no sistema
              do Núcleo de Zoonoses da Prefeitura de Cajazeiras.
            </p>

            <p>Utilize o código abaixo para confirmar seu endereço de e-mail:</p>

            <div style="background: #E8F7F7; padding: 20px; text-align: center; border-radius: 10px; margin: 25px 0;">
              <strong style="font-size: 32px; letter-spacing: 8px; color: #026B6D;">
                ${codigo}
              </strong>
            </div>

            <p>Este código expira em 10 minutos.</p>

            <p>Se você não solicitou este cadastro, pode ignorar esta mensagem.</p>

            <hr style="border: none; border-top: 1px solid #eee; margin-top: 30px;" />

            <p style="font-size: 12px; color: #888;">
              Núcleo de Zoonoses — Prefeitura de Cajazeiras
            </p>
          </div>
        `,
        text: `Seu código de verificação é: ${codigo}. Ele expira em 10 minutos.`,
      });

      this.logger.log(`E-mail enviado para ${email}. ID: ${resultado.messageId}`);

      return resultado;
    } catch (error) {
      const mensagem =
        error instanceof Error ? error.message : 'Erro desconhecido';

      this.logger.error(
        `Falha ao enviar e-mail para ${email}: ${mensagem}`,
      );

      throw new InternalServerErrorException(
        'Não foi possível enviar o e-mail de verificação.',
      );
    }
  }
}
