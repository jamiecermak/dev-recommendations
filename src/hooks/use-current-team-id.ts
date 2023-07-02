import { useRouter } from "next/router";

export function useCurrentTeamId() {
  const router = useRouter();

  if (!router.query.team_id)
    throw new Error("team_id route parameter is not available");

  if (Array.isArray(router.query.team_id))
    throw new Error("Expected team_id to be a string, got array instead");

  return router.query.team_id;
}
