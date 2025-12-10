# Guia de Deploy - API de Filmes

## ✅ Pré-requisitos

- Git configurado
- Repositório GitHub criado
- Conta em uma plataforma de hosting

## 🚀 Opção 1: Deploy no Render

### Passo 1: Preparar Repositório GitHub
```bash
git init
git add .
git commit -m "Initial commit: API de Filmes"
git branch -M main
git remote add origin https://github.com/seu-usuario/api-filmes.git
git push -u origin main
```

### Passo 2: Criar Serviço no Render
1. Acesse [https://render.com](https://render.com)
2. Faça login com GitHub
3. Clique em "New" → "Web Service"
4. Selecione seu repositório `api-filmes`
5. Configure:
   - **Name**: `api-filmes`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm dev`
   - **Plan**: Free (ou pago conforme necessidade)

### Passo 3: Adicionar Variáveis de Ambiente
1. No painel do Render, vá para "Environment"
2. Adicione:
   - `JWT_SECRET`: (gere uma chave segura - veja abaixo)
   - `NODE_ENV`: `production`
   - `PORT`: `3000` (opcional, Render define automaticamente)

### Passo 4: Deploy
Clique em "Deploy" e aguarde. A URL será fornecida automaticamente.

### Passo 5: Banco de Dados no Render
Após deploy:
1. **Primeira inicialização**: As migrações rodam **automaticamente**
2. **Arquivo `filmes.db`** é criado no servidor Render
3. **Dados persistem** entre redeploys (enquanto não deletar)
4. **Sem configuração adicional necessária!**

⚠️ **Importante sobre SQLite no Render:**
- Dados persistem no sistema de arquivos do Render
- Ao "Destroy" um serviço, o banco é deletado
- Para backup: Faça download do `data/filmes.db` regularmente
- Alternativa: Use PostgreSQL (veja Opção B abaixo)

---

## 💾 Banco de Dados em Produção

### ✅ Com SQLite (Seu Projeto Atual)

**Fluxo automático:**
1. Deploy feito
2. `src/database.js` executa migrações automaticamente
3. Tabelas criadas: `usuarios`, `filmes`, `avaliacoes`
4. Banco pronto para usar!

**Vantagens:**
- ✅ Zero configuração
- ✅ Dados persistem entre redeploys
- ✅ Grátis no Render
- ✅ Ideal para pequenas aplicações

**Desvantagens:**
- ⚠️ Ao deletar serviço = perdem dados
- ⚠️ Acesso limitado a 1 servidor
- ⚠️ Backup manual

**Como fazer backup do banco:**
```bash
# Localmente, baixe data/filmes.db do servidor
# Ou acesse via SFTP (se Render permitir)
```

---

### 🔄 Migrar para PostgreSQL (Recomendado para Produção)

Se quiser banco externo mais robusto:

#### No Render:
1. Crie um novo "PostgreSQL Database"
2. Copie a `DATABASE_URL`
3. Adicione como variável de ambiente no Web Service
4. Atualize `knexfile.js` para usar PostgreSQL

#### Comando para instalar dependência:
```bash
npm install pg
```

#### Atualizar knexfile.js:
```javascript
const client = process.env.DATABASE_URL ? 'postgresql' : 'sqlite3';

export default {
  client: client,
  connection: process.env.DATABASE_URL || {
    filename: path.join(__dirname, 'data', 'filmes.db'),
  },
  // ... resto da config
};
```

---

### 📊 Comparação: SQLite vs PostgreSQL

| Aspecto | SQLite | PostgreSQL |
|---------|--------|-----------|
| Configuração | Nenhuma | Precisa criar BD |
| Custo | Grátis | Grátis (até limite) |
| Dados persistem | Sim | Sim |
| Escalabilidade | Pequena | Grande |
| Backup | Manual | Automático (Render) |
| Múltiplos servidores | Não | Sim |

**Recomendação**: SQLite é perfeito para seu projeto atual! Se crescer, migre para PostgreSQL.

---

## 🌐 Variáveis de Ambiente Necessárias

Adicione estas no painel do Render (ou outro hosting):

```
JWT_SECRET=sua-chave-criptografica-aqui
NODE_ENV=production
PORT=3000 (opcional, Render configura automaticamente)
```

### Gerar JWT_SECRET seguro:
```javascript
// No Node.js ou console do navegador:
require('crypto').randomBytes(32).toString('hex')

// Resultado exemplo:
// a7f4c9e2b1d6f3h8j2k5l9m4n6p8q2r5t8v1w4x7y9z2a5b8c1d4e7f0g3h6j9
```

---

### Passo 1: Preparar Repositório
(Mesmo que Render acima)

### Passo 2: Criar Projeto no Railway
1. Acesse [https://railway.app](https://railway.app)
2. Clique em "New Project"
3. Selecione "Deploy from GitHub"
4. Conecte e selecione `api-filmes`

### Passo 3: Configurar Variáveis
1. Vá para "Variables"
2. Adicione `JWT_SECRET` com uma chave segura

### Passo 4: Deploy Automático
O Railway fará deploy automaticamente após cada push no GitHub.

---

## 🚀 Opção 3: Deploy no Heroku

### Passo 1: Instalar Heroku CLI
```bash
# Windows com choco
choco install heroku-cli

# Ou baixe manualmente em: https://devcenter.heroku.com/articles/heroku-cli
```

### Passo 2: Fazer Login
```bash
heroku login
```

### Passo 3: Criar App
```bash
heroku create api-filmes-seu-nome
```

### Passo 4: Adicionar Variáveis de Ambiente
```bash
heroku config:set JWT_SECRET="sua-chave-secreta-aqui"
heroku config:set NODE_ENV="production"
```

### Passo 5: Deploy
```bash
git push heroku main
```

### Passo 6: Ver Logs
```bash
heroku logs --tail
```

---

## 🚀 Opção 4: Deploy na AWS com Elastic Beanstalk

### Passo 1: Instalar AWS CLI
```bash
pip install awsebcli --upgrade --user
```

### Passo 2: Inicializar Aplicação
```bash
eb init -p node.js-20 api-filmes
```

### Passo 3: Criar Ambiente
```bash
eb create api-filmes-env
```

### Passo 4: Adicionar Variáveis de Ambiente
```bash
eb setenv JWT_SECRET="sua-chave-secreta-aqui"
```

### Passo 5: Deploy
```bash
eb deploy
```

---

## 📊 Banco de Dados em Produção

### ⚠️ Importante: SQLite em Produção

O SQLite é ótimo para desenvolvimento, mas para produção considere:

#### Opção A: Manter SQLite (Simples)
- Funciona bem para aplicações pequenas/médias
- Dados persistem no servidor
- Sem custo adicional

#### Opção B: Migrar para PostgreSQL (Recomendado)

##### 1. Adicionar PostgreSQL em Railway/Render
```bash
npm install pg
```

##### 2. Atualizar database.js
```javascript
import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});
```

##### 3. Adicionar Variável de Ambiente
```
DATABASE_URL=postgresql://usuario:senha@host:porta/banco
```

---

## 🔐 Gerar Chave JWT Segura

Execute no Node.js:
```javascript
console.log(require('crypto').randomBytes(32).toString('hex'))
```

Ou use online: https://www.random.org/

---

## 📈 Monitoramento em Produção

### Render
- Logs automáticos no dashboard
- Health checks configuráveis

### Railway
- Métricas em tempo real
- Logs estruturados

### Heroku
```bash
heroku logs --tail
heroku ps
```

---

## ✅ Checklist de Deploy

- [ ] Repositório GitHub criado e sincronizado
- [ ] Arquivo `.env` adicionado ao `.gitignore`
- [ ] Arquivo `.env.example` criado com variáveis
- [ ] `JWT_SECRET` configurado no hosting
- [ ] `NODE_ENV` configurado como `production`
- [ ] Testes rodando com sucesso localmente
- [ ] README.md atualizado com instruções
- [ ] API testada em produção
- [ ] Documentação atualizada com URL de produção

---

## 🧪 Testar API em Produção

Após deploy, teste com:

```bash
# Health check
curl https://seu-api.com/health

