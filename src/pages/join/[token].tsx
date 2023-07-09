import Head from "next/head";
import { clerkClient } from "@clerk/nextjs";
import type {
  GetServerSideProps,
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next";
import { getServices } from "~/server/service-builder";
import { prisma } from "~/server/db";
import { useRouter } from "next/router";
import type { Team } from "@prisma/client";
import { InvalidInviteCodeCard } from "~/components/team-invites/invalid-invite-code-card";
import { JoinTeamButton } from "~/components/team-invites/join-team-card";
import { AppHeaderLayout } from "~/components/layout/app-header";
import { getAuth } from "@clerk/nextjs/server";
import { GradientCard } from "~/components/ui/gradient-card";
import { TeamCard } from "~/components/teams/team-card";

export default function JoinTeamPage({
  team,
  token,
  isSignedIn,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter();
  const handleJoinedTeam = (team: Team) => {
    void router.push(`/team/${team.id}`);
  };

  if (team === null) {
    return (
      <>
        <Head>
          <title>Join Team | Rcmd 👍</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <AppHeaderLayout
          className="items-center justify-center"
          hideAppHeader={!isSignedIn}
        >
          <InvalidInviteCodeCard />
        </AppHeaderLayout>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Join Team | Rcmd 👍</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <AppHeaderLayout
        hideAppHeader={!isSignedIn}
        className="items-center justify-center"
      >
        <GradientCard className="flex w-full max-w-lg flex-col items-center gap-8 py-8">
          <div className="flex max-w-xs flex-col gap-2 text-center">
            <h3 className="text-lg font-medium">
              {team.invitedBy} has invited you to join {team.name} on Rcmd.
            </h3>
            <p className="text-sm text-muted-foreground">
              If you did not intend to receive this invite, you can safely
              ignore it.
            </p>
          </div>
          <TeamCard
            className="max-w-lg self-stretch"
            teamName={team.name}
            description={team.description}
            createdAt={team.createdAt}
            showCreatedAt={true}
            isClickable={false}
            joinedAt=""
            isNewPosts
            memberCount={100}
          />
          <JoinTeamButton
            teamName={team.name}
            token={token}
            onJoinedTeam={handleJoinedTeam}
          />
        </GradientCard>
      </AppHeaderLayout>
    </>
  );
}

export const getServerSideProps: GetServerSideProps<{
  team: {
    name: string;
    invitedBy: string;
    description: string;
    createdAt: string;
  } | null;
  token: string;
  isSignedIn: boolean;
}> = async (ctx: GetServerSidePropsContext) => {
  if (!ctx.params || !ctx.params.token || Array.isArray(ctx.params.token))
    return { notFound: true };

  const auth = getAuth(ctx.req);
  const isSignedIn = auth.userId !== null && auth.userId !== undefined;

  try {
    const { inviteCode: inviteCodeService } = getServices(
      prisma,
      clerkClient.users
    );

    const inviteCode = await inviteCodeService.getByToken(ctx.params.token);

    return {
      props: {
        team: {
          name: inviteCode.team.name,
          invitedBy: `${inviteCode.invitedByUser.firstName} ${inviteCode.invitedByUser.lastName}`,
          description: inviteCode.team.description,
          createdAt: inviteCode.team.createdAt.toISOString(),
        },
        token: ctx.params.token,
        isSignedIn,
      },
    };
  } catch (ex) {
    return {
      props: {
        team: null,
        token: ctx.params.token,
        isSignedIn,
      },
    };
  }
};
