import Head from "next/head";
import { useRouter } from "next/router";
import { AppHeaderLayout } from "~/components/layout/app-header";
import { CreateTeamForm } from "~/components/teams/create-team-form";

export default function CreateTeamPage() {
  const router = useRouter();

  const handleNewTeamCreated = (id: string) => {
    void router.push(`/team/${id}`);
  };

  return (
    <>
      <Head>
        <title>Create New Team | Rcmd 👍</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <AppHeaderLayout header="Let's kick start your new team!">
        <CreateTeamForm onTeamCreated={handleNewTeamCreated} />
      </AppHeaderLayout>
    </>
  );
}
