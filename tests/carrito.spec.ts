import { test, expect, type Page } from '@playwright/test';

const mochila = 'Sauce Labs Backpack';
const luz = 'Sauce Labs Bike Light';

function tarjetaProducto(page: Page, nombre: string) {
  return page.locator('.inventory_item').filter({
    has: page.getByText(nombre, { exact: true }),
  });
}

test.describe('Catalogo y carrito de SauceDemo', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.getByPlaceholder('Username').fill('standard_user');
    await page.getByPlaceholder('Password').fill('secret_sauce');
    await page.getByRole('button', { name: 'Login', exact: true }).click();
    await expect(page).toHaveURL(/\/inventory\.html$/);
  });

  test('CP-004 Agregar la mochila al carrito', async ({ page }) => {
    const tarjeta = tarjetaProducto(page, mochila);
    await tarjeta.getByRole('button', { name: 'Add to cart' }).click();

    await expect(page.locator('.shopping_cart_badge')).toHaveText('1');
    await expect(tarjeta.getByRole('button', { name: 'Remove' })).toBeVisible();
  });

  test('CP-005 Agregar dos productos al carrito', async ({ page }) => {
    await tarjetaProducto(page, mochila).getByRole('button', { name: 'Add to cart' }).click();
    await tarjetaProducto(page, luz).getByRole('button', { name: 'Add to cart' }).click();

    await expect(page.locator('.shopping_cart_badge')).toHaveText('2');
  });

  test('CP-006 El catalogo muestra 6 productos', async ({ page }) => {
    await expect(page.locator('.inventory_item')).toHaveCount(6);
  });

  test('CP-007 Agregar y quitar un producto', async ({ page }) => {
    const tarjeta = tarjetaProducto(page, mochila);
    await tarjeta.getByRole('button', { name: 'Add to cart' }).click();
    await expect(page.locator('.shopping_cart_badge')).toHaveText('1');

    await tarjeta.getByRole('button', { name: 'Remove' }).click();
    await expect(page.locator('.shopping_cart_badge')).toBeHidden();
    await expect(tarjeta.getByRole('button', { name: 'Add to cart' })).toBeVisible();
  });

  test('CP-008 El producto aparece en la pagina del carrito', async ({ page }) => {
    await tarjetaProducto(page, mochila).getByRole('button', { name: 'Add to cart' }).click();
    await page.locator('.shopping_cart_link').click();

    await expect(page).toHaveURL(/\/cart\.html$/);
    await expect(page.locator('.cart_item').getByText(mochila, { exact: true })).toBeVisible();
  });

  test('CP-009 Ordenar por precio de menor a mayor', async ({ page }) => {
    await page.locator('.product_sort_container').selectOption('lohi');
    await expect(page.locator('.inventory_item_name').first()).toHaveText('Sauce Labs Onesie');
  });

  test('CP-010 Ordenar por precio de mayor a menor', async ({ page }) => {
    await page.locator('.product_sort_container').selectOption('hilo');
    await expect(page.locator('.inventory_item_name').first()).toHaveText('Sauce Labs Fleece Jacket');
  });
});
