# CRM RMJ - Instruções de Deploy no Netlify

## 📋 Resumo Executivo
Este documento fornece instruções para fazer o deploy de um projeto Next.js 16 (App Router) para o Netlify com integração Google Sheets.

## 🎯 O que será feito
1. Inicializar repositório Git local
2. Criar repositório privado no GitHub (opcional, requer GitHub CLI)
3. Criar e configurar site no Netlify
4. Configurar 4 variáveis de ambiente (Google Sheets + Admin)
5. Deploy em produção na Netlify

## 📁 Localização do Projeto
```
C:\Users\RODRIGO\Desktop\CRM - MVP\crm-rmj
```

## 🚀 Como Usar

### Método 1: Automático (Recomendado)
1. Abra o Explorador de Arquivos
2. Navegue até a pasta do projeto
3. Clique 2 vezes em `deploy-final.bat`
4. Siga as instruções na tela

### Método 2: Manual via PowerShell
```powershell
cd "C:\Users\RODRIGO\Desktop\CRM - MVP\crm-rmj"
powershell.exe -ExecutionPolicy Bypass -File "deploy-final.ps1"
```

## 📝 Pré-requisitos
- ✅ Git instalado
- ✅ Node.js / npm instalado
- ✅ Conta Netlify (acesso via navegador)
- ⚠️ GitHub CLI (opcional, para criar repositório automaticamente)
- ⚠️ Google Sheets API configurada com credenciais

## 🔐 Variáveis de Ambiente Configuradas
```
GOOGLE_SHEETS_ID = "1D8kQJSUp5UwlUsc-9-P9Nj-rft0BADbGeBg0aHPjT-8"
GOOGLE_SERVICE_ACCOUNT_EMAIL = "rmj-admin-sheets@spartan-metric-499115-a3.iam.gserviceaccount.com"
GOOGLE_PRIVATE_KEY = [Chave privada de autenticação]
ADMIN_PASSWORD = "rmjadmin2024"
```

## 📦 Estrutura do Projeto
```
crm-rmj/
├── .git/                    # Repositório Git (será criado)
├── .netlify/                # Configuração Netlify (será criado)
├── .gitignore               # Ignora .env.local
├── netlify.toml             # Configuração build Netlify
├── package.json             # Dependencies (Next.js, @netlify/plugin-nextjs)
├── src/
│   └── app/
│       ├── page.tsx
│       ├── cadastro/bdmg/   # Formulário BDMG
│       └── admin/propostas/ # Painel Kanban
├── .env.local               # (NÃO será commitado)
├── deploy-final.bat         # Script automático
└── deploy-final.ps1         # Script PowerShell
```

## 🔄 Fluxo de Execução

### PASSO 1: Git
```bash
git config user.email "rodrigomeirelles@gmail.com"
git config user.name "Rodrigo Meirelles"
git init
git add .
git commit -m "feat: CRM RMJ MVP inicial — formulário BDMG + admin Kanban"
```

### PASSO 2: GitHub (Opcional)
```bash
gh repo create crm-rmj --private --source=. --push
```
⚠️ Requer: GitHub CLI instalado e autenticado

### PASSO 3: Netlify Init
```bash
npx netlify-cli init
```
Selecionar: "Create & configure a new site"
Nome do site: `crm-rmj` (ou `crm-rmj-mvp`)

### PASSO 4: Variáveis de Ambiente
```bash
npx netlify-cli env:set GOOGLE_SHEETS_ID "..."
npx netlify-cli env:set GOOGLE_SERVICE_ACCOUNT_EMAIL "..."
npx netlify-cli env:set GOOGLE_PRIVATE_KEY "..."
npx netlify-cli env:set ADMIN_PASSWORD "..."
```

### PASSO 5: Deploy
```bash
npx netlify-cli deploy --build --prod
```
⏱️ Tempo estimado: 10-15 minutos (build do Next.js)

## ✅ Verificação Pós-Deploy

Após o deploy, acesse as seguintes URLs:

1. **Formulário BDMG**
   ```
   https://[seu-site].netlify.app/cadastro/bdmg
   ```

2. **Painel Kanban (Admin)**
   ```
   https://[seu-site].netlify.app/admin/propostas
   ```

3. **API de Dados**
   ```
   https://[seu-site].netlify.app/api/propostas
   ```

4. **Planilha Google Sheets**
   - Confirme se existe aba "Propostas" (com P maiúsculo)
   - URL: https://docs.google.com/spreadsheets/d/1D8kQJSUp5UwlUsc-9-P9Nj-rft0BADbGeBg0aHPjT-8

## 🐛 Troubleshooting

### Erro: "gh" não é reconhecido
**Solução:** GitHub CLI não está instalado. 
- Instale em: https://cli.github.com/
- Ou pule este passo e crie repositório manualmente depois

### Erro: Git config user.email
**Solução:** Configurar Git globalmente:
```bash
git config --global user.email "seu@email.com"
git config --global user.name "Seu Nome"
```

### Erro: Netlify build falha
**Verificar:**
1. Arquivo `netlify.toml` existe?
2. Plugin `@netlify/plugin-nextjs` está em `package.json`?
3. Variáveis de ambiente estão corretas no Netlify?

## 📞 Contato / Mais Informações
- Netlify Docs: https://docs.netlify.com/
- Next.js Docs: https://nextjs.org/docs
- GitHub CLI: https://cli.github.com/

---
**Última atualização:** 24/06/2026
**Status:** Deploy pronto para produção
