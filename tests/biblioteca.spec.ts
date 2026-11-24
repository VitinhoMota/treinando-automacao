import { test, expect } from '@playwright/test';
import { AuthService } from '../services/AuthService';
import { LivrosService, LivroPayload } from '../services/LivrosService';
import { EmprestimosService } from '../services/EmprestimosService';

const admin = {
    email: "admin@biblioteca.com",
    senha: "Admin@123"
};

test.describe('Login', () => {
    test("Deve realizar login como administrador com sucesso e retornar status 200 com token", async ({ request }) => {
        const authService = new AuthService(request);
        const resposta = await authService.login(admin.email, admin.senha);
        const corpo = await resposta.json();
        expect(resposta.status()).toBe(200);
        expect(corpo.token).toBeTruthy();
    });
});

test.describe('Biblioteca', () => {
    let authService: AuthService;
    let livrosService: LivrosService;
    let emprestimosService: EmprestimosService;
    
    let authHeaders: Record<string, string>;
    let livroCriadoId: number | null = null;

    test.beforeEach(async ({ request }) => {
        authService = new AuthService(request);
        livrosService = new LivrosService(request);
        emprestimosService = new EmprestimosService(request);
        authHeaders = await authService.obterHeadersAutenticados(admin.email, admin.senha);
    });

    test.afterEach(async () => {
        if (livroCriadoId) {
            const respostaDelete = await livrosService.deletar(livroCriadoId, authHeaders);
            expect(respostaDelete.ok()).toBeTruthy();
            livroCriadoId = null;
        }
    });

    test("Deve consultar o livro de id 1 e retornar status 200, título Dom Casmurro e disponível", async () => {
        const resposta = await livrosService.buscarPorId(1);
        const corpo = await resposta.json();
        expect(resposta.status()).toBe(200);
        expect(corpo.titulo).toBe("Dom Casmurro");
        expect(corpo.disponivel).toBe(true);
    });

    test("Deve cadastrar um novo livro como admin (201) e validar os dados retornados", async () => {
        const novoLivro: LivroPayload = {
            titulo: "O Pequeno Príncipe",
            autor: "Antoine de Saint-Exupéry",
            isbn: '9788500000097',
            anoPublicacao: 1943,
            quantidade: 4
        };

        const resposta = await livrosService.cadastrar(novoLivro, authHeaders);
        const livroCriado = await resposta.json();
        livroCriadoId = livroCriado.id;
        expect(resposta.status()).toBe(201);
        expect(livroCriado.id).toBeDefined();
        expect(livroCriado).toMatchObject(novoLivro);
    });

    test("Deve recusar cadastro de livro sem token com status 401 e mensagem de erro", async () => {
        const novoLivro: LivroPayload = {
            titulo: "O Pequeno Príncipe",
            autor: "Antoine de Saint-Exupéry",
            isbn: '9788500000097',
            anoPublicacao: 1943,
            quantidade: 4
        };

        const resposta = await livrosService.cadastrar(novoLivro);
        const corpoErro = await resposta.json();
        expect(resposta.status()).toBe(401);
        expect(corpoErro.erro).toBe("Token não informado");
    });

    test("Deve retornar status 409 e mensagem 'Livro indisponível' ao tentar emprestar Vidas Secas (id 4)", async () => {
        const resposta = await emprestimosService.emprestar(4, authHeaders);
        const corpoResposta = await resposta.json();
        expect(resposta.status()).toBe(409);
        expect(corpoResposta.erro).toBe("Livro indisponível");
    });
});
