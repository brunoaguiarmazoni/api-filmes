# Exemplos de Requisições HTTP

## Autenticação

### Registrar Novo Usuário
```http
POST http://localhost:3000/auth/registrar
Content-Type: application/json

{
  "nome": "João Silva",
  "email": "joao@email.com",
  "senha": "senha123"
}
```

### Fazer Login
```http
POST http://localhost:3000/auth/login
Content-Type: application/json

{
  "email": "joao@email.com",
  "senha": "senha123"
}
```

Resposta conterá o token JWT que deve ser usado em todas as requisições autenticadas:
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

### Obter Perfil (Autenticado)
```http
GET http://localhost:3000/usuarios/perfil
Authorization: Bearer {SEU_TOKEN_JWT}
```

### Listar Todos os Usuários
```http
GET http://localhost:3000/usuarios
```

### Atualizar Perfil (Autenticado)
```http
PUT http://localhost:3000/usuarios/1
Authorization: Bearer {SEU_TOKEN_JWT}
Content-Type: application/json

{
  "nome": "João Silva Updated",
  "email": "joao.updated@email.com"
}
```

### Deletar Conta (Autenticado)
```http
DELETE http://localhost:3000/usuarios/1
Authorization: Bearer {SEU_TOKEN_JWT}
```

## Filmes

### Criar Novo Filme (Autenticado)
```http
POST http://localhost:3000/filmes
Authorization: Bearer {SEU_TOKEN_JWT}
Content-Type: application/json

{
  "titulo": "Homem-Aranha: Longe de Casa",
  "descricao": "Uma aventura épica do herói",
  "diretor": "Jon Watts",
  "ano_lancamento": 2021,
  "genero": "Ação"
}
```

### Listar Todos os Filmes
```http
GET http://localhost:3000/filmes
```

### Listar Filmes por Gênero
```http
GET http://localhost:3000/filmes?genero=Ação
```

### Listar Filmes por Diretor
```http
GET http://localhost:3000/filmes?diretor=Jon
```

### Listar Filmes de um Usuário Específico
```http
GET http://localhost:3000/filmes?usuario_id=1
```

### Obter Detalhes de um Filme
```http
GET http://localhost:3000/filmes/1
```

### Atualizar Filme (Autenticado)
```http
PUT http://localhost:3000/filmes/1
Authorization: Bearer {SEU_TOKEN_JWT}
Content-Type: application/json

{
  "titulo": "Novo Título",
  "descricao": "Nova descrição",
  "diretor": "Novo Diretor",
  "ano_lancamento": 2022,
  "genero": "Ação/Aventura"
}
```

### Deletar Filme (Autenticado)
```http
DELETE http://localhost:3000/filmes/1
Authorization: Bearer {SEU_TOKEN_JWT}
```

## Avaliações

### Avaliar Filme (Autenticado)
```http
POST http://localhost:3000/filmes/1/avaliar
Authorization: Bearer {SEU_TOKEN_JWT}
Content-Type: application/json

{
  "nota": 8.5,
  "comentario": "Filme excelente!"
}
```

Nota: Se o usuário já avaliou o filme, a avaliação será atualizada.

### Obter Todas as Avaliações de um Filme
```http
GET http://localhost:3000/filmes/1/avaliacoes
```

## Health Check

### Verificar Status da API
```http
GET http://localhost:3000/health
```

Resposta:
```json
{
  "status": "ok",
  "timestamp": "2025-12-08T10:30:00Z"
}
```

## Usando com cURL

```bash
# Registrar
curl -X POST http://localhost:3000/auth/registrar \
  -H "Content-Type: application/json" \
  -d '{"nome":"João","email":"joao@email.com","senha":"senha123"}'

# Login
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"joao@email.com","senha":"senha123"}'

# Criar filme (substitua TOKEN pelo token recebido do login)
curl -X POST http://localhost:3000/filmes \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "titulo":"Homem-Aranha",
    "descricao":"Um herói",
    "diretor":"Jon Watts",
    "ano_lancamento":2021,
    "genero":"Ação"
  }'

# Listar filmes
curl http://localhost:3000/filmes

# Avaliar filme
curl -X POST http://localhost:3000/filmes/1/avaliar \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"nota":8.5,"comentario":"Excelente!"}'

# Obter avaliações
curl http://localhost:3000/filmes/1/avaliacoes
```

## Usando com Postman

1. Importe as requisições acima no Postman
2. Após fazer login, copie o token retornado
3. Em suas requisições autenticadas, vá para a aba "Authorization"
4. Selecione "Bearer Token" e cole o token
5. Pronto! Você pode fazer requisições autenticadas

## Códigos de Status HTTP

- `200` - OK (Requisição bem-sucedida)
- `201` - Created (Recurso criado com sucesso)
- `400` - Bad Request (Dados inválidos)
- `401` - Unauthorized (Autenticação necessária/inválida)
- `403` - Forbidden (Acesso negado)
- `404` - Not Found (Recurso não encontrado)
- `409` - Conflict (Conflito, ex: email já existe)
- `500` - Internal Server Error (Erro no servidor)
