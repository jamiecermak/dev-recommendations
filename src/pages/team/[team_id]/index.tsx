import Head from "next/head";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import type { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { getAuth } from "@clerk/nextjs/server";
import { getServices } from "~/server/service-builder";
import { prisma } from "~/server/db";
import { clerkClient } from "@clerk/nextjs/server";
import { useCurrentTeam } from "~/hooks/use-current-team";
import { AppHeaderLayout } from "~/components/layout/app-header";

export default function CreateTeamPage({
  teamName,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { team } = useCurrentTeam();

  return (
    <>
      <Head>
        <title>{teamName} | Rcmd 👍</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <AppHeaderLayout header={teamName}>
        <h2 className="scroll-m-20 text-2xl font-semibold lg:text-2xl">
          Newest Posts
        </h2>
        <h2 className="scroll-m-20 text-2xl font-semibold lg:text-2xl">
          Newest Posts
        </h2>
        <h2 className="scroll-m-20 text-2xl font-semibold lg:text-2xl">
          Newest Posts
        </h2>
        <Card className="p-5">
          <CardHeader className="pb-0">
            <h1 className="scroll-m-20 text-center text-2xl font-extrabold tracking-tight lg:text-3xl">
              Create Team
            </h1>
          </CardHeader>
          <CardContent className="py-20">
            <p>{team?.id}</p>
            <p>{team?.name}</p>
          </CardContent>
          <CardFooter className="flex flex-col justify-center gap-5">
            <Button size="lg" className="w-96">
              Create team
            </Button>
          </CardFooter>
        </Card>
      </AppHeaderLayout>
    </>
  );
}

export const getServerSideProps: GetServerSideProps<{
  teamName: string;
}> = async (ctx) => {
  if (!ctx.params || !ctx.params.team_id || Array.isArray(ctx.params.team_id))
    return { notFound: true };

  try {
    const auth = getAuth(ctx.req);
    const { authGuard } = getServices(prisma, clerkClient.users);

    const { team } = await authGuard.authoriseByTeamMember(
      auth.userId ?? null,
      ctx.params.team_id
    );

    return {
      props: {
        teamName: team.name,
      },
    };
  } catch (ex) {
    return {
      notFound: true,
    };
  }
};
