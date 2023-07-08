import { type DeepMockProxy, mockDeep } from "jest-mock-extended";
import type { Resend } from "resend";

export type MockedResend = DeepMockProxy<Resend>;
export const createMockedResend = (): MockedResend => mockDeep<Resend>();
