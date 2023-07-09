import Head from "next/head";
import { Button } from "~/components/ui/button";
import { api } from "~/utils/api";
import Link from "next/link";
import { AppHeaderLayout } from "~/components/layout/app-header";
import { TeamCard } from "~/components/teams/team-card";

export default function CreateTeamPage() {
  const query = api.teams.getMyTeams.useQuery();

  return (
    <>
      <Head>
        <title>My Teams</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <AppHeaderLayout
        header="Your Teams"
        aside={
          <Link href="/team/create">
            <Button variant="secondary">Create Team</Button>
          </Link>
        }
      >
        <div className="grid grid-cols-2 gap-7">
          {query.data &&
            query.data.map((teamMember) => (
              <Link
                key={teamMember.team.id}
                href={`/team/${teamMember.team.id}`}
              >
                <TeamCard
                  teamName={teamMember.team.name}
                  description={teamMember.team.description}
                  createdAt={teamMember.team.createdAt.toISOString()}
                  joinedAt={teamMember.createdAt.toISOString()}
                  isAdmin={teamMember.isAdmin}
                />
              </Link>
            ))}
        </div>
      </AppHeaderLayout>
    </>
  );
}
