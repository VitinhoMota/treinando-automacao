import { APIRequestContext } from '@playwright/test';

export class EmprestimosService {
    constructor(private request: APIRequestContext) {}

    async emprestar(livroId: number, headers: Record<string, string>) {
        return await this.request.post('/api/emprestimos', {
            headers,
            data: { livroId }
        });
    }
}
