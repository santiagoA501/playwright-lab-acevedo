import { test as base, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';

type SauceFixtures = {
  loginPage: LoginPage;
  inventory: InventoryPage;
  cartPage: CartPage;
  checkoutPage: CheckoutPage;
};

export const test = base.extend<SauceFixtures>({
  loginPage: async ({ page }, use) => {
    const login = new LoginPage(page);
    await login.goto();
    await use(login);
  },

  inventory: async ({ loginPage, page }, use) => {
    const { SAUCE_USER, SAUCE_PASSWORD } = process.env;
    if (!SAUCE_USER || !SAUCE_PASSWORD) {
      throw new Error('Completa SAUCE_USER y SAUCE_PASSWORD en el archivo .env.');
    }

    await loginPage.login(SAUCE_USER, SAUCE_PASSWORD);
    await expect(page).toHaveURL(/\/inventory\.html$/);
    await use(new InventoryPage(page));
  },

  cartPage: async ({ page }, use) => {
    await use(new CartPage(page));
  },

  checkoutPage: async ({ page }, use) => {
    await use(new CheckoutPage(page));
  },
});

export { expect };
