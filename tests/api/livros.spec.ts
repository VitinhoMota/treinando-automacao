import { test, expect } from '@playwright/test';
const rota = (" /api/auth/login");
const admin = {
    email: "admin@example.com",
    senha: "admin123"
};

test.describe('Login', () => {
  test("login com sucesso", async({ request }) => {
    const resposta = await request.post(rota,{ data: admin });
    expect(resposta.status()).toBe(200);
    
  });


});