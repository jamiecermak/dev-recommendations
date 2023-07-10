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
import Link from "next/link";
import { Button } from "~/components/ui/button";
import { Settings } from "lucide-react";
import { api } from "~/utils/api";
import { PostItemCard } from "~/components/posts/post-item-card";

export default function TeamDashboardPage({
  team,
  membership: { isAdmin },
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const latestPostsQuery = api.postDiscovery.getLatestByTeam.useQuery({
    teamId: team.id,
  });

  return (
    <>
      <Head>
        <title>{team.name} | Rcmd 👍</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <AppHeaderLayout
        header={team.name}
        aside={
          <div className="flex gap-2">
            {isAdmin && (
              <Link href={`/team/${team.id}/settings`}>
                <Button variant="ghost" size="icon">
                  <Settings className="h-5 w-5" />
                </Button>
              </Link>
            )}

            <Link href={`/team/${team.id}/post`}>
              <Button variant="primary">Create Post</Button>
            </Link>
          </div>
        }
      >
        <h2 className="mb-7 scroll-m-20 text-2xl font-semibold lg:text-2xl">
          Latest Posts
        </h2>
        <div className="grid grid-cols-1 gap-5">
          {latestPostsQuery.data &&
            latestPostsQuery.data.map((post) => (
              <Link key={post.id} href={post.href}>
                <PostItemCard post={post} />
              </Link>
            ))}
        </div>
      </AppHeaderLayout>
    </>
  );
}

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const { authGuard } = getServices(prisma, clerkClient.users);
  const pageAuth = new NextJSPageAuth(authGuard);

  return pageAuth.authoriseTeamViaServerContext(ctx);
};
