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
import { Card, CardContent } from "~/components/ui/card";

export default function MemberInvitePage({
  team,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <>
      <Head>
        <title>Invite Team Member | Rcmd 👍</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <AppHeaderLayout header="Invite team members" className="gap-6">
        <Card className="border-yellow-500 bg-gray-900 py-5">
          <CardContent className="flex flex-col gap-1 py-0">
            <h2 className="scroll-m-20  text-lg font-semibold tracking-tight">
              Heads up!
            </h2>
            <p className="text-md text-gray-400">
              Invite links will expire after 7 days, can only be used once, and
              can not be revoked.
            </p>
          </CardContent>
        </Card>
        <Card className="bg-gray-900 py-6">
          <CardContent className="flex items-center justify-between py-0">
            <div className="flex flex-col gap-2">
              <h2 className="scroll-m-20  text-lg font-semibold tracking-tight">
                Create an invite link
              </h2>
              <div className="flex flex-col">
                <p className="text-md text-gray-400">
                  You can create a unique invite link to share.
                </p>
              </div>
            </div>
            <CreateInviteLinkButton teamId={team.id} />
          </CardContent>
        </Card>
        <SendInvitationEmailCard teamId={team.id} teamName={team.name} />
      </AppHeaderLayout>
    </>
  );
}

export const getServerSideProps = (ctx: GetServerSidePropsContext) => {
  const { authGuard } = getServices(prisma, clerkClient.users);
  const pageAuth = new NextJSPageAuth(authGuard);

  return pageAuth.authoriseTeamViaServerContext(ctx, { isAdmin: true });
};
