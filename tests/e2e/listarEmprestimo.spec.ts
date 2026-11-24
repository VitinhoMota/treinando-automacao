import { test, expect } from '@playwright/test';
import { login, loginNoNavegador, criarlivro, apagarlivro } from '../Support/api-helpers';
import { admin, leitor, novolivro } from '../Support/dados';

test.use({ baseURL: 'http://localhost:3000' });

let tokenAdmin: string;
let livro: number;

test.beforeEach(async ({ request, page }) => {
  tokenAdmin = await login(request, admin.email, admin.senha);
  livro = await criarlivro(request, tokenAdmin, novolivro(2));
  await loginNoNavegador(page, request, leitor.email, leitor.senha);
});

test('livro criado pela API aparece na listagem', async ({ page }) => {
  await page.goto('/livros');

  await expect(page.getByTestId(`livro-linha-${livro}`)).toBeVisible();
  await expect(page.getByTestId(`livro-titulo-${livro}`)).toHaveText('Livro do Teste');
  await expect(page.getByTestId(`livro-autor-${livro}`)).toHaveText('Autora Inventada');
  await expect(page.getByTestId(`livro-disponibilidade-${livro}`)).toHaveText('Disponível');
});

test.afterEach(async ({ request }) => {
  if (livro) {
    await apagarlivro(request, tokenAdmin, livro);
  }
});
