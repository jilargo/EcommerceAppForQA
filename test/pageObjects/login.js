import {expect} from '@playwright/test';

export class loginPage {
    constructor(page){
        this.page = page;
        this.emailInput = page.getByPlaceholder('Email');
        this.passwordInput = page.getByPlaceholder('Password');
        this.btnSubmit = page.getByRole('button', { name: 'Login' })
        
        //email
        this.emptyEmail = page.locator('#errorMsg');
        this.InvalidEmailFormat = page.locator('#errorMsg');

        //For password
        this.emptyPassword = page.locator('#errorMsg');
        this.IncorrectPassword = page.locator('#errorMsg');


        //For security
        this.SqlInjectionAttempt = page.locator('#errorMsg');
    }

    async goto(){
        await this.page.goto('/login');
    }

    async login(email, password){
        await this.emailInput.fill(email);
        await this.passwordInput.fill(password);
        await this.btnSubmit.click();

    }

    async expectValidLogin(){
        await expect (this.page).toHaveURL(/index/);
    }

    async expectEmptyEmail(text){
        await expect (this.emptyEmail).toHaveText(text);
    }

    async expectInvalidEmailFormat(text){
        await expect (this.InvalidEmailFormat).toHaveText(text);
    }
    async expectEmptyPassword(text){
        await expect (this.emptyPassword).toHaveText(text);
    }
    async expectIncorrectPassword(text){
        await expect (this.IncorrectPassword).toHaveText(text);
    }
    async expectSqlInjectionAttempt(text){
        await expect (this.SqlInjectionAttempt).toHaveText(text);
    }
}