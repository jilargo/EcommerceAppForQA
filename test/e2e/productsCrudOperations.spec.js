import { test } from '@playwright/test';
import user from '../test-data/dataSource/loginViaApiTestData.json';
import { initializeTestDb } from "../utils/testDbConfiguration";
import { createUserViaApi } from "../helpers/apiHelpers";

import {deleteUserByEmail} from "../helpers/dbCleanup";
import { loginViaApi, createAuthContext, saveTokenToFile} from '../helpers/authHelpers';


test.beforeAll(async ({ playwright }) => {
  await initializeTestDb();
  await deleteUserByEmail(user.email);

  // Inject user before tests
  const apiContext = await playwright.request.newContext({
    baseURL: 'http://127.0.0.1:3000'
  });
  await createUserViaApi(apiContext, user);
  await apiContext.dispose();
});

test('Seller Dashboard access with JWT', async ({ playwright }) => {
  const apiContext = await playwright.request.newContext({
    baseURL: 'http://127.0.0.1:3000'
  });

  // 1️⃣ Login via API
  const token = await loginViaApi(apiContext, user.email, user.password);

  // 2️⃣ Save token JSON
  await saveTokenToFile(token, user.email);

  // 3️⃣ Create browser context with JWT injected
  const { context, page } = await createAuthContext(token);

  // 4️⃣ Navigate to dashboard
  await page.goto('/seller', { waitUntil: 'networkidle' });

  // 5️⃣ Wait for main dashboard element to ensure page loaded correctly
  //await page.waitForSelector('#seller-dashboard-main');

  // 6️⃣ Close context
  await context.close();
  await apiContext.dispose();
});

