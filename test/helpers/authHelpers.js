
export async function loginViaApi(request, email, password) {
  const response = await request.post('/login', {
    data: { email, password },
    headers: { 'Content-Type': 'application/json' }
  });

  if (!response.ok()) {
    const body = await response.text();
    throw new Error(`Login failed: ${response.status()} - ${body}`);
  }

  const body = await response.json();
  return {
    token: body.token,
    user: body.user
  };
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


export async function createAuthenticatedContext(browser, authData) {
  const context = await browser.newContext();

  await context.addInitScript(({ token, user }) => {
    localStorage.setItem('token', token);
    localStorage.setItem('currentUser', JSON.stringify(user));
  }, authData);

  const page = await context.newPage();
  await page.goto('http://127.0.0.1:3000/seller');

  return { context, page };
}



