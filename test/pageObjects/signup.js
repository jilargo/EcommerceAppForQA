
import fs from 'fs';
import path from 'path'
import { expect } from '@playwright/test';

export class SignupPage {
    constructor(page) {
        this.page = page;
        this.firstNameInput = page.getByPlaceholder('First Name')
        this.lastnameInput = page.getByPlaceholder('Last Name')
        this.emailInput = page.getByPlaceholder('Email')
        this.passwordInput = page.getByPlaceholder('Password')
        this.ValidSignup = page.locator('#popup');
        this.EmptyFirstName = page.locator('#popup');
        this.InvalidFirstName = page.locator('#popup');
        this.EmptyLastName = page.locator('#popup');
        this.InvalidLastName = page.locator('#popup');
        this.EmptyEmail = page.locator('#popup');
        this.InvalidEmail = page.locator('#popup');
        this.EmptyPassword = page.locator('#popup');
        this.InvalidPassword = page.locator('#popup');
        this.EmailExist = page.locator('#popup');



    }
    async goto() {
        await this.page.goto('/signup');
    }


    async signUp(first_name, last_name, email, password, image) {
        await this.firstNameInput.fill(first_name);
        await this.lastnameInput.fill(last_name);
        await this.emailInput.fill(email);
        await this.passwordInput.fill(password);
        if (image) {
            const imagePath = path.resolve(__dirname, '../test-data/images', image);

            if (!fs.existsSync(imagePath)) {
                throw new Error(`Test image not found: ${imagePath}`);
            }

            await this.page.setInputFiles('#avatar', imagePath);
        }
        await this.page.getByRole('button', { name: 'Sign Up' }).click();

    }
    async ExpectValidSignup(text) {
        await expect(this.ValidSignup).toHaveText(text);
        await expect(this.page).toHaveURL(/index/);
    }
    async ExpectEmptyFirstName(text){
        await expect(this.EmptyFirstName).toHaveText(text)
    }
    async ExpectInvalidFirstName(text){
        await expect(this.InvalidFirstName).toHaveText(text)
    }
    async ExpectEmptyLastName(text){
        await expect(this.EmptyLastName).toHaveText(text)
    }
    async ExpectInvalidLastName(text){
        await expect(this.InvalidLastName).toHaveText(text)
    }
    async ExpectEmptyEmail(text){
        await expect(this.EmptyEmail).toHaveText(text)
    }
    async ExpectInvalidEmail(text){
        await expect(this.InvalidEmail).toHaveText(text)
    }
    async ExpectEmptyPassword(text){
        await expect(this.EmptyPassword).toHaveText(text)
    }
    async ExpectInvalidPassword(text){
        await expect(this.InvalidPassword).toHaveText(text)
    }
    async ExpectEmailExist(text){
        await expect(this.EmailExist).toHaveText(text)
    }

    
}