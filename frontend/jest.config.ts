export default {
  testEnvironment: "jsdom",
  moduleFileExtensions: ["js", "jsx", "ts", "tsx"],
  transform: {
    ".(ts|tsx)": "ts-jest"
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  collectCoverage: true, // Enable coverage collection
  collectCoverageFrom: [
    "src/**/*.{ts,tsx}", // Include files for coverage
    "!src/**/*.d.ts", // Exclude type declaration files
    "!src/**/index.{ts,tsx}", // Exclude index files
  ],
  coverageDirectory: "coverage", // Output directory for coverage reports
  coverageReporters: ["text", "lcov"], // Format of coverage reports
  coveragePathIgnorePatterns: [
    "/node_modules/",
    "/coverage",
    "package.json",
    "package-lock.json",
    "reportWebVitals.ts",
    "setupTests.ts",
    "index.tsx"
  ],

};



