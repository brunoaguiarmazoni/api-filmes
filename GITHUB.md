# 📤 Como Subir para o GitHub

## ✅ Passo 1: Criar Repositório no GitHub

1. Acesse [github.com](https://github.com)
2. Clique em **"+" (canto superior)** → **"New repository"**
3. Configure:
   - **Repository name**: `api-filmes`
   - **Description**: `API REST para gerenciamento de filmes com Node.js, Fastify e SQLite`
   - **Public** (visível para todos) ou **Private** (só você)
   - ✅ Deixe **"Initialize this repository with:"** DESMARCADO (seu projeto já existe)
4. Clique em **"Create repository"**

---

## ✅ Passo 2: Configurar Git Localmente

### 2.1 Verifique se Git está instalado
```powershell
git --version
```

Se não estiver instalado, baixe em [git-scm.com](https://git-scm.com)

### 2.2 Configure suas credenciais (primeira vez)
```powershell
git config --global user.name "Seu Nome"
git config --global user.email "seu.email@github.com"
```

---

## ✅ Passo 3: Inicializar Git no Projeto (Se ainda não tiver)

Abra PowerShell **na pasta do projeto** e execute:

```powershell
cd "C:\Users\bruno\OneDrive - Caixa de Assistencia dos Funcionarios do Banco do Brasil\Documentos\Bruno\pucminas\node\trabalho final"
```

### 3.1 Inicializar repositório
```powershell
git init
```

### 3.2 Adicionar todos os arquivos
```powershell
git add .
```

### 3.3 Fazer primeiro commit
```powershell
git commit -m "Commit inicial: API de Filmes completa com testes e documentação"
```

---

## ✅ Passo 4: Conectar ao GitHub

### 4.1 Adicionar URL do repositório remoto

**Substitua `seu-usuario` pelo seu usuário GitHub:**

```powershell
git remote add origin https://github.com/seu-usuario/api-filmes.git
```

**Exemplo real:**
```powershell
git remote add origin https://github.com/joaosilva/api-filmes.git
```

### 4.2 Renomear branch para "main"
```powershell
git branch -M main
```

---

## ✅ Passo 5: Enviar para GitHub

### 5.1 Push (enviar) para o GitHub
```powershell
git push -u origin main
```

**Primeira vez**: Será pedido para autenticar. Você pode:
- ✅ **Usar Personal Access Token** (recomendado)
- ✅ **Usar GitHub CLI** (mais fácil)
- ⚠️ **Usar senha** (não recomendado - deprecado)

---

## 🔐 Autenticação (Escolha UMA opção)

### Opção 1: Personal Access Token (Recomendado)

1. Acesse [github.com/settings/tokens](https://github.com/settings/tokens)
2. Clique em **"Generate new token"** → **"Generate new token (classic)"**
3. Configure:
   - **Note**: `api-filmes-push`
   - **Expiration**: 90 days (ou seu preferido)
   - **Scopes**: Marque ✅ `repo` (acesso completo aos repositórios)
4. Clique em **"Generate token"**
5. **Copie o token** (aparece apenas uma vez!)
6. No PowerShell, quando pedir senha, **cole o token**

### Opção 2: GitHub CLI (Mais Fácil)

1. Baixe [cli.github.com](https://cli.github.com)
2. Instale e execute:
   ```powershell
   gh auth login
   ```
3. Siga as instruções (mais intuitivo)

### Opção 3: SSH (Avançado)

Se já tem SSH configurado, use:
```powershell
git remote remove origin
git remote add origin git@github.com:seu-usuario/api-filmes.git
git push -u origin main
```

---

## ✅ Passo 6: Verificar no GitHub

1. Acesse [github.com/seu-usuario/api-filmes](https://github.com/seu-usuario/api-filmes)
2. Verifique se todos os arquivos aparecem:
   ```
   ✅ src/
   ✅ tests/
   ✅ migrations/
   ✅ README.md
   ✅ package.json
   ✅ .gitignore
   ✅ .env.example
   ```

---

## 📝 Comandos Úteis Depois

### Verificar status
```powershell
git status
```

### Fazer novo commit (depois de mudanças)
```powershell
git add .
git commit -m "Descrição do que mudou"
git push
```

### Ver histórico de commits
```powershell
git log --oneline
```

### Ver qual repositório está conectado
```powershell
git remote -v
```

---

## 🚀 Próximos Passos (Opcional)

### Adicionar Badge ao README.md

Você pode adicionar uma badge mostrando que o projeto está no GitHub:

```markdown
[![GitHub](https://img.shields.io/badge/GitHub-api--filmes-blue?logo=github)](https://github.com/seu-usuario/api-filmes)
```

### Criar Actions para CI/CD

Adicione testes automáticos no GitHub:

1. Crie pasta: `.github/workflows/`
2. Arquivo: `test.yml`
3. Conteúdo:
   ```yaml
   name: Tests
   on: [push, pull_request]
   jobs:
     test:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v3
         - uses: actions/setup-node@v3
           with:
             node-version: '18'
         - run: npm install
         - run: npm test
   ```

---

## ❌ Erros Comuns e Soluções

### Erro: "fatal: not a git repository"
```powershell
git init
git add .
git commit -m "Initial commit"
```

### Erro: "remote origin already exists"
```powershell
git remote remove origin
git remote add origin https://github.com/seu-usuario/api-filmes.git
```

### Erro: "fatal: unable to access... 401 Unauthorized"
- Verifique credenciais (token/senha correta)
- Crie novo Personal Access Token
- Use `gh auth login` (GitHub CLI)

### Erro: "Permission denied (publickey)"
- Configure SSH ou use HTTPS (Opção 1)
- Teste: `ssh -T git@github.com`

---

## 📊 Estrutura Final no GitHub

Após o push, seu repositório terá:

```
api-filmes/
├── src/                    # Código fonte
├── tests/                  # Testes
├── migrations/             # Migrações do banco
├── README.md               # Documentação
├── APRESENTACAO.md         # Guia de apresentação
├── EXEMPLOS_REQUISICOES.md # Exemplos da API
├── DEPLOY.md               # Guias de deploy
├── GITHUB.md               # Este arquivo
├── package.json            # Dependências
├── .env.example            # Template de .env
├── .gitignore              # Arquivos ignorados
└── vitest.config.js        # Config dos testes
```

---

## ✅ Resumo (Comando Rápido)

Se seu projeto já tem `.git`, é só fazer:

```powershell
git remote add origin https://github.com/seu-usuario/api-filmes.git
git branch -M main
git push -u origin main
```

Se é primeira vez:

```powershell
git init
git add .
git commit -m "Commit inicial"
git remote add origin https://github.com/seu-usuario/api-filmes.git
git branch -M main
git push -u origin main
```

---

**Pronto! 🎉 Seu projeto está no GitHub!**

Para clonar em outro computador:
```powershell
git clone https://github.com/seu-usuario/api-filmes.git
cd api-filmes
npm install
npm run dev
```
