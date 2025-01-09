export default {
  testEnvironment: "jest-environment-jsdom", // Simulates a browser for React tests
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  transform: {
    "^.+\\.[tj]sx?$": [
      "babel-jest",
      { presets: ["@babel/preset-env", "@babel/preset-react"] },
    ],
  },
  extensionsToTreatAsEsm: [".ts", ".tsx", ".jsx"],
};
