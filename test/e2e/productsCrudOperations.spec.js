
import { test } from '@playwright/test';
import users from '../test-data/dataSource/loginViaApiTestData.json';
import { initializeTestDb } from "../utils/testDbConfiguration";
import { createUserViaApi } from "../helpers/apiHelpers";
import { deleteUserByEmail, deleteProductByName } from "../helpers/dbCleanup";
import { loginViaApi, saveTokenToFile, createAuthenticatedContext } from '../helpers/authHelpers';
import productsList from '../test-data/dataSource/productsList.json';
import { productPage } from '../pageObjects/products';

test.beforeAll(async ({ playwright }) => {
  await initializeTestDb();
  await deleteUserByEmail(users.email);
  for (const products of productsList) {
    await deleteProductByName(products.product_name);
    console.log("Deleted Products: ", products.product_name);
  }


  // Inject user before tests
  const apiContext = await playwright.request.newContext({
    baseURL: 'http://127.0.0.1:3000'
  });
  await createUserViaApi(apiContext, users);
  await apiContext.dispose();
});

for (const products of productsList) {
  test(`Seller Dashboard: ${products.name}`, async ({ playwright, browser }) => {

    const apiContext = await playwright.request.newContext({
      baseURL: 'http://127.0.0.1:3000'
    });


    const authData = await loginViaApi(apiContext, users.email, users.password);
    const { context, page } = await createAuthenticatedContext(browser, authData);


    // 4️⃣ Initialize product page
    const productsPage = new productPage(page);

    // 5️⃣ Delete existing product (optional)
    await deleteProductByName(products.name);

    // 6️⃣ Add product
    //await productsPage.goto(); // now fixed: URL is defined inside productPage
    await productsPage.addProduct(products.product_name, products.product_price, products.product_image);

    // 7️⃣ Assert expected outcome
    if (products.expected === 'success') {
      await productsPage.ExpectValidProductAddition(/Product successfully added/i);
    } else if (products.expected === 'empty_product_name') {
      await productsPage.ExpectProductName(/Product name is required/i);
    } else if (products.expected === 'empty_product_price') {
      await productsPage.ExpectProductPrice(/Please enter a valid price greater than 0/i);
    } else if (products.expected === 'empty_product_image') {
      await productsPage.ExpectProductImage(/Please upload a product image/i);
    }

    // 8️⃣ Close context
    await context.close();
    await apiContext.dispose();
  });
}
