import nextJest from 'next/jest';
import type { Config } from 'jest';

const createJestConfig = nextJest({ dir: './' });

const config: Config = {
  testEnvironment: 'jest-environment-jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  clearMocks: true,            // optional, but helpful
  restoreMocks: true, 
  moduleNameMapper: {
    // Handle module aliases if you use them, e.g. "@/components/*"
    '^@/(.*)$': '<rootDir>/$1',
    // Mock CSS modules / files
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    // Mock static file imports (images, svgs, etc.)
    '\\.(gif|ttf|eot|svg|png|jpe?g|webp)$': '<rootDir>/test/__mocks__/fileMock.js',
  },
  // If some ESM deps need transforming, add them here (example):
  // transformIgnorePatterns: ['/node_modules/(?!some-esm-package)'],
};

export default createJestConfig(config);
