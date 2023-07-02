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
import { CenteredCardLayout } from "~/components/layout/centered-card";
import { InvalidInviteCodeCard } from "~/components/team-invites/invalid-invite-code-card";
import { JoinTeamCard } from "~/components/team-invites/join-team-card";

export default function JoinTeamPage({
  team,
  token,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter();
  const handleJoinedTeam = (team: Team) => {
    void router.push(`/team/${team.id}`);
  };

  if (team === null) {
    return (
      <>
        <Head>
          <title>Join Team | Dev Recommendations</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <CenteredCardLayout>
          <InvalidInviteCodeCard />
        </CenteredCardLayout>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Join Team | Dev Recommendations</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <CenteredCardLayout>
        <JoinTeamCard
          teamName={team.name}
          invitedBy={team.invitedBy}
          token={token}
          onJoinedTeam={handleJoinedTeam}
        />
      </CenteredCardLayout>
    </>
  );
}

export const getServerSideProps: GetServerSideProps<{
  team: {
    name: string;
    invitedBy: string;
  } | null;
  token: string;
}> = async (ctx: GetServerSidePropsContext) => {
  if (!ctx.params || !ctx.params.token || Array.isArray(ctx.params.token))
    return { notFound: true };

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
      },
    };
  } catch (ex) {
    return {
      props: {
        team: null,
        token: ctx.params.token,
      },
    };
  }
};
