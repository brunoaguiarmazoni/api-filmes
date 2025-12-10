# API de Filmes - Node.js + Fastify + SQLite

Uma API REST completa para gerenciamento de filmes com autenticação, avaliações e comentários.

## 🎬 Funcionalidades

- **Autenticação de Usuários**: Registro, login e gerenciamento de perfil com JWT
- **Gerenciamento de Filmes**: Criar, ler, atualizar e deletar filmes
- **Sistema de Avaliações**: Avaliar filmes com notas (0-10) e comentários
- **Cálculo de Média**: Cálculo automático da nota média dos filmes
- **Filtros**: Filtrar filmes por gênero, diretor ou usuário criador
- **Segurança**: Hash de senhas com bcryptjs e autenticação com JWT

## 🛠️ Tecnologias Utilizadas

- **Runtime**: Node.js
- **Framework**: Fastify
- **Banco de Dados**: SQLite
- **Autenticação**: @fastify/jwt + bcryptjs
- **Migrações**: Knex.js
- **Testes**: Vitest
- **CORS**: @fastify/cors

## 📋 Requisitos

- Node.js 18.0.0 ou superior
- npm ou yarn

## 🚀 Instalação

1. Clone o repositório:
```bash
git clone <seu-repositorio>
cd api-filmes
```

2. Instale as dependências:
```bash
npm install
```

3. Crie o diretório de dados:
```bash
mkdir data
```

4. Configure as variáveis de ambiente (opcional):
```bash
# .env
JWT_SECRET=sua-chave-secreta-super-segura-aqui
PORT=3000
```

## 🎯 Como Executar

### Executar Migrações
```bash
npm run migrate:latest
```
As migrações são executadas **automaticamente** ao iniciar o servidor.

### Verificar Status das Migrações
```bash
npm run migrate:status
```

### Desenvolvimento
```bash
npm run dev
```

### Produção
```bash
npm dev
```

A API estará disponível em `http://localhost:3000`

## 🧪 Testes

Execute todos os testes:
```bash
npm test
```

Execute com interface visual:
```bash
npm run test:ui
```

Gere relatório de cobertura:
```bash
npm run test:coverage
```

## 📚 Documentação da API

### Base URL
```
http://localhost:3000
```

### Health Check
```
GET /health
```

### Autenticação

#### Registrar Usuário
```
POST /auth/registrar
Content-Type: application/json

{
  "nome": "João Silva",
  "email": "joao@email.com",
  "senha": "senha123"
}
```

**Resposta (201)**:
```json
{
  "mensagem": "Usuário criado com sucesso",
  "usuario": {
    "id": 1,
    "nome": "João Silva",
    "email": "joao@email.com",
    "criado_em": "2025-12-08T10:30:00Z"
  }
}
```

#### Login
```
POST /auth/login
Content-Type: application/json

{
  "email": "joao@email.com",
  "senha": "senha123"
}
```

**Resposta (200)**:
```json
{
  "mensagem": "Login realizado com sucesso",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "usuario": {
    "id": 1,
    "nome": "João Silva",
    "email": "joao@email.com"
  }
}
```

### Usuários

#### Obter Perfil (Autenticado)
```
GET /usuarios/perfil
Authorization: Bearer {token}
```

#### Listar Todos os Usuários
```
GET /usuarios
```

#### Atualizar Perfil (Autenticado)
```
PUT /usuarios/:id
Authorization: Bearer {token}
Content-Type: application/json

{
  "nome": "João Silva Updated",
  "email": "joao.updated@email.com"
}
```

#### Deletar Conta (Autenticado)
```
DELETE /usuarios/:id
Authorization: Bearer {token}
```

### Filmes

#### Criar Filme (Autenticado)
```
POST /filmes
Authorization: Bearer {token}
Content-Type: application/json

{
  "titulo": "Homem-Aranha: Longe de Casa",
  "descricao": "Uma aventura épica do herói",
  "diretor": "Jon Watts",
  "ano_lancamento": 2021,
  "genero": "Ação"
}
```

**Resposta (201)**:
```json
{
  "mensagem": "Filme criado com sucesso",
  "filme": {
    "id": 1,
    "titulo": "Homem-Aranha: Longe de Casa",
    "descricao": "Uma aventura épica do herói",
    "diretor": "Jon Watts",
    "ano_lancamento": 2021,
    "genero": "Ação",
    "classificacao": 0,
    "usuario_id": 1,
    "usuario_nome": "João Silva",
    "criado_em": "2025-12-08T10:30:00Z",
    "atualizado_em": "2025-12-08T10:30:00Z"
  }
}
```

#### Listar Filmes
```
GET /filmes
GET /filmes?genero=Ação
GET /filmes?diretor=Jon
GET /filmes?usuario_id=1
```

**Resposta (200)**:
```json
{
  "total": 1,
  "filmes": [
    {
      "id": 1,
      "titulo": "Homem-Aranha: Longe de Casa",
      "diretor": "Jon Watts",
      "genero": "Ação",
      "classificacao": 9.5,
      "usuario_nome": "João Silva",
      "criado_em": "2025-12-08T10:30:00Z"
    }
  ]
}
```

#### Obter Detalhes do Filme
```
GET /filmes/:id
```

