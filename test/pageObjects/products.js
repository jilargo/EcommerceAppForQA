import { expect } from '@playwright/test';
import path from 'path';
import fs from 'fs';

export class productPage {
    constructor(page) {
        this.page = page;
        this.productNameInput = page.getByPlaceholder('Enter product name')
        this.productPriceInput = page.getByPlaceholder('Enter price')
        this.ProductMessage = page.locator('#productMessage');


    }
    async addProduct(product_name, product_price, product_image) {
        await this.productNameInput.fill(product_name);
        await this.productPriceInput.fill(product_price);
        if (product_image) {
            const imagePath = path.resolve(__dirname, '../test-data/images', product_image);

            if (!fs.existsSync(imagePath)) {
                throw new Error(`Test image not found: ${imagePath}`);
            }

            await this.page.setInputFiles('#ProductAvatar', imagePath);
        }
        await this.page.getByRole('button', { name: 'Save Product' }).click();


    }
    //edit product btn
    async editProduct() {
    await this.page.getByRole('button', { name: 'Edit' }).click();
}

    async ExpectProductMessage(text) {
        await expect(this.ProductMessage).toHaveText(text);
    }

}