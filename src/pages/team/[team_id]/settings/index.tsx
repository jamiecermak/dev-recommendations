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
        <SidebarLayout teamId={team.id}></SidebarLayout>
      </AppHeaderLayout>
    </>
  );
}

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const { authGuard } = getServices(prisma, clerkClient.users);
  const pageAuth = new NextJSPageAuth(authGuard);

  return pageAuth.authoriseTeamViaServerContext(ctx, { isAdmin: true });
};
