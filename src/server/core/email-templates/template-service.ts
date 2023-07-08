import type { Team, User } from "@prisma/client";
import type { EmailService } from "../email/email-service";
import { JoinTeamEmail } from "./join-team-invitation";
import { InviteCodeService } from "../teams/invite-code-service";
import React from "react";

class EmailTemplateService {
  constructor(
    private appBaseUrl: string,
    private readonly emailService: EmailService
  ) {}

  private generateLink(path: string) {
    return `${this.appBaseUrl}${path}`;
  }

  sendJoinTeamInvitationEmail(
    inviteCode: string,
    inviteeEmailAddress: string,
    team: Team,
    invitedByUser: User
  ) {
    return this.emailService.sendEmail({
      subject: `Join ${team.name} on Rcmd`,
      to: inviteeEmailAddress,
      template: React.createElement(JoinTeamEmail, {
        sentToEmail: inviteeEmailAddress,
        inviteLink: this.generateLink(`/join/${inviteCode}`),
        invitedByEmail: invitedByUser.emailAddress,
        teamName: team.name,
        invitedByUser: `${invitedByUser.firstName} ${invitedByUser.lastName}`,
        expiresIn: `${InviteCodeService.DEFAULT_EXPIRATION_DAYS} days`,
      }),
    });
  }
}

export { EmailTemplateService };
