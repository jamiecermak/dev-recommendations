import type { Team, User } from "@prisma/client"

export const userFixture: User = {
    id: 'internal-user-id',
    clerkId: 'clerk-user-id',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
}

export const teamFixture: Team = {
    id: 'team-id',
    name: 'My Awsesome Team',
    ownedByUserId: 'owned-by-user-id',
    createdByUserId: 'created-by-user-id',
    createdAt: new Date(),
    updatedAt: new Date()
}