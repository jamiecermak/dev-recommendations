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
import { JoinTeamCard } from "~/components/team-invites/join-team-card";
import { AppHeaderLayout } from "~/components/layout/app-header";
import { getAuth } from "@clerk/nextjs/server";

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
      <AppHeaderLayout hideAppHeader={!isSignedIn}>
        <JoinTeamCard
          teamName={team.name}
          invitedBy={team.invitedBy}
          token={token}
          onJoinedTeam={handleJoinedTeam}
        />
      </AppHeaderLayout>
    </>
  );
}

export const getServerSideProps: GetServerSideProps<{
  team: {
    name: string;
    invitedBy: string;
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
          invitedBy: inviteCode.invitedByUser.id,
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
