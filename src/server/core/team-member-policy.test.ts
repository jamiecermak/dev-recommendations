import { teamFixture, teamMemberFixture } from "~/utils/test-fixtures";
import { TeamMemberPolicy } from "./team-member-policy";

it("should determine if a user is in the team member list", () => {
  const teamMemberPolicy = new TeamMemberPolicy(teamFixture, [
    {
      ...teamMemberFixture,
      userId: "user-id-1",
      user: {
        ...teamMemberFixture.user,
        id: "user-id-1",
      },
      isActive: true,
      isAdmin: true,
    },
    {
      ...teamMemberFixture,
      userId: "user-id-2",
      user: {
        ...teamMemberFixture.user,
        id: "user-id-2",
      },
      isActive: false,
      isAdmin: false,
    },
  ]);

  expect(teamMemberPolicy.hasUser("user-id-1")).toBeTruthy();
  expect(teamMemberPolicy.hasUser("user-id-2")).toBeTruthy();
  expect(teamMemberPolicy.hasUser("user-id-3")).toBeFalsy();
});

it("should determine if a user is active", () => {
  const teamMemberPolicy = new TeamMemberPolicy(teamFixture, [
    {
      ...teamMemberFixture,
      userId: "active-user-id",
      user: {
        ...teamMemberFixture.user,
        id: "active-user-id",
      },
      isActive: true,
    },
  ]);

  expect(teamMemberPolicy.isActive("active-user-id")).toBeTruthy();
  expect(teamMemberPolicy.isActive("not-active-user-id")).toBeFalsy();

  expect(() =>
    teamMemberPolicy.isTeamMemberOrThrow({
      ...teamMemberFixture.user,
      id: "active-user-id",
    })
  ).not.toThrow();

  expect(() =>
    teamMemberPolicy.isTeamMemberOrThrow({
      ...teamMemberFixture.user,
      id: "not-active-user-id",
    })
  ).toThrow();
});

it("should determine if a user is an admin", () => {
  const teamMemberPolicy = new TeamMemberPolicy(teamFixture, [
    {
      ...teamMemberFixture,
      userId: "user-id-1",
      user: {
        ...teamMemberFixture.user,
        id: "user-id-1",
      },
      isActive: true,
      isAdmin: true,
    },
    {
      ...teamMemberFixture,
      userId: "user-id-2",
      user: {
        ...teamMemberFixture.user,
        id: "user-id-2",
      },
      isActive: true,
      isAdmin: false,
    },
  ]);

  expect(teamMemberPolicy.isAdmin("user-id-1")).toBeTruthy();
  expect(teamMemberPolicy.isAdmin("user-id-2")).toBeFalsy();

  expect(() =>
    teamMemberPolicy.isTeamMemberOrThrow(
      {
        ...teamMemberFixture.user,
        id: "user-id-1",
      },
      {
        isAdmin: true,
      }
    )
  ).not.toThrow();

  expect(() =>
    teamMemberPolicy.isTeamMemberOrThrow(
      {
        ...teamMemberFixture.user,
        id: "user-id-2",
      },
      {
        isAdmin: true,
      }
    )
  ).toThrow();
});

it("should determine if a user is the team owner", () => {
  const teamMemberPolicy = new TeamMemberPolicy(
    {
      ...teamFixture,
      ownedByUserId: "user-id-1",
    },
    [
      {
        ...teamMemberFixture,
        userId: "user-id-1",
        user: {
          ...teamMemberFixture.user,
          id: "user-id-1",
        },
        isActive: true,
        isAdmin: true,
      },
      {
        ...teamMemberFixture,
        userId: "user-id-2",
        user: {
          ...teamMemberFixture.user,
          id: "user-id-2",
        },
        isActive: true,
        isAdmin: true,
      },
    ]
  );

  expect(teamMemberPolicy.isOwner("user-id-1")).toBeTruthy();
  expect(teamMemberPolicy.isOwner("user-id-2")).toBeFalsy();

  expect(() =>
    teamMemberPolicy.isTeamMemberOrThrow(
      {
        ...teamMemberFixture.user,
        id: "user-id-1",
      },
      {
        isOwner: true,
      }
    )
  ).not.toThrow();

  expect(() =>
    teamMemberPolicy.isTeamMemberOrThrow(
      {
        ...teamMemberFixture.user,
        id: "user-id-2",
      },
      {
        isOwner: true,
      }
    )
  ).toThrow();
});
