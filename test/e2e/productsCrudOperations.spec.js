
import { test } from '@playwright/test';
import { initializeTestDb } from "../utils/testDbConfiguration";
import { createUserViaApi } from "../helpers/apiHelpers";
import { deleteUserByEmail, deleteProductByName } from "../helpers/dbCleanup";
import { loginViaApi, createAuthenticatedContext } from '../helpers/authHelpers';
import { productPage } from '../pageObjects/products';
import productsList from '../test-data/dataSource/productsList.json';
import users from '../test-data/dataSource/loginViaApiTestData.json';

test.beforeAll(async ({ playwright }) => {
  //Initialize database before test
  await initializeTestDb();
  //Clean up user before test begin
  await deleteUserByEmail(users.email);

  // Clean up products before tests
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
    await deleteProductByName(products.product_name);

    // 6️⃣ Add product
    //await productsPage.goto(); // now fixed: URL is defined inside productPage
    await productsPage.addProduct(products.product_name, products.product_price, products.product_image);
    // 7️⃣ Assert expected outcome
    if (products.expected === 'success') {
      await productsPage.ExpectProductMessage(/Product successfully added/i);
      // ONLY edit when product exists
      await productsPage.editProduct();

      await productsPage.ExpectProductMessage(
        /Editing product. Update and click Save/i
      );
    } else if (products.expected === 'empty_product_name') {
      await productsPage.ExpectProductMessage(/Product name is required/i);
    } else if (products.expected === 'empty_product_price') {
      await productsPage.ExpectProductMessage(/Please enter a valid price greater than 0/i);
    } else if (products.expected === 'empty_product_image') {
      await productsPage.ExpectProductMessage(/Please upload a product image/i);
    }


    // 8️⃣ Close context
    await context.close();
    await apiContext.dispose();
  });
}
