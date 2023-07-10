import Head from "next/head";
import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next";
import { getServices } from "~/server/service-builder";
import { prisma } from "~/server/db";
import { clerkClient } from "@clerk/nextjs";
import { AppHeaderLayout } from "~/components/layout/app-header";
import { CreateInviteLinkButton } from "~/components/team-invites/create-invite-link-button";
import { NextJSPageAuth } from "~/server/page-auth";
import { SendInvitationEmailCard } from "~/components/team-invites/send-invitation-email-card";
import { SidebarLayout } from "~/components/team-management/layout";
import { Alert } from "~/components/ui/alert";
import { GradientCard } from "~/components/ui/gradient-card";

export default function MemberInvitePage({
  team,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <>
      <Head>
        <title>Invite Team Members | Rcmd 👍</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <AppHeaderLayout header="Team Management" className="gap-6">
        <SidebarLayout teamId={team.id} className="flex flex-col">
          <div>
            <h3 className="text-lg font-medium">Invitations</h3>
            <p className="text-sm text-muted-foreground">
              Invite more of your team mates. You can have an unlimited amount
              of team members.
            </p>
          </div>
          <div className="my-5 border-t border-t-slate-800" />
          <div className="flex flex-col gap-6">
            <Alert colorScheme="yellow">
              <Alert.Title>Heads up!</Alert.Title>
              <Alert.Description>
                Invite links will expire after 7 days, can only be used once,
                and can not be revoked.
              </Alert.Description>
            </Alert>

            <SendInvitationEmailCard teamId={team.id} teamName={team.name} />

            <GradientCard className="flex items-center justify-between">
              <div className="flex flex-col">
                <h2 className="scroll-m-20  text-lg font-semibold tracking-tight">
                  Create an invite link
                </h2>
                <div className="flex flex-col">
                  <p className="text-sm text-muted-foreground">
                    You can create a unique invite link to share.
                  </p>
                </div>
              </div>
              <CreateInviteLinkButton teamId={team.id} />
            </GradientCard>
          </div>
        </SidebarLayout>
      </AppHeaderLayout>
    </>
  );
}

export const getServerSideProps = (ctx: GetServerSidePropsContext) => {
  const { authGuard } = getServices(prisma, clerkClient.users);
  const pageAuth = new NextJSPageAuth(authGuard);

  return pageAuth.authoriseTeamViaServerContext(ctx, { isAdmin: true });
};
