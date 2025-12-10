# Guia de Apresentação - API de Filmes

## 📊 Estrutura da Apresentação (10-15 minutos)

### 1. Introdução (1-2 min)
- **Tema**: API REST para gerenciamento de filmes
- **Objetivo**: Aplicar conceitos de Node.js, REST, autenticação e testes
- **Stack Tecnológico**: Fastify, SQLite, JWT, bcryptjs, Vitest

### 2. Arquitetura e Estrutura (2-3 min)

Mostrar a estrutura do projeto:
```
api-filmes/
├── src/
│   ├── server.js             # Configuração Fastify
│   ├── database.js           # Inicialização SQLite
│   ├── controllers/          # Lógica de negócio
│   ├── models/               # Acesso ao banco
│   ├── routes/               # Definição de rotas
│   └── middleware/           # Autenticação JWT
├── tests/                    # Testes com Vitest
└── seed.js                   # Dados de exemplo
```

**Explicar a separação de responsabilidades**:
- **Models**: Acesso e manipulação de dados
- **Controllers**: Lógica de negócio e validações
- **Routes**: Definição de endpoints
- **Middleware**: Autenticação e autorização

### 3. Funcionalidades Principais (3-4 min)

#### Autenticação
- Registrar usuário (hash de senha com bcryptjs)
- Login (gera JWT)
- Proteção de rotas com middleware JWT

```bash
Demonstrar:
POST /auth/registrar
POST /auth/login
GET /usuarios/perfil (protegido)
```

#### Gerenciamento de Filmes
- CRUD completo (Create, Read, Update, Delete)
- Filtros por gênero, diretor, criador

```bash
Demonstrar:
GET /filmes
GET /filmes?genero=Ação
POST /filmes (protegido)
PUT /filmes/:id (protegido)
DELETE /filmes/:id (protegido)
```

#### Sistema de Avaliações
- Avaliar filmes (0-10)
- Cálculo automático da média
- Comentários

```bash
Demonstrar:
POST /filmes/:id/avaliar (protegido)
GET /filmes/:id/avaliacoes
GET /filmes/:id (com avaliações)
```

### 4. Banco de Dados (1-2 min)

Mostrar estrutura:
```sql
Tabelas:
- usuarios (id, nome, email, senha_hash)
- filmes (id, titulo, diretor, genero, usuario_id)
- avaliacoes (id, filme_id, usuario_id, nota, comentario)

Relacionamentos:
- Filmes pertencem a Usuários
- Avaliações pertencem a Filmes e Usuários
- Cascade delete para integridade
```

### 5. Segurança (1-2 min)

Explicar medidas implementadas:
- ✅ Hash de senhas com bcryptjs (10 rounds)
- ✅ Autenticação com JWT
- ✅ Validação de dados
- ✅ Autorização (apenas criador edita seu conteúdo)
- ✅ CORS habilitado
- ✅ Tratamento de erros

### 6. Como Usar (2-3 min)

#### Local
```bash
# Instalação
npm install

# Desenvolvimento (migrações rodam automaticamente)
npm run dev

# (Opcional) Popular com dados de exemplo
npm run seed

# Testes
npm test

# Com dados de exemplo:
Email: joao@example.com | Senha: senha123
Email: maria@example.com | Senha: senha456
```

