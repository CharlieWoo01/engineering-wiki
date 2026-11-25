import { defineConfig, devices } from '@playwright/test';
import { resolveDeployment } from './src/lib/deployment.ts';

const isCI = Boolean(process.env['CI']);
const PORT = 4321;
const { base } = resolveDeployment(process.env);
const baseURL = `http://localhost:${PORT}${base === '/' ? '/' : `${base}/`}`;

/**
 * E2E tests run against the *production build* served by `astro preview`, so
 * they exercise the real base path, Pagefind search index and static output.
 *
 * - Locally the build runs first, so `pnpm test:e2e` is self-contained.
 * - In CI the `dist/` artifact from the build job is reused.
 */
export default defineConfig({
  testDir: 'tests/e2e',
  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? 1 : 0,
  ...(isCI ? { workers: 2 } : {}),
  reporter: isCI ? [['github'], ['html', { open: 'never' }]] : [['list']],
  use: {
    baseURL,
    trace: 'on-first-retry',
  },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile', use: { ...devices['Pixel 7'] } },
  ],
  webServer: {
    command: isCI ? `astro preview --port ${PORT}` : `astro build && astro preview --port ${PORT}`,
    url: baseURL,
    reuseExistingServer: !isCI,
    timeout: 180_000,
  },
});
