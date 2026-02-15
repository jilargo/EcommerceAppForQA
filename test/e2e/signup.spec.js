import { test } from '@playwright/test';
import { SignupPage } from '../pageObjects/signup';
import {initializeTestDb } from "../utils/testDbConfiguration";
import {deleteUserByEmail} from "../helpers/dbCleanup";
import {createUserViaApi} from "../helpers/apiHelpers";
import users from '../test-data/dataSource/usersSignUpTestData.json';




test.beforeAll(async () => {
    await initializeTestDb();
    for (const user of users){
        await deleteUserByEmail(user.email);
    }
});

test.describe.serial('Full User Flow Signup', () => {
    
    for (const user of users) {
        test(`User Signup: ${user.name}`, async ({ page,request }) => {



            const signUp = new SignupPage(page);
            await signUp.goto();

            //precondition for duplicate email
            if(user.expected === 'existing_email_error'){
                await createUserViaApi(request,user)
  
            }

            await signUp.signUp
                (
                    user.first_name,
                    user.last_name,
                    user.email,
                    user.password,
                    user.image);

            if (user.expected === 'success') {
                await signUp.ExpectValidSignup(/Signup successful/i);
                await deleteUserByEmail(user.email);
            }

            else if (user.expected === 'first_name_error') {
                await signUp.ExpectEmptyFirstName(/first name/i);
            } else if (user.expected === 'first_name_error') {

                await signUp.ExpectInvalidFirstName(/first name/i);

            } else if (user.expected === 'last_name_error') {

                await signUp.ExpectEmptyLastName(/last name/i);

            } else if (user.expected === 'last_name_error') {

                await signUp.ExpectInvalidLastName(/last name/i);


            }
            else if (user.expected === 'email_error') {

                await signUp.ExpectEmptyEmail(/email/i);

            }
            else if (user.expected === 'email_error') {

                await signUp.ExpectInvalidEmail(/email/i);

            }


            else if (user.expected === 'password_error') {

                await signUp.ExpectEmptyPassword(/password/i);
            } else if (user.expected === 'password_error') {

                await signUp.ExpectInvalidPassword(/password/i);

            }
            else if (user.expected === 'existing_email_error') {

                await signUp.ExpectEmailExist(/Email already exist/i);
                await deleteUserByEmail(user.email);
            }

        });

    }

});




