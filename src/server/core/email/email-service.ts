export interface SendEmailOptions {
  to: string;
  subject: string;
  template: React.ReactElement;
}

export interface EmailService {
  /**
   * Send a rendered react-email to an email address
   *
   * @returns Email ID
   */
  sendEmail(options: SendEmailOptions): Promise<string>;

  /**
   * Get the email address that emails will addressed from
   *
   * @returns Email Address
   */
  getFromAddress(): string;
}

export class EmailSendError extends Error {
  constructor(service: string, message: string) {
    super(`Failed to send an email using ${service}: ${message}`);
    this.name = "EmailSendError";
  }
}
