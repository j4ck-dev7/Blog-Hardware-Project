# Hardware Blog API

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/Node.js-v18.0%2B-blue)](https://nodejs.org/)
[![Build Status](https://img.shields.io/badge/build-passing-brightgreen)](https://example.com)

## Descrição

Esta é uma API REST que simula um backend de um blog. A API permite gerenciar artigos como administrador e como usuário pode adicionar comentários e curtidas, com suporte a autenticação de usuários. Futuramente, será integrada a um frontend para uma experiência completa de blog.

Principais funcionalidades:
- Listagem e pesquisa de artigos.
- Gerenciamento de usuários (cadastro e autenticação).
- Postagem, edição e exclusão de comentários em artigos.
- Adição e remoção de curtidas em artigos.
- Retorno de contagem de curtidas e lista de comentários por artigo.

A API é construída com [Node.js](https://nodejs.org/) e [Express.js](https://expressjs.com/), utilizando um banco de dados [MongoDB](https://www.mongodb.com/). Ela segue princípios de REST e usa JWT para autenticação.

## Pré-requisitos

- Node.js v18.0 ou superior.
- Banco de dados configurado (MongoDB Atlas)
- Variáveis de ambiente definidas em um arquivo `.env` (veja o exemplo abaixo).

## Instalação

1. Clone o repositório:
   ```
   git clone https://github.com/seu-usuario/Blog-Hardware-Project.git
   cd blog-hardware-project
   ```

2. Instale as dependências:
   ```
   npm install
   ```

3. Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:
   ```
   PORT=5000
   MONGO_CONNECT='mongodb+srv://user:password@cluster1.78fk80s.mongodb.net/?retryWrites=true&w=majority&appName=Cluster1'
   JWT_SECRET=seu-segredo-aqui
   ```

4. Inicie o servidor:
   ```
   node server.js
   ```

## Uso

A API está disponível em `http://localhost:5000` (ou a porta definida). Use ferramentas como [Postman](https://www.postman.com/) ou [Insomnia](https://insomnia.rest/) para testar os endpoints.

### Autenticação
- A maioria dos endpoints requer autenticação via JWT. Para obter um token:
  - Cadastre um usuário via POST `/api/users/register`.
  - Faça login via POST `/api/users/login` e use o token retornado no cookie `auth: <token>`.

## Endpoints

### Artigos
- **GET /api/articles**  
  Retorna todos os artigos.  
  Parâmetros opcionais: `?search=termo` para pesquisa por título ou conteúdo.  
  Resposta: Array de artigos com ID, título, conteúdo, data, contagem de curtidas e comentários.

- **GET /api/articles/:id**  
  Retorna um artigo específico, incluindo lista de comentários e contagem de curtidas.

### Comentários
- **GET /api/articles/:id/comments**  
  Retorna comentários de um artigo.

- **POST /api/articles/:id/comments** (Autenticado)  
  Adiciona um comentário.  
  Body: `{ "content": "string" }`

- **PUT /api/comments/:commentId** (Autenticado, dono do comentário)  
  Edita um comentário.  
  Body: `{ "content": "string" }`

- **DELETE /api/comments/:commentId** (Autenticado, dono ou admin)  
  Exclui um comentário.

### Curtidas
- **POST /api/articles/:id/likes** (Autenticado)  
  Adiciona uma curtida.

- **DELETE /api/articles/:id/likes** (Autenticado)  
  Remove uma curtida.

### Usuários
- **POST /api/users/register**  
  Cadastra um novo usuário.  
  Body: `{ "username": "string", "email": "string", "password": "string" }`

- **POST /api/users/login**  
  Faz login e retorna JWT.  
  Body: `{ "email": "string", "password": "string" }`

## Contribuição

Contribuições são bem-vindas! Siga estes passos:
1. Fork o repositório.
2. Crie uma branch: `git checkout -b feature/nova-funcionalidade`.
3. Commit suas mudanças: `git commit -m 'Adiciona nova funcionalidade'`.
4. Push para a branch: `git push origin feature/nova-funcionalidade`.
5. Abra um Pull Request.

Por favor, siga o [Código de Conduta](CODE_OF_CONDUCT.md).

## Licença

Este projeto está licenciado sob a [MIT License](LICENSE).

## Contato

- Autor: Jackson (j4ckson7dev@gmail.com)
- GitHub: [j4ck-dev7](https://github.com/j4ck-dev7)