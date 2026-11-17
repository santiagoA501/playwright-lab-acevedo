import { test, expect } from '../fixtures/fixtures';

const mochila = 'Sauce Labs Backpack';

test.describe('Proceso de compra', () => {
  test('CP-011 Compra completa de un producto', async ({ inventory, cartPage: cart, checkoutPage: checkout }) => {
    await inventory.addToCart(mochila);
    await inventory.goToCart();
    await expect(cart.item(mochila)).toBeVisible();

    await cart.checkout();
    await checkout.fillInformation('Ana', 'Perez', '110111');
    await checkout.finish();

    await expect(checkout.completeHeader).toBeVisible();
  });

  test('CP-012 Checkout sin nombre muestra error', async ({ inventory, cartPage: cart, checkoutPage: checkout, page }) => {
    await inventory.addToCart(mochila);
    await inventory.goToCart();
    await cart.checkout();
    await checkout.fillInformation('', 'Perez', '110111');

    await expect(checkout.errorMessage).toContainText('First Name is required');
    await expect(page).toHaveURL(/\/checkout-step-one\.html$/);
  });
});
