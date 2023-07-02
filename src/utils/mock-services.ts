import { type DeepMockProxy, mockDeep } from "jest-mock-extended";

export type MockedService<T> = DeepMockProxy<T>;
export function createMockedService<T>(): MockedService<T> {
  return mockDeep<MockedService<T>>();
}
