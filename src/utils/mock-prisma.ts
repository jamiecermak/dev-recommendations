import { type PrismaClient } from '@prisma/client'
import { type DeepMockProxy, mockDeep } from 'jest-mock-extended'

export type MockedPrismaClient = DeepMockProxy<PrismaClient>
export const createMockedPrisma = (): MockedPrismaClient => mockDeep<PrismaClient>()