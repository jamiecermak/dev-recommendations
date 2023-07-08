import type { Resend } from "resend";
import {
  EmailSendError,
  type EmailService,
  type SendEmailOptions,
} from "./email-service";

class ResendEmailService implements EmailService {
  constructor(
    private readonly fromName: string,
    private readonly fromAddress: string,
    private readonly resend: Resend,
    private readonly overrideToEmailAddress?: string
  ) {}

  private getToAddress(to: string) {
    if (this.overrideToEmailAddress !== undefined)
      return this.overrideToEmailAddress;

    return to;
  }

  async sendEmail({ to, template, subject }: SendEmailOptions) {
    try {
      const { id } = await this.resend.sendEmail({
        from: this.getFromAddress(),
        to: this.getToAddress(to),
        subject,
        react: template,
      });

      return id;
    } catch (ex) {
      throw new ResendEmailSendError("Failed to send email");
    }
  }

  getFromAddress() {
    return `Rcmd Notifications <${this.fromAddress}>`;
  }
}

export class ResendEmailSendError extends EmailSendError {
  constructor(message: string) {
    super("Resend", message);
    this.name = "ResendEmailSendError";
  }
}

export { ResendEmailService };
