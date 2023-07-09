import Head from "next/head";
import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next";
import { getServices } from "~/server/service-builder";
import { prisma } from "~/server/db";
import { clerkClient } from "@clerk/nextjs/server";
import { NextJSPageAuth } from "~/server/page-auth";
import { AppHeaderLayout } from "~/components/layout/app-header";
import { SidebarLayout } from "~/components/team-management/layout";
import { Card, CardContent } from "~/components/ui/card";
import { UpdateTeamForm } from "~/components/teams/update-team-form";

export default function SettingsPage({
  team,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <>
      <Head>
        <title>Team Settings | Rcmd 👍</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <AppHeaderLayout header="Team Management">
        <SidebarLayout teamId={team.id}>
          <div>
            <h3 className="text-lg font-medium">Team Info</h3>
            <p className="text-sm text-muted-foreground">
              Change your teams description and more.
            </p>
          </div>
          <div className="my-5 border-t border-t-slate-800" />
          <Card className="rounded-sm bg-gray-950 bg-gradient-to-br from-sky-950/40 py-6">
            <CardContent className="flex flex-col py-0">
              <UpdateTeamForm
                teamId={team.id}
                name={team.name}
                description={team.description}
              />
            </CardContent>
          </Card>
        </SidebarLayout>
      </AppHeaderLayout>
    </>
  );
}

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const { authGuard } = getServices(prisma, clerkClient.users);
  const pageAuth = new NextJSPageAuth(authGuard);

  return pageAuth.authoriseTeamViaServerContext(ctx, { isAdmin: true });
};
