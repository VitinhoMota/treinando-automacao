import { APIRequestContext } from '@playwright/test';

export class AuthService {
    constructor(private request: APIRequestContext) {}

    async login(email: string, senha: string) {
        return await this.request.post('/api/auth/login', {
            data: { email, senha }
        });
    }

    async obterHeadersAutenticados(email: string, senha: string) {
        const resposta = await this.login(email, senha);
        const { token } = await resposta.json();
        return {
            'Authorization': `Bearer ${token}`
        };
    }
}
