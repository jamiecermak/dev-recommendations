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
    <div className="flex flex-col items-center gap-3">
      <SignUpButton>
        <Button size="lg" className="w-96" variant="primary">
          Join 1000+ Developers on Rcmd
        </Button>
      </SignUpButton>

      <p className="text-sm text-muted-foreground">
        Already have an account?{" "}
        <SignInButton>
          <a className="cursor-pointer font-medium text-slate-100 hover:underline">
            Sign in instead
          </a>
        </SignInButton>
      </p>
    </div>
  );
}

export function JoinTeamButton({
  token,
  teamName,
  onJoinedTeam,
}: {
  token: string;
  teamName: string;
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
    <SignInCardFooter>
      <Button
        size="lg"
        className="w-96"
        onClick={onJoinTeam}
        isLoading={joinTeamMutation.isLoading}
      >
        Join {teamName}
      </Button>
    </SignInCardFooter>
  );
}
