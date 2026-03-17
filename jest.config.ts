import type { Config } from "jest";

const config: Config = {
  preset: "ts-jest",
  testEnvironment: "jest-environment-jsdom",
  roots: ["<rootDir>/src"],
  testMatch: ["**/*.test.{ts,tsx}"],
  moduleNameMapper: {
    "^@shared/(.*)$": "<rootDir>/src/shared/$1",
    "^@entities/(.*)$": "<rootDir>/src/entities/$1",
    "^@features/(.*)$": "<rootDir>/src/features/$1",
    "^@widgets/(.*)$": "<rootDir>/src/widgets/$1",
    "^@pages/(.*)$": "<rootDir>/src/views/$1",
    "^@app/(.*)$": "<rootDir>/src/app/$1",
    "^@/(.*)$": "<rootDir>/src/$1",
    "^next/image$": "<rootDir>/src/shared/__mocks__/next-image.tsx",
    "^next/dynamic$": "<rootDir>/src/shared/__mocks__/next-dynamic.tsx",
    "^next/navigation$": "<rootDir>/src/shared/__mocks__/next-navigation.tsx",
  },
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  transform: {
    "^.+\\.tsx?$": [
      "ts-jest",
      {
        tsconfig: "tsconfig.json",
      },
    ],
    "^.+\\.js$": [
      "ts-jest",
      {
        tsconfig: "tsconfig.json",
        useESM: false,
      },
    ],
  },
  transformIgnorePatterns: [
    "node_modules/(?!(@faker-js/faker|msw|@mswjs|until-async|@bundled-es-modules|@open-draft)/)",
  ],
  collectCoverageFrom: [
    "src/**/*.{ts,tsx}",
    "!src/**/*.d.ts",
    "!src/**/*.stories.{ts,tsx}",
    "!src/**/index.ts",
    "!src/shared/ui/*.tsx",
  ],
};

export default config;
