import '@testing-library/jest-dom';

// make fetchMock available globally in tests
import fetchMock, { enableFetchMocks } from 'jest-fetch-mock';
enableFetchMocks();

// (optional) if you prefer explicit global assignment
// @ts-expect-error - let jest-fetch-mock define fetch
global.fetch = fetchMock;
