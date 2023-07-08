/* eslint-disable @typescript-eslint/no-var-requires */
const nextJest = require("next/jest");
const { pathsToModuleNameMapper } = require("ts-jest");
const { compilerOptions } = require("./tsconfig.json");

const createJestConfig = nextJest.default({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: "./src",
});

module.exports = createJestConfig({
  setupFilesAfterEnv: ["<rootDir>/src/setup-tests.ts"],
  testEnvironment: "jest-environment-jsdom",
  moduleDirectories: ["node_modules", "<rootDir>"],
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
    prefix: "<rootDir>",
  }),
});
