/* eslint-disable @typescript-eslint/no-misused-promises */
import Head from "next/head";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { api } from "~/utils/api";
import { GetServerSideProps, GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { Team } from "@prisma/client";
import { clerkClient, getAuth } from "@clerk/nextjs/server";
import { ClerkUserService } from "~/server/core/clerk-user-service";
import { prisma } from "~/server/db";
import { TeamsService } from "~/server/core/teams-service";

export const getServerSideProps: GetServerSideProps<{
    teamId: string
  }> = async (ctx: GetServerSidePropsContext) => {
    if (!ctx.params || !ctx.params.teamId || Array.isArray(ctx.params.teamId)) return { notFound: true }

    try {
        const auth = getAuth(ctx.req)
        const clerkUser = auth.userId ? await clerkClient.users.getUser(auth.userId) : null;

        if (!auth || !auth.userId || clerkUser === null) {
          return {
            notFound: true
          }
        }
      
        const clerkUserService = new ClerkUserService(prisma)
        const user = await clerkUserService.getOrCreateFromClerkUserId(auth.userId);

        const teamsService = new TeamsService(prisma)

        const team = await teamsService.getByIdOrThrow(ctx.params.teamId)

        return { props: { teamId: team.id }}
    } catch {
        return {
            notFound: true
        }
    }
  }

export default function CreateTeamPage({
    teamId,
  }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const query = api.teams.getTeamById.useQuery({ id: teamId });

  return (
    <>
      <Head>
        <title>Create New Team</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="dark flex min-h-screen items-center justify-center bg-slate-900 text-white">
          <Card className="p-5">
            <CardHeader className="pb-0">
              <h1 className="scroll-m-20 text-center text-2xl font-extrabold tracking-tight lg:text-3xl">
                Create Team
              </h1>
            </CardHeader>
            <CardContent className="py-20">
                <p>{query.data?.id}</p>
                <p>{query.data?.name}</p>
            </CardContent>
            <CardFooter className="flex flex-col justify-center gap-5">
              <Button
                size="lg"
                className="w-96"
              >
                Create team
              </Button>
            </CardFooter>
          </Card>
      </main>
    </>
  );
}
