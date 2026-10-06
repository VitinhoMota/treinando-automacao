import { test, expect, Page } from '@playwright/test';

async function login(page: Page, username: string, password: string) {
    await page.goto("https://www.saucedemo.com/");
    await page.getByPlaceholder("Username").fill(username);
    await page.getByPlaceholder("Password").fill(password);
    await page.getByRole("button", { name: "Login" }).click();
}

test.describe("Login", () => {    
    test.beforeEach(async ({ page }) => {
        await page.goto("https://www.saucedemo.com/");
    });
    test("login com credenciais validas", async ({ page }) => {
        await login(page, "standard_user", "secret_sauce");
        await expect(page).toHaveURL("https://www.saucedemo.com/inventory.html");
    });
    test("login com credenciais invalidas", async ({ page }) => {
        await login(page, "st_user", "secret_sauce");
        await expect(page).toHaveURL("https://www.saucedemo.com/");
    });
});

test.describe("products", () => {
    test.beforeEach(async ({page}) => {
        await login(page, "standard_user", "secret_sauce");
    });
    test("verificar se é possivel acessar o produto Sauce Labs Backpack", async ({page}) => {
        await page.getByRole("img", {name: "Sauce Labs Backpack"}).click();
         await expect(page).toHaveURL("https://www.saucedemo.com/inventory-item.html?id=4");
    });
});

test.describe("cart", () => {
    test.beforeEach(async ({page}) => {
        await login(page, "standard_user", "secret_sauce");
    });
    test("verificar se o carrinho de compras, vazio, esta acessivel", async({page}) => {
        await page.getByRole("button", {name: "Cart, empty"}).click();
         await expect(page).toHaveURL("https://www.saucedemo.com/cart.html")
    });
});

test.describe("about", () => {
    test.beforeEach(async ({page}) => {
        await login(page, "standard_user", "secret_sauce");
    })
    test("verificar se é possivel acessar a pagina about", async({page}) => {
        await page.getByRole("button", { name: "Open Menu" }).click();
          await page.getByRole("link", { name: "About" }).waitFor({ state: "visible" });
            await page.getByRole("link", {name: "About"}).click();
             await expect(page).toHaveURL("https://saucelabs.com/");
    });
});

test.describe("logout", () => {
    test.beforeEach(async ({page}) => {
        await login(page, "standard_user", "secret_sauce");
    })
    test("verificar se é possivel fazer logout", async({page}) => {
        await page.getByRole("button", { name: "Open Menu" }).click();
          await page.getByRole("link", { name: "About" }).waitFor({ state: "visible" });
            await page.getByRole("button", {name: "Logout"}).click();
             await expect(page).toHaveURL("https://www.saucedemo.com/");
    });
});
