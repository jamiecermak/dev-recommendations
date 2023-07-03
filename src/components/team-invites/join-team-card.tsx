import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { SignInButton, SignUpButton, useAuth } from "@clerk/nextjs";
import { ReloadIcon } from "@radix-ui/react-icons";
import { api } from "~/utils/api";
import type { Team } from "@prisma/client";

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

export function JoinTeamCard({
  token,
  teamName,
  invitedBy,
  onJoinedTeam,
}: {
  token: string;
  teamName: string;
  invitedBy: string;
  onJoinedTeam: (team: Team) => void;
}) {
  const joinTeamMutation = api.teamInvites.joinTeam.useMutation({
    onSuccess: onJoinedTeam,
  });

  const onJoinTeam = () => {
    joinTeamMutation.mutate(
      {
        token,
      },
      {
        onSuccess: onJoinedTeam,
      }
    );
  };

  return (
    <Card className="p-5">
      <CardHeader className="pb-0">
        <h1 className="scroll-m-20 text-center text-2xl font-extrabold tracking-tight lg:text-3xl">
          Join Team
        </h1>
      </CardHeader>
      <CardContent className="py-20">
        <p>{teamName}</p>
        <p>Invited by {invitedBy}</p>
      </CardContent>
      <CardFooter className="flex flex-col justify-center gap-5">
        <SignInCardFooter>
          <Button
            size="lg"
            className="w-96"
            onClick={onJoinTeam}
            isLoading={joinTeamMutation.isLoading}
          >
            Join now
          </Button>
        </SignInCardFooter>
      </CardFooter>
    </Card>
  );
}
