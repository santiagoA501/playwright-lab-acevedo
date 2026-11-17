import { clic, escribir, evidenciaPantalla } from '../utils/acciones';
import type { Locator, Page } from '@playwright/test';

export class LoginPage {
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly errorMessage: Locator;

  constructor(private readonly page: Page) {
    this.usernameInput = page.getByPlaceholder('Username');
    this.passwordInput = page.getByPlaceholder('Password');
    this.loginButton = page.getByRole('button', { name: 'Login', exact: true });
    this.errorMessage = page.locator('[data-test="error"]');
  }

  async goto() {
    await this.page.goto('/');
    await evidenciaPantalla(this.page, 'Abrir SauceDemo');
  }

  async login(username: string, password: string) {
    await escribir(this.usernameInput, username, 'Ingresar usuario');
    await escribir(this.passwordInput, password, 'Ingresar clave');
    await clic(this.loginButton, 'Clic en Login');
  }
}
