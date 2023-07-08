import { type MockedResend, createMockedResend } from "~/utils/mock-resend";
import { ResendEmailService } from "./resend-email-service";
import * as React from "react";
import { EmailTemplateFixture } from "~/utils/email-template-fixture";

let mockResend: MockedResend;

beforeEach(() => {
  jest.resetAllMocks();

  mockResend = createMockedResend();
});

it("should get a from address", () => {
  const emailService = new ResendEmailService(
    "test-from-name",
    "from-address@example.com",
    mockResend
  );

  expect(emailService.getFromAddress()).toBe(
    "test-from-name <from-address@example.com>"
  );
});

it("should send an email", async () => {
  mockResend.sendEmail.mockResolvedValue({
    id: "email-id",
  });

  const emailService = new ResendEmailService(
    "Rcmd Notifications",
    "from-address@example.com",
    mockResend
  );

  const template = React.createElement(EmailTemplateFixture);

  await expect(
    emailService.sendEmail({
      to: "to-address@example.com",
      subject: "Test Email",
      template,
    })
  ).resolves.toBe("email-id");
  expect(mockResend.sendEmail).toHaveBeenCalledWith({
    from: "Rcmd Notifications <from-address@example.com>",
    to: "to-address@example.com",
    subject: "Test Email",
    react: template,
  });
});

it("should override the to address if an override is set", async () => {
  mockResend.sendEmail.mockResolvedValue({
    id: "email-id",
  });

  const emailService = new ResendEmailService(
    "Rcmd Notifications",
    "from-address@example.com",
    mockResend,
    "override-address@example.com"
  );

  await emailService.sendEmail({
    to: "to-address@example.com",
    subject: "Test Email",
    template: React.createElement(EmailTemplateFixture),
  });

  expect(mockResend.sendEmail).toHaveBeenCalledWith(
    expect.objectContaining({
      from: "Rcmd Notifications <from-address@example.com>",
      to: "override-address@example.com",
      subject: "Test Email",
    })
  );
});
