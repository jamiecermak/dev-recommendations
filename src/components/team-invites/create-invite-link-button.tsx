import { Check, Link } from "lucide-react";
import { Button } from "../ui/button";
import { api } from "~/utils/api";
import { useCopyToClipboard } from "usehooks-ts";

export function CreateInviteLinkButton({ teamId }: { teamId: string }) {
  const [, copyToClipboard] = useCopyToClipboard();
  const createInviteCodeMutation = api.teams.createInviteCode.useMutation();

  const handleClick = () => {
    createInviteCodeMutation.mutate(
      {
        teamId,
      },
      {
        onSuccess: ({ token }) => {
          void copyToClipboard(token);
        },
      }
    );
  };

  if (createInviteCodeMutation.isSuccess) {
    return (
      <Button
        size="lg"
        className="whitespace-nowrap px-5"
        onClick={() => createInviteCodeMutation.reset()}
      >
        <Check size="20" className="mr-2" />
        Copied to clipboard!
      </Button>
    );
  }

  return (
    <Button
      size="lg"
      className="whitespace-nowrap px-5"
      onClick={handleClick}
      isLoading={createInviteCodeMutation.isLoading}
    >
      <Link size="20" className="mr-2" />
      Create link
    </Button>
  );
}
