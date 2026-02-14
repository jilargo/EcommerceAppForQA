import { test } from '@playwright/test';
import { loginPage } from '../pageObjects/login';
import { initializeTestDb } from "../utils/testDbConfiguration";
import logintestData from '../test-data/dataSource/logintestData.json';



//get the data from the database
test.beforeAll(async () => {
  await initializeTestDb();
});


test.describe('Full User Flow Login', () => {
    for (const logindata of logintestData) {
        test(`User login: ${logindata.name}`, async ({ page }) => {

            const login = new loginPage(page);
            await login.goto();
            
            await login.login(
                logindata.email,
                logindata.password
            );


            if (logindata.expected === 'success') {
                await login.expectValidLogin();
            }
            else if (logindata.expected === 'email_error') {
                await login.expectEmptyEmail(/email/i);
            }
            else if (logindata.expected === 'email_error') {
                await login.expectInvalidEmailFormat(/email/i);
            }
            else if (logindata.expected === 'password_error') {
                await login.expectEmptyPassword(/password/i);
            }
            else if (logindata.expected === 'credentials_error') {
                await login.expectIncorrectPassword(/password/i);
            }
            else if (logindata.expected === 'credentials_error') {
                await login.expectSqlInjectionAttempt(/email/i);
            }

        });

    }
});