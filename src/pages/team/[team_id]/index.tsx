import Head from "next/head";
import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next";
import { getServices } from "~/server/service-builder";
import { prisma } from "~/server/db";
import { clerkClient } from "@clerk/nextjs/server";
import { AppHeaderLayout } from "~/components/layout/app-header";
import { NextJSPageAuth } from "~/server/page-auth";

export default function TeamDashboardPage({
  team,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <>
      <Head>
        <title>{team.name} | Rcmd 👍</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <AppHeaderLayout header={team.name}>
        <h2 className="scroll-m-20 text-2xl font-semibold lg:text-2xl">
          Latest Posts
        </h2>
        <h2 className="scroll-m-20 text-2xl font-semibold lg:text-2xl">
          Popular this week
        </h2>
        <h2 className="scroll-m-20 text-2xl font-semibold lg:text-2xl">
          Top rated all time
        </h2>
      </AppHeaderLayout>
    </>
  );
}

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const { authGuard } = getServices(prisma, clerkClient.users);
  const pageAuth = new NextJSPageAuth(authGuard);

  return pageAuth.authoriseTeamViaServerContext(ctx);
};
