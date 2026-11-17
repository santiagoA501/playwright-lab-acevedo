import { clic, seleccionar } from '../utils/acciones';
import type { Locator, Page } from '@playwright/test';

export class InventoryPage {
  readonly title: Locator;
  readonly items: Locator;
  readonly productNames: Locator;
  readonly cartBadge: Locator;
  readonly cartLink: Locator;
  readonly sortDropdown: Locator;

  constructor(private readonly page: Page) {
    this.title = page.getByText('Products', { exact: true });
    this.items = page.locator('.inventory_item');
    this.productNames = page.locator('.inventory_item_name');
    this.cartBadge = page.locator('.shopping_cart_badge');
    this.cartLink = page.locator('.shopping_cart_link');
    this.sortDropdown = page.locator('.product_sort_container');
  }

  item(name: string): Locator {
    return this.items.filter({ has: this.page.getByText(name, { exact: true }) });
  }

  addButton(name: string): Locator {
    return this.item(name).getByRole('button', { name: 'Add to cart', exact: true });
  }

  removeButton(name: string): Locator {
    return this.item(name).getByRole('button', { name: 'Remove', exact: true });
  }

  async addToCart(name: string) {
    await clic(this.addButton(name), 'Agregar ' + name + ' al carrito');
  }

  async removeFromCart(name: string) {
    await clic(this.removeButton(name), 'Quitar ' + name + ' del carrito');
  }

  async goToCart() {
    await clic(this.cartLink, 'Abrir carrito');
  }

  async sortByPrice(order: 'lohi' | 'hilo') {
    await seleccionar(this.sortDropdown, order, 'Ordenar por precio ' + order);
  }
}