# Registrar usuário
curl -X POST https://seu-api.com/auth/registrar \
  -H "Content-Type: application/json" \
  -d '{"nome":"Test","email":"test@test.com","senha":"teste123"}'

# Login
curl -X POST https://seu-api.com/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","senha":"teste123"}'

# Listar filmes
curl https://seu-api.com/filmes
```

---

## 🆘 Solução de Problemas

### Erro: "Cannot find module"
```bash
# Reinstale dependências no servidor
rm -rf node_modules
npm install
```

### Erro: "Port already in use"
- Render/Railway/Heroku usam PORT automática
- Não precisa configurar porta manualmente

### Erro: "Database connection failed"
- Verifique arquivo `.env`
- Confirme variáveis de ambiente configuradas
- Reinicie a aplicação

### Logs vazios
- Verifique logs do hosting específico
- Adicione console.log para debugging

---

## 📝 Após Deploy

1. **Atualizar README.md** com URL de produção
2. **Testar todas as rotas** em produção
3. **Monitorar logs** regularmente
4. **Fazer backup** do banco de dados regularmente
5. **Documentar** qualquer configuração especial

---

## 🎯 Resumo Rápido - Render (Recomendado)

```bash
# 1. Preparar Git
git init
git add .
git commit -m "API de Filmes"
git push origin main

# 2. No Render:
# - Conectar GitHub
# - Selecionar repositório
# - Build: npm install
# - Start: npm dev
# - Adicionar JWT_SECRET

# 3. Deploy automático!
```

**URL final**: `https://api-filmes.onrender.com`

---
