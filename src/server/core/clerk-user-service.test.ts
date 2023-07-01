import { createMockedPrisma, type MockedPrismaClient } from "~/utils/mock-prisma"
import { ClerkUserService } from "./clerk-user-service";
import { type User } from "@prisma/client";

let userService: ClerkUserService;
let mockPrisma: MockedPrismaClient;

const dbUserFixture: User = {
    id: 'internal-user-id',
    clerkId: 'clerk-user-id',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
}

beforeEach(() => {
    jest.resetAllMocks()

    mockPrisma = createMockedPrisma()
    userService = new ClerkUserService(mockPrisma)
})

describe('creating a user from a clerk user id', () => {
    it('should not create a user if it already exists', async () => {
        mockPrisma.user.findFirst.mockResolvedValue(dbUserFixture)

        const user = await userService.getOrCreateFromClerkUserId('clerk-user-id')

        expect(user).toMatchObject(dbUserFixture)
        expect(mockPrisma.user.create).not.toHaveBeenCalled()
    })

    it('should create a user if it does not exist yet', async () => {
        mockPrisma.user.findFirst.mockResolvedValue(null)
        mockPrisma.user.create.mockResolvedValue(dbUserFixture)

        const newUser = await userService.getOrCreateFromClerkUserId('new-clerk-user-id')

        expect(newUser).toMatchObject(dbUserFixture)
        expect(mockPrisma.user.create).toHaveBeenCalledWith({
            data: {
                clerkId: 'new-clerk-user-id',
                isActive: true
            }
        })
    })
})