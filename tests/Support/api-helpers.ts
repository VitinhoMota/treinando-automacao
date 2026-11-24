import { APIRequestContext, Page, expect } from '@playwright/test';

// Faz login pela API e devolve o token
export async function login(request: APIRequestContext, email: string, senha: string): Promise<string> {
  const resposta = await request.post('/api/auth/login', {
    data: { email, senha },
  });
  expect(resposta.status()).toBe(200);
  return (await resposta.json()).token;
}

// Faz login pela API e já deixa o navegador logado (pula a tela de login)
export async function loginNoNavegador(page: Page, request: APIRequestContext, email: string, senha: string): Promise<string> {
  const resposta = await request.post('/api/auth/login', {
    data: { email, senha },
  });
  expect(resposta.status()).toBe(200);
  const { token, usuario } = await resposta.json();

  await page.addInitScript(([t, u]) => {
    localStorage.setItem('token', t);
    localStorage.setItem('usuario', JSON.stringify(u));
  }, [token, usuario]);

  return token;
}

// Cria um livro pela API e devolve o id dele
export async function criarlivro(request: APIRequestContext, token: string, dados: object): Promise<number> {
  const resposta = await request.post('/api/livros', {
    headers: { Authorization: `Bearer ${token}` },
    data: dados,
  });
  expect(resposta.status()).toBe(201);
  return (await resposta.json()).id;
}

// Apaga um livro pela API (precisa de token de admin)
export async function apagarlivro(request: APIRequestContext, token: string, id: number) {
  const resposta = await request.delete(`/api/livros/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  expect(resposta.status()).toBe(204);
}

// Procura o empréstimo ativo de um livro e devolve o id (ou undefined se não achar)
export async function buscaremprestimoativo(request: APIRequestContext, token: string, livroId: number): Promise<number | undefined> {
  const resposta = await request.get('/api/emprestimos?status=ativo', {
    headers: { Authorization: `Bearer ${token}` },
  });
  expect(resposta.status()).toBe(200);
  const emprestimos: { id: number; livroId: number }[] = await resposta.json();
  return emprestimos.find((e) => e.livroId === livroId)?.id;
}

// Apaga um empréstimo pela API (precisa de token de admin)
export async function apagaremprestimo(request: APIRequestContext, token: string, id: number) {
  const resposta = await request.delete(`/api/emprestimos/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  expect(resposta.status()).toBe(204);
}