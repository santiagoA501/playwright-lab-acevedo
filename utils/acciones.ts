import { test, type Locator, type Page } from '@playwright/test';
import { join } from 'node:path';

function limpiar(texto: string): string {
  return texto.replace(/[\\/:*?"<>|]/g, '').trim().replace(/[. ]+$/, '');
}

async function tomarCaptura(page: Page, descripcion: string) {
  const prueba = test.info();
  const cantidad = prueba.attachments.filter(a => a.contentType === 'image/png').length;
  const numero = String(cantidad + 1).padStart(2, '0');
  const nombre = `${numero} - ${limpiar(descripcion)}`;
  const ruta = join('evidencias', limpiar(prueba.title), `${nombre}.png`);

  const imagen = await page.screenshot({ path: ruta, fullPage: true });
  await prueba.attach(nombre, { body: imagen, contentType: 'image/png' });
}

async function capturarResaltado(locator: Locator, descripcion: string) {
  await locator.scrollIntoViewIfNeeded();

  const estiloPrevio = await locator.evaluate(elemento => {
    const el = elemento as HTMLElement;
    const previo = el.getAttribute('style');
    el.style.outline = '3px solid red';
    el.style.outlineOffset = '2px';
    return previo;
  });

  try {
    await tomarCaptura(locator.page(), descripcion);
  } finally {
    await locator.evaluate((el, previo) => {
      if (previo === null) {
        el.removeAttribute('style');
      } else {
        el.setAttribute('style', previo);
      }
    }, estiloPrevio);
  }
}

export async function clic(locator: Locator, descripcion: string) {
  await test.step(descripcion, async () => {
    await capturarResaltado(locator, descripcion);
    await locator.click();
  });
}

export async function escribir(locator: Locator, texto: string, descripcion: string) {
  await test.step(descripcion, async () => {
    await locator.fill(texto);
    await capturarResaltado(locator, descripcion);
  });
}

export async function seleccionar(locator: Locator, valor: string, descripcion: string) {
  await test.step(descripcion, async () => {
    await locator.selectOption(valor);
    await capturarResaltado(locator, descripcion);
  });
}

export async function evidenciaElemento(locator: Locator, descripcion: string) {
  await test.step(descripcion, async () => {
    await capturarResaltado(locator, descripcion);
  });
}

export async function evidenciaPantalla(page: Page, descripcion: string) {
  await test.step(descripcion, async () => {
    await tomarCaptura(page, descripcion);
  });
}
