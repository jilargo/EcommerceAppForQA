import { defineConfig } from "@playwright/test";
import {dbPath} from '../test/utils/testDbConfiguration'

export default defineConfig({
  testDir: "../test",
  timeout: 120_000,
  workers: 1,
  

  use: {
    baseURL: 'http://localhost:3000',
    headed: false,
    screenshot: 'only-on-failure',
    trace: 'on-first-retry',
    video: 'retain-on-failure',
    //launchOptions: { slowMo: 500 },
  },

  webServer: {
    // Pass TEST_DB_PATH to server
    command: `npx cross-env TEST_DB_PATH="${dbPath}" node ../server/server.js`,
    port: 3000,
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
  },
  use: {
  actionTimeout: 45000,    // give individual .fill() / .click() more time
  navigationTimeout: 90000,
},

  reporter: [['html', { open: 'never' }], ['list']],
});
