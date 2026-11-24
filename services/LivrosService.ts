import { APIRequestContext } from '@playwright/test';

export type LivroPayload = {
    titulo: string;
    autor: string;
    isbn: string;
    anoPublicacao: number;
    quantidade: number;
};


export class LivrosService {
    constructor(private request: APIRequestContext) {}

    async buscarPorId(id: number) {
        return await this.request.get(`/api/livros/${id}`);
    }

    async cadastrar(livro: LivroPayload, headers?: Record<string, string>) {
        return await this.request.post('/api/livros', {
            headers,
            data: livro
        });
    }

    async deletar(id: number, headers: Record<string, string>) {
        return await this.request.delete(`/api/livros/${id}`, {
            headers
        });
    }
}
