
import fs from 'fs';
import path from 'path'
import { expect } from '@playwright/test';

export class SignupPage {
    constructor(page) {
        this.page = page;
        this.firstNameInput = page.getByPlaceholder(/first name/i);
        this.lastnameInput = page.getByPlaceholder(/last name/i);
        this.emailInput = page.getByPlaceholder(/email/i);
        this.passwordInput = page.getByPlaceholder(/password/i);
        this.ProductMessage = page.locator('#popup');




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
        await expect(this.ProductMessage).toHaveText(text);
        await expect(this.page).toHaveURL(/index/);
    }
    async ExpectValidationMessage(text) {
        await expect(this.ProductMessage).toHaveText(text)
    }



}