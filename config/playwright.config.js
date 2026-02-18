import { defineConfig } from "@playwright/test";
import {dbPath} from '../test/utils/testDbConfiguration'

export default defineConfig({
  testDir: "../test",
  timeout: 60000,
  workers: 1,
  

  use: {
    baseURL: 'http://localhost:3000',
    headed: true,
    screenshot: 'only-on-failure',
    trace: 'on-first-retry',
    video: 'retain-on-failure',
    //launchOptions: { slowMo: 500 },
  },

  webServer: {
    // Pass TEST_DB_PATH to server
    command: `npx cross-env TEST_DB_PATH="${dbPath}" node ../server/server.js`,
    port: 3000,
    reuseExistingServer: false,
    timeout: 120000,
  },

  reporter: [['html', { open: 'never' }], ['list']],
});