**Resposta (200)**:
```json
{
  "id": 1,
  "titulo": "Homem-Aranha: Longe de Casa",
  "descricao": "Uma aventura épica do herói",
  "diretor": "Jon Watts",
  "ano_lancamento": 2021,
  "genero": "Ação",
  "classificacao": 9.5,
  "usuario_id": 1,
  "usuario_nome": "João Silva",
  "avaliacoes": [
    {
      "id": 1,
      "nota": 9,
      "comentario": "Muito bom!",
      "usuario_nome": "Maria",
      "criado_em": "2025-12-08T11:00:00Z"
    }
  ],
  "criado_em": "2025-12-08T10:30:00Z",
  "atualizado_em": "2025-12-08T10:30:00Z"
}
```

#### Atualizar Filme (Autenticado)
```
PUT /filmes/:id
Authorization: Bearer {token}
Content-Type: application/json

{
  "titulo": "Novo Título",
  "descricao": "Nova descrição",
  "diretor": "Novo Diretor",
  "ano_lancamento": 2022,
  "genero": "Ação/Aventura"
}
```

#### Deletar Filme (Autenticado)
```
DELETE /filmes/:id
Authorization: Bearer {token}
```

### Avaliações

#### Avaliar Filme (Autenticado)
```
POST /filmes/:id/avaliar
Authorization: Bearer {token}
Content-Type: application/json

{
  "nota": 8.5,
  "comentario": "Filme excelente!"
}
```

**Resposta (201)**:
```json
{
  "mensagem": "Avaliação registrada com sucesso",
  "avaliacao": {
    "id": 1,
    "filme_id": 1,
    "usuario_id": 1,
    "nota": 8.5,
    "comentario": "Filme excelente!",
    "criado_em": "2025-12-08T11:00:00Z"
  },
  "media": 8.5,
  "total_avaliacoes": 1
}
```

#### Obter Avaliações de um Filme
```
GET /filmes/:id/avaliacoes
```

**Resposta (200)**:
```json
{
  "filme": {
    "id": 1,
    "titulo": "Homem-Aranha: Longe de Casa"
  },
  "media": 8.75,
  "total_avaliacoes": 2,
  "avaliacoes": [
    {
      "id": 1,
      "nota": 8.5,
      "comentario": "Filme excelente!",
      "usuario_nome": "João Silva",
      "criado_em": "2025-12-08T11:00:00Z"
    },
    {
      "id": 2,
      "nota": 9,
      "comentario": "Muito bom!",
      "usuario_nome": "Maria",
      "criado_em": "2025-12-08T11:30:00Z"
    }
  ]
}
```

## 📁 Estrutura do Projeto

```
api-filmes/
├── src/
│   ├── server.js                 # Configuração principal do Fastify
│   ├── database.js               # Inicialização do banco de dados SQLite
│   ├── controllers/
│   │   ├── UsuarioController.js  # Lógica de autenticação e usuários
│   │   └── FilmeController.js    # Lógica de filmes e avaliações
│   ├── models/
│   │   ├── UsuarioModel.js       # Operações de usuários no banco
│   │   ├── FilmeModel.js         # Operações de filmes no banco
│   │   └── AvaliacaoModel.js     # Operações de avaliações no banco
│   ├── routes/
│   │   ├── usuarios.js           # Rotas de autenticação e usuários
│   │   └── filmes.js             # Rotas de filmes e avaliações
│   ├── middleware/
│   │   └── auth.js               # Middleware de autenticação JWT
│   └── utils/
├── tests/
│   ├── UsuarioModel.test.js      # Testes do UsuarioModel
│   ├── FilmeModel.test.js        # Testes do FilmeModel
│   ├── AvaliacaoModel.test.js    # Testes do AvaliacaoModel
│   └── UsuarioController.test.js # Testes do UsuarioController
├── data/
│   └── filmes.db                 # Banco de dados SQLite (gerado)
├── package.json
├── vitest.config.js
└── README.md
```

## 🔒 Segurança

- **Senhas**: Hasheadas com bcryptjs (10 rounds)
- **Autenticação**: JWT (JSON Web Tokens)
- **Validação**: Dados validados antes de inserção
- **Permissões**: Apenas o criador pode editar/deletar seus filmes

## 📊 Banco de Dados

### Migrações

O projeto usa **Knex.js para gerenciar migrações**, permitindo:
- ✅ Versionamento do schema
- ✅ Histórico de mudanças
- ✅ Rollback de alterações
- ✅ Colaboração em equipe

**Comando para criar nova migração**:
```bash
npm run migrate:make nome_da_migracao
```

Ver `MIGRATIONS.md` para documentação completa.

### Estrutura do Banco

**3 tabelas relacionadas**:
- `usuarios` - Dados de usuários
- `filmes` - Informações de filmes
- `avaliacoes` - Notas e comentários

**Foreign Keys**:
- `filmes.usuario_id` → `usuarios.id`
- `avaliacoes.filme_id` → `filmes.id`
- `avaliacoes.usuario_id` → `usuarios.id`

## 📝 Exemplo de Uso com cURL

```bash
# Registrar usuário
curl -X POST http://localhost:3000/auth/registrar \
  -H "Content-Type: application/json" \
  -d '{"nome":"João","email":"joao@email.com","senha":"senha123"}'

# Login
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"joao@email.com","senha":"senha123"}'

# Criar filme (use o token do login)
curl -X POST http://localhost:3000/filmes \
  -H "Authorization: Bearer SEU_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"titulo":"Homem-Aranha","descricao":"Um herói","diretor":"Jon Watts","ano_lancamento":2021,"genero":"Ação"}'

# Listar filmes
curl http://localhost:3000/filmes

# Avaliar filme
curl -X POST http://localhost:3000/filmes/1/avaliar \
  -H "Authorization: Bearer SEU_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"nota":8.5,"comentario":"Excelente!"}'
```