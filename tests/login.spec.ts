import { test, expect } from '@playwright/test';

test("login validado com sucesso", async ({page}) => {
  await page.goto("https://www.saucedemo.com/")
  await page.getByPlaceholder("Username").fill("standard_user") // atalho semnatico
  await page.getByPlaceholder("Password").fill("secret_sauce")
 await expect(page.locator("#user-name")).toHaveValue("standard_user");
  await page.locator("#login-button").click() // atalho pelo css
  await expect(page).toHaveURL("https://www.saucedemo.com/inventory.html") 

});