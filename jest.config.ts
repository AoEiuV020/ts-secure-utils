/**
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

import type { Config } from "jest";

const config: Config = {
  preset: "ts-jest",
  testEnvironment: "node",
  coverageDirectory: "./coverage/",
  collectCoverage: true,
  collectCoverageFrom: [
    "src/**/*.{ts,js}",
    "!**/node_modules/**",
    "!**/vendor/**",
  ],
  testPathIgnorePatterns: [
    "/node_modules/",
    "/.test",
    "/build",
  ],
};

export default config;
