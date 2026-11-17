import { clic, escribir } from '../utils/acciones';
import type { Locator, Page } from '@playwright/test';

export class CheckoutPage {
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly postalCodeInput: Locator;
  readonly continueButton: Locator;
  readonly finishButton: Locator;
  readonly completeHeader: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    this.firstNameInput = page.getByPlaceholder('First Name');
    this.lastNameInput = page.getByPlaceholder('Last Name');
    this.postalCodeInput = page.getByPlaceholder('Zip/Postal Code');
    this.continueButton = page.getByRole('button', { name: 'Continue', exact: true });
    this.finishButton = page.getByRole('button', { name: 'Finish', exact: true });
    this.completeHeader = page.getByRole('heading', { name: 'Thank you for your order!' });
    this.errorMessage = page.locator('[data-test="error"]');
  }

  async fillInformation(firstName: string, lastName: string, postalCode: string) {
    await escribir(this.firstNameInput, firstName, 'Ingresar nombre');
    await escribir(this.lastNameInput, lastName, 'Ingresar apellido');
    await escribir(this.postalCodeInput, postalCode, 'Ingresar codigo postal');
    await clic(this.continueButton, 'Clic en Continue');
  }

  async finish() {
    await clic(this.finishButton, 'Clic en Finish');
  }
}
