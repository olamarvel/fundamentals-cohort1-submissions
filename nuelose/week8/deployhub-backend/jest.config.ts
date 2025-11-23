module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ["**/tests/**/*.test.ts"],
  verbose: true,
  setupFilesAfterEnv: ["./tests/setup.ts"],
};
