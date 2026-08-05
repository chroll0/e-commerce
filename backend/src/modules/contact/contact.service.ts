import { Injectable } from "@nestjs/common";
import * as nodemailer from "nodemailer";
import { ContactDto } from "./dto/contact.dto";

@Injectable()
export class ContactService {
  private transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  async send(dto: ContactDto) {
    await this.transporter.sendMail({
      from: `"Satori Contact" <${process.env.SMTP_USER}>`,
      to: process.env.CONTACT_RECEIVER,
      replyTo: dto.email,
      subject: `New message from ${dto.name}`,
      html: `
        <p><strong>Name:</strong> ${dto.name}</p>
        <p><strong>Email:</strong> ${dto.email}</p>
        <p><strong>Message:</strong><br/>${dto.message}</p>
      `,
    });

    return { success: true };
  }
}
