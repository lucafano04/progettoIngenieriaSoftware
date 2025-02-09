/** @type {import('ts-jest').JestConfigWithTsJest} **/
export default {
  testEnvironment: "node",
  transform: {
    "^.+.tsx?$": ["ts-jest",{}],
  },
  preset: "ts-jest",
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/app/$1",
  },
  testTimeout: 10000
};