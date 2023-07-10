import { clerkClient } from "@clerk/nextjs/server";
import {
  type InferGetServerSidePropsType,
  type GetServerSidePropsContext,
} from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { AppHeaderLayout } from "~/components/layout/app-header";
import { CreatePostForm } from "~/components/posts/create-post-form";
import { GradientCard } from "~/components/ui/gradient-card";
import { prisma } from "~/server/db";
import { NextJSPageAuth } from "~/server/page-auth";
import { getServices } from "~/server/service-builder";

export default function CreatePostPage({
  team,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter();

  const handleNewTeamCreated = () => {
    void router.push(`/team/${team.id}`);
  };

  return (
    <>
      <Head>
        <title>Create Post | Rcmd 👍</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <AppHeaderLayout header={`Post to ${team.name}`}>
        <GradientCard>
          <CreatePostForm
            teamId={team.id}
            onPostCreated={handleNewTeamCreated}
          />
        </GradientCard>
      </AppHeaderLayout>
    </>
  );
}

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const { authGuard } = getServices(prisma, clerkClient.users);
  const pageAuth = new NextJSPageAuth(authGuard);

  return pageAuth.authoriseTeamViaServerContext(ctx);
};
