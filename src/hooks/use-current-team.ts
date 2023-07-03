import { useCurrentTeamId } from "./use-current-team-id";
import { api } from "~/utils/api";

interface UseCurrentTeamOptions {
  suspense?: boolean;
}

export function useCurrentTeam({
  suspense = false,
}: UseCurrentTeamOptions = {}) {
  const teamId = useCurrentTeamId();
  const { isLoading, data, isError } =
    api.teamMembers.getTeamMembership.useQuery(
      {
        teamId,
      },
      {
        suspense,
      }
    );

  if (isLoading) {
    return {
      teamId,
      isLoading: true,
      isActive: null,
      team: null,
      membership: null,
      isAdmin: null,
      isOwner: null,
    };
  }

  if (isError || data === undefined) {
    return {
      teamId,
      isLoading: false,
      isActive: false,
      team: null,
      membership: null,
      isAdmin: null,
      isOwner: null,
    };
  }

  return {
    teamId,
    isLoading,
    isActive: true,
    team: data.team,
    membership: data.membership,
    isAdmin: data.membership.isAdmin,
    isOwner: data.membership.isOwner,
  };
}
