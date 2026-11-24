import {Page, Locator} from"@playwright/test";

export class LoginPage {
    readonly Page: Page;
    readonly campousuario: Locator;
    readonly camposenha: Locator;
    readonly botaoentrar: Locator;

    constructor(page: Page) {
        this.Page = page;
        this.campousuario = page.getByPlaceholder("Username");
        this.camposenha = page.getByPlaceholder("Password");
        this.botaoentrar = page.getByRole("button", {name: "login"});
    }

    async abrir(){
        await this.Page.goto("https://www.saucedemo.com/");
    }
    async login (usuario: string, senha: string){
        await this.campousuario.fill(usuario);
        await this.camposenha.fill(senha);
        await this.botaoentrar.click();
    }

}