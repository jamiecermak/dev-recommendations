import Head from "next/head";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import {
  SignInButton,
  SignUpButton,
  clerkClient,
  useAuth,
} from "@clerk/nextjs";
import { ReloadIcon } from "@radix-ui/react-icons";
import type {
  GetServerSideProps,
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next";
import { getServices } from "~/server/service-builder";
import { prisma } from "~/server/db";

function SignInCardFooter({ children }: { children: React.ReactNode }) {
  const auth = useAuth();

  if (!auth.isLoaded) {
    return (
      <Button size="lg" className="w-96" disabled>
        <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
        Please wait
      </Button>
    );
  }

  if (auth.isSignedIn) {
    return children;
  }

  return (
    <>
      <SignUpButton>
        <Button size="lg" className="w-96">
          Sign up
        </Button>
      </SignUpButton>

      <p className="text-sm text-slate-400">
        Already have an account?{" "}
        <SignInButton>
          <a className="cursor-pointer font-medium text-slate-100 hover:underline">
            Sign in instead
          </a>
        </SignInButton>
      </p>
    </>
  );
}

export const getServerSideProps: GetServerSideProps<{
  team: {
    name: string;
    invitedBy: string;
  } | null;
  token: string;
}> = async (ctx: GetServerSidePropsContext) => {
  if (!ctx.params || !ctx.params.token || Array.isArray(ctx.params.token))
    return { notFound: true };

  try {
    const { inviteCode: inviteCodeService } = getServices(
      prisma,
      clerkClient.users
    );

    const inviteCode = await inviteCodeService.getByToken(ctx.params.token);

    return {
      props: {
        team: {
          name: inviteCode.team.name,
          invitedBy: inviteCode.invitedByUser.id,
        },
        token: ctx.params.token,
      },
    };
  } catch (ex) {
    return {
      props: {
        team: null,
        token: ctx.params.token,
      },
    };
  }
};

export default function JoinTeamPage({
  team,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <>
      <Head>
        <title>Join Team | Dev Recommendations</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="dark flex min-h-screen items-center justify-center bg-slate-900 text-white">
        <Card className="p-5">
          <CardHeader className="pb-0">
            <h1 className="scroll-m-20 text-center text-2xl font-extrabold tracking-tight lg:text-3xl">
              Join Team
            </h1>
          </CardHeader>
          <CardContent className="py-20">
            {team === null ? (
              <p>Invite code not valid</p>
            ) : (
              <>
                <p>{team.name}</p>
                <p>Invited by {team.invitedBy}</p>
              </>
            )}
          </CardContent>
          <CardFooter className="flex flex-col justify-center gap-5">
            <SignInCardFooter>
              <Button size="lg" className="w-96">
                Join now
              </Button>
            </SignInCardFooter>
          </CardFooter>
        </Card>
      </main>
    </>
  );
}
