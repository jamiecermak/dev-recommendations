import { type DeepMockProxy, mockDeep } from "jest-mock-extended";
import { type ClerkUserAPI } from "./clerk";

export type MockedClerkUserAPI = DeepMockProxy<ClerkUserAPI>;
export const createMockedClerkUserAPI = (): MockedClerkUserAPI =>
  mockDeep<MockedClerkUserAPI>();
