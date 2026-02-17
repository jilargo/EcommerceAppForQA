import { test } from '@playwright/test';
import { loginPage } from '../pageObjects/login';
import { initializeTestDb } from "../utils/testDbConfiguration";
import logintestData from '../test-data/dataSource/logintestData.json';
import {createUserViaApi} from "../helpers/apiHelpers";
import {deleteUserByEmail} from "../helpers/dbCleanup";


//get the data from the database
test.beforeAll(async () => {
  await initializeTestDb();
  for (const user of logintestData){
        await deleteUserByEmail(user.email);
    }
});


test.describe('Full User Flow Login', () => {
    for (const user of logintestData) {
        test(`User login: ${user.name}`, async ({ page,request }) => {
            
            //Precondition the API injects user for valid login
            if (user.expected === 'Sign up'){
                await createUserViaApi(request,user);
                console.log(user);

            }

            const login = new loginPage(page);
            await login.goto();
            
            await login.login(
                user.email,
                user.password
            );


            if (user.expected === 'success') {
                await login.expectValidLogin();
                await deleteUserByEmail(user.email);
                console.log("Deleted User: ",user.email);

            }
            else if (user.expected === 'email_error') {
                await login.expectEmptyEmail(/email/i);
            }
            else if (user.expected === 'email_error') {
                await login.expectInvalidEmailFormat(/email/i);
            }
            else if (user.expected === 'password_error') {
                await login.expectEmptyPassword(/password/i);
            }
            else if (user.expected === 'credentials_error') {
                await login.expectIncorrectPassword(/password/i);
            }
            else if (user.expected === 'credentials_error') {
                await login.expectSqlInjectionAttempt(/email/i);
            }

        });

    }
});