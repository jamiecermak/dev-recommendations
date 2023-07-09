/* eslint-disable @typescript-eslint/no-misused-promises */
import Head from "next/head";
import { Card, CardContent } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { api } from "~/utils/api";
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
import { Label } from "~/components/ui/label";

export default function SettingsPage({
  team,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const teamMembersQuery = api.teamMembers.getTeamMembersById.useQuery({
    id: team.id,
  });

  return (
    <>
      <Head>
        <title>Team Members | Rcmd 👍</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <AppHeaderLayout header="Team Management">
        <SidebarLayout teamId={team.id}>
          <div>
            <h3 className="text-lg font-medium">Team Members</h3>
            <p className="text-sm text-muted-foreground">
              Manage your team members.
            </p>
          </div>
          <div className="my-5 border-t border-t-slate-800" />

          <div className="grid grid-cols-2 gap-5">
            {teamMembersQuery.data &&
              teamMembersQuery.data.map((teamMember) => (
                <Card
                  key={teamMember.user.id}
                  className="rounded-sm bg-gray-950 bg-gradient-to-br from-sky-950/40 py-6"
                >
                  <CardContent className="flex flex-col py-0">
                    <h2 className="text-lg font-semibold tracking-tight">
                      {teamMember.user.name}
                    </h2>
                    <span className="mb-1 text-sm text-gray-400">
                      {teamMember.user.emailAddress}
                    </span>
                    <div className="mt-2 flex gap-1">
                      {teamMember.isOwner && (
                        <Label colorScheme="indigo" size="xs">
                          Owner
                        </Label>
                      )}
                      {teamMember.isAdmin && (
                        <Label colorScheme="sky" size="xs">
                          Admin
                        </Label>
                      )}
                      {!teamMember.isAdmin &&
                        !teamMember.isOwner &&
                        teamMember.isActive && (
                          <Label colorScheme="emerald" size="xs">
                            Team Member
                          </Label>
                        )}
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
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
