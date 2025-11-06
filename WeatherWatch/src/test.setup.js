// Register jest-dom matchers for Vitest
import '@testing-library/jest-dom/vitest';
// Ensure DOM is cleaned between tests to avoid duplicate elements
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';
afterEach(() => {
  cleanup();
});
