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
import Link from "next/link";

export default function CreateTeamPage() {
  const query = api.teams.getMyTeams.useQuery();

  return (
    <>
      <Head>
        <title>My Teams</title>
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
            {query.data &&
              query.data.map((teamMember) => (
                <Link
                  key={teamMember.team.id}
                  href={`/team/${teamMember.team.id}`}
                >
                  <Button size="lg" className="w-96">
                    {teamMember.team.name}
                  </Button>
                </Link>
              ))}
          </CardContent>
          <CardFooter className="flex flex-col justify-center gap-5"></CardFooter>
        </Card>
      </main>
    </>
  );
}