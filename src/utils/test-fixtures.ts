import type { User as ClerkUser } from "@clerk/nextjs/server";
import type { Team, User as PrismaUser } from "@prisma/client";
import type { TeamMember } from "~/server/core/types";

export const userFixture: PrismaUser = {
  id: "internal-user-id",
  clerkId: "clerk-user-id",
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const teamFixture: Team = {
  id: "team-id",
  name: "My Awsesome Team",
  ownedByUserId: "owned-by-user-id",
  createdByUserId: "created-by-user-id",
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const clerkUserFixture: ClerkUser = {
  id: "clerk-user-id",
  passwordEnabled: false,
  totpEnabled: false,
  backupCodeEnabled: false,
  twoFactorEnabled: false,
  banned: false,
  createdAt: 0,
  updatedAt: 0,
  profileImageUrl: "",
  imageUrl: "",
  gender: "",
  birthday: "",
  primaryEmailAddressId: null,
  primaryPhoneNumberId: null,
  primaryWeb3WalletId: null,
  lastSignInAt: null,
  externalId: null,
  username: "john.smith",
  firstName: "John",
  lastName: "Smith",
  emailAddresses: [],
  phoneNumbers: [],
  web3Wallets: [],
  externalAccounts: [],
} as unknown as ClerkUser;

export const teamMemberFixture: TeamMember = {
  userId: userFixture.id,
  teamId: teamFixture.id,
  isActive: true,
  isAdmin: false,
  updatedAt: new Date(),
  createdAt: new Date(),
  joinedAt: new Date(),
  user: userFixture,
};
