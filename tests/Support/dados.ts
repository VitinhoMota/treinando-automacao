// Usuários que já existem no seed da biblioteca
export const admin = {
  email: 'admin@biblioteca.com',
  senha: 'Admin@123',
};

export const leitor = {
  email: 'leitor@biblioteca.com',
  senha: 'Leitor@123',
};

// Monta os dados de um livro para o teste criar pela API.
// O ISBN é fixo de propósito: sem teardown, a segunda execução quebra com 409.
export function novolivro(quantidade: number, isbn = '9780000000001') {
  return {
    titulo: 'Livro do Teste',
    autor: 'Autora Inventada',
    isbn,
    anoPublicacao: 2020,
    quantidade,
  };
}