import type {
  User as PrismaUser,
  TeamMember as PrismaTeamMember,
} from "@prisma/client";

export interface TeamMember extends PrismaTeamMember {
  user: PrismaUser;
}
