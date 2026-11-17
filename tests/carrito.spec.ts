import { test, expect } from '@playwright/test';

test('CP-004 Agregar la mochila al carrito', async ({ page }) => {
  await page.goto('https://www.saucedemo.com/');
  await page.getByPlaceholder('Username').fill('standard_user');
  await page.getByPlaceholder('Password').fill('secret_sauce');
  await page.getByRole('button', { name: 'Login', exact: true }).click();

  const mochila = page.locator('.inventory_item').filter({
    has: page.getByText('Sauce Labs Backpack', { exact: true }),
  });

  await mochila.getByRole('button', { name: 'Add to cart' }).click();

  await expect(page.locator('.shopping_cart_badge')).toHaveText('1');
  await expect(mochila.getByRole('button', { name: 'Remove' })).toBeVisible();
});

test('CP-005 Agregar dos productos al carrito', async ({ page }) => {
  await page.goto('https://www.saucedemo.com/');
  await page.getByPlaceholder('Username').fill('standard_user');
  await page.getByPlaceholder('Password').fill('secret_sauce');
  await page.getByRole('button', { name: 'Login', exact: true }).click();

  const productos = page.locator('.inventory_item');
  const mochila = productos.filter({
    has: page.getByText('Sauce Labs Backpack', { exact: true }),
  });
  const luz = productos.filter({
    has: page.getByText('Sauce Labs Bike Light', { exact: true }),
  });

  await mochila.getByRole('button', { name: 'Add to cart' }).click();
  await luz.getByRole('button', { name: 'Add to cart' }).click();

  await expect(page.locator('.shopping_cart_badge')).toHaveText('2');
});
