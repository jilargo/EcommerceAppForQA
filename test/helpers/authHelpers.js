
import { chromium } from '@playwright/test';
import fs from 'fs';
import path from 'path';

/**
 * Logs in via API and returns JWT token
 */
export async function loginViaApi(request, email, password) {
  const response = await request.post('/login', {
    data: { email, password },
    headers: { 'Content-Type': 'application/json' } // ensure JSON
  });

  if (!response.ok()) {
    const body = await response.text();
    throw new Error(`Login failed: ${response.status()} - ${body}`);
  }

  const body = await response.json();
  return body.token; // assumes your backend returns { token: "..." }
}

/**
 * Saves token to a JSON file
 */
export async function saveTokenToFile(token, email) {
  const authFile = path.resolve(`playwright/.auth/${email}.json`);
  fs.mkdirSync(path.dirname(authFile), { recursive: true });
  await fs.promises.writeFile(authFile, JSON.stringify({ token }, null, 2));
  return authFile;
}

/**
 * Creates a browser context with JWT injected into localStorage
 */
export async function createAuthContext(token) {
  const context = await chromium.launchPersistentContext('', {
    storageState: undefined // start fresh
  });

  await context.addInitScript(token => {
    window.localStorage.setItem('jwt_token', token); // key must match frontend
  }, token);

  const page = await context.newPage();
  return { context, page };
}


