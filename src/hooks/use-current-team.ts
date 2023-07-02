import { useCurrentTeamId } from "./use-current-team-id";
import { api } from "~/utils/api";

export function useCurrentTeam() {
  const teamId = useCurrentTeamId();
  const { isLoading, data, isError } = api.teams.getTeamMembership.useQuery({
    teamId,
  });

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
