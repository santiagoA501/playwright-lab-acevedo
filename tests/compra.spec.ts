import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';

const mochila = 'Sauce Labs Backpack';

test.describe('Proceso de compra', () => {
  let inventory: InventoryPage;
  let cart: CartPage;
  let checkout: CheckoutPage;

  test.beforeEach(async ({ page }) => {
    const login = new LoginPage(page);
    inventory = new InventoryPage(page);
    cart = new CartPage(page);
    checkout = new CheckoutPage(page);

    await login.goto();
    await login.login('standard_user', 'secret_sauce');
  });

  test('CP-011 Compra completa de un producto', async () => {
    await inventory.addToCart(mochila);
    await inventory.goToCart();
    await expect(cart.item(mochila)).toBeVisible();

    await cart.checkout();
    await checkout.fillInformation('Ana', 'Perez', '110111');
    await checkout.finish();

    await expect(checkout.completeHeader).toBeVisible();
  });

  test('CP-012 Checkout sin nombre muestra error', async ({ page }) => {
    await inventory.addToCart(mochila);
    await inventory.goToCart();
    await cart.checkout();
    await checkout.fillInformation('', 'Perez', '110111');

    await expect(checkout.errorMessage).toContainText('First Name is required');
    await expect(page).toHaveURL(/\/checkout-step-one\.html$/);
  });
});
