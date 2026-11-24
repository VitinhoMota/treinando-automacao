import { test, expect } from '@playwright/test';
import {login, loginNoNavegador, criarlivro, apagarlivro, buscaremprestimoativo, apagaremprestimo} from '../Support/api-helpers';
import { admin, leitor, novolivro } from '../Support/dados';

test.use({ baseURL: 'http://localhost:3000' });

let tokenAdmin: string;
let livro: number;

test.beforeEach(async ({ request, page }) => {
  tokenAdmin = await login(request, admin.email, admin.senha);
  livro = await criarlivro(request, tokenAdmin, novolivro(1));
  await loginNoNavegador(page, request, leitor.email, leitor.senha);
});

test('leitor empresta um livro pela tela', async ({ page }) => {
  await page.goto('/livros');
  await page.getByTestId(`livro-linha-${livro}`).getByText('Ver detalhes').click();
  await page.getByRole('button', { name: /emprestar/i }).click();
  await expect(page.getByText('Empréstimo realizado com sucesso')).toBeVisible();
  await expect(page.getByText('Indisponível')).toBeVisible();
});

test.afterEach(async ({ request }) => {
  if (livro) {
    const emprestimoId = await buscaremprestimoativo(request, tokenAdmin, livro);
    if (emprestimoId) {
      await apagaremprestimo(request, tokenAdmin, emprestimoId);
    }
    await apagarlivro(request, tokenAdmin, livro);
  }
});
