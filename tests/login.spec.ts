import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';

test.describe('Inicio de sesion', () => {
  let login: LoginPage;

  test.beforeEach(async ({ page }) => {
    login = new LoginPage(page);
    await login.goto();
  });

  test('CP-001 Login exitoso', {
    tag: '@smoke',
    annotation: { type: 'Caso de prueba', description: 'CP-001' },
  }, async ({ page }) => {
    await login.login('standard_user', 'secret_sauce');

    await expect(page).toHaveURL(/\/inventory\.html$/);
    await expect(new InventoryPage(page).title).toBeVisible();
  });

  test('CP-002 Login fallido con clave incorrecta', async ({ page }) => {
    await login.login('standard_user', 'incorrecta');

    await expect(login.errorMessage).toContainText(
      'Username and password do not match any user in this service'
    );
    await expect(page).toHaveURL('https://www.saucedemo.com/');
  });

  test('CP-003 Login fallido con usuario bloqueado', async ({ page }) => {
    await login.login('locked_out_user', 'secret_sauce');

    await expect(login.errorMessage).toContainText('Sorry, this user has been locked out.');
    await expect(page).toHaveURL('https://www.saucedemo.com/');
  });
});
