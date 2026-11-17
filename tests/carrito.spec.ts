import { test, expect } from '../fixtures/fixtures';

const mochila = 'Sauce Labs Backpack';
const luz = 'Sauce Labs Bike Light';

test.describe('Catalogo y carrito de SauceDemo', () => {
  test('CP-004 Agregar la mochila al carrito', async ({ inventory }) => {
    await inventory.addToCart(mochila);
    await expect(inventory.cartBadge).toHaveText('1');
    await expect(inventory.removeButton(mochila)).toBeVisible();
  });

  test('CP-005 Agregar dos productos al carrito', async ({ inventory }) => {
    await inventory.addToCart(mochila);
    await inventory.addToCart(luz);
    await expect(inventory.cartBadge).toHaveText('2');
  });

  test('CP-006 El catalogo muestra 6 productos', async ({ inventory }) => {
    await expect(inventory.items).toHaveCount(6);
  });

  test('CP-007 Agregar y quitar un producto', async ({ inventory }) => {
    await inventory.addToCart(mochila);
    await expect(inventory.cartBadge).toHaveText('1');

    await inventory.removeFromCart(mochila);
    await expect(inventory.cartBadge).toBeHidden();
    await expect(inventory.addButton(mochila)).toBeVisible();
  });

  test('CP-008 El producto aparece en el carrito', async ({ inventory, cartPage, page }) => {
    await inventory.addToCart(mochila);
    await inventory.goToCart();

    await expect(page).toHaveURL(/\/cart\.html$/);
    await expect(cartPage.item(mochila)).toBeVisible();
  });

  test('CP-009 Ordenar por precio de menor a mayor', async ({ inventory }) => {
    await inventory.sortByPrice('lohi');
    await expect(inventory.productNames.first()).toHaveText('Sauce Labs Onesie');
  });

  test('CP-010 Ordenar por precio de mayor a menor', async ({ inventory }) => {
    await inventory.sortByPrice('hilo');
    await expect(inventory.productNames.first()).toHaveText('Sauce Labs Fleece Jacket');
  });
});
