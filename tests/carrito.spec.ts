import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage } from '../pages/CartPage';

const mochila = 'Sauce Labs Backpack';
const luz = 'Sauce Labs Bike Light';

test.describe('Catalogo y carrito de SauceDemo', () => {
  let inventory: InventoryPage;

  test.beforeEach(async ({ page }) => {
    const login = new LoginPage(page);
    inventory = new InventoryPage(page);
    await login.goto();
    await login.login('standard_user', 'secret_sauce');
    await expect(page).toHaveURL(/\/inventory\.html$/);
  });

  test('CP-004 Agregar la mochila al carrito', async () => {
    await inventory.addToCart(mochila);
    await expect(inventory.cartBadge).toHaveText('1');
    await expect(inventory.removeButton(mochila)).toBeVisible();
  });

  test('CP-005 Agregar dos productos al carrito', async () => {
    await inventory.addToCart(mochila);
    await inventory.addToCart(luz);
    await expect(inventory.cartBadge).toHaveText('2');
  });

  test('CP-006 El catalogo muestra 6 productos', async () => {
    await expect(inventory.items).toHaveCount(6);
  });

  test('CP-007 Agregar y quitar un producto', async () => {
    await inventory.addToCart(mochila);
    await expect(inventory.cartBadge).toHaveText('1');

    await inventory.removeFromCart(mochila);
    await expect(inventory.cartBadge).toBeHidden();
    await expect(inventory.addButton(mochila)).toBeVisible();
  });

  test('CP-008 El producto aparece en el carrito', async ({ page }) => {
    await inventory.addToCart(mochila);
    await inventory.goToCart();

    await expect(page).toHaveURL(/\/cart\.html$/);
    await expect(new CartPage(page).item(mochila)).toBeVisible();
  });

  test('CP-009 Ordenar por precio de menor a mayor', async () => {
    await inventory.sortByPrice('lohi');
    await expect(inventory.productNames.first()).toHaveText('Sauce Labs Onesie');
  });

  test('CP-010 Ordenar por precio de mayor a menor', async () => {
    await inventory.sortByPrice('hilo');
    await expect(inventory.productNames.first()).toHaveText('Sauce Labs Fleece Jacket');
  });
});
