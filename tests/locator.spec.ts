import { test, expect } from '@playwright/test';
test("login validado com sucesso", async ({page}) => {
  await page.goto('https://locatorlab-testes.vercel.app/login')
  await page.getByPlaceholder('voce@exemplo.com').fill('aluno@locatorlab.dev')
  await page.getByPlaceholder('Sua senha').fill('Aluno@123')
  await page.getByRole('button', { name: 'Entrar' }).click()
  await expect(page).toHaveURL(/dashboard/)

})

// teste de upload de arquivo 
test("upload de arquivo", async ({page}) => {
  await page.goto('https://locatorlab-testes.vercel.app/profile')
  await page.locator('input[type="file"]').setInputFiles("/Users/breno/Desktop/teste.png")
  
})