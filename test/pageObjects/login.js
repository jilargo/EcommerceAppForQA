import {expect} from '@playwright/test';

export class loginPage {
    constructor(page){
        this.page = page;
        this.emailInput = page.getByPlaceholder('Email');
        this.passwordInput = page.getByPlaceholder('Password');
        this.btnSubmit = page.getByRole('button', { name: 'Login' })
        
        //Validation message
         this.ProductMessage = page.locator('#errorMsg');
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

    async expectValidationMessage(text){
        await expect (this.ProductMessage).toHaveText(text);
    }

    
}