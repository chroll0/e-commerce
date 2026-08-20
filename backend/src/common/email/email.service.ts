import {
  Injectable,
  Logger,
  ServiceUnavailableException,
} from "@nestjs/common";
import * as nodemailer from "nodemailer";

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private readonly transporter = this.createTransporter();

  private createTransporter() {
    const host = process.env.SMTP_HOST;
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;

    if (!host || !user || !pass) return null;

    return nodemailer.createTransport({
      host,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === "true",
      auth: { user, pass },
    });
  }

  async sendVerificationEmail(email: string, token: string) {
    const url = this.buildUrl("verify-email", token);
    return this.sendOrLog({
      to: email,
      subject: "Verify your eShop email",
      text: `Verify your email by opening: ${url}`,
      html: `<p>Please verify your eShop email.</p><p><a href="${url}">Verify email</a></p>`,
      developmentUrl: url,
    });
  }

  async sendPasswordResetEmail(email: string, token: string) {
    const url = this.buildUrl("reset-password", token);
    return this.sendOrLog({
      to: email,
      subject: "Reset your eShop password",
      text: `Reset your password by opening: ${url}`,
      html: `<p>Reset your eShop password.</p><p><a href="${url}">Reset password</a></p>`,
      developmentUrl: url,
    });
  }

  private buildUrl(path: string, token: string) {
    const base = process.env.FRONTEND_URL?.replace(/\/$/, "");
    return `${base || "http://localhost:3000"}/en/auth/${path}?token=${encodeURIComponent(token)}`;
  }

  private async sendOrLog(input: {
    to: string;
    subject: string;
    text: string;
    html: string;
    developmentUrl: string;
  }) {
    if (!this.transporter) {
      if (process.env.NODE_ENV === "production") {
        throw new ServiceUnavailableException("Email delivery is unavailable");
      }

      this.logger.warn(`Development email link: ${input.developmentUrl}`);
      return;
    }

    await this.transporter.sendMail({
      from: process.env.EMAIL_FROM || process.env.SMTP_USER,
      to: input.to,
      subject: input.subject,
      text: input.text,
      html: input.html,
    });
  }
}
