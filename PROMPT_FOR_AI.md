# Prompt para IA Fazer Deploy do CRM RMJ

Use este prompt com qualquer IA (Claude, ChatGPT, etc.) para automatizar o deploy:

---

## 📝 PROMPT PARA IA

```
Faça o deploy de um projeto Next.js 16 para o Netlify com as seguintes especificações:

PROJETO:
- Nome: CRM RMJ MVP
- Localização: C:\Users\RODRIGO\Desktop\CRM - MVP\crm-rmj
- Framework: Next.js 16 (App Router)
- Plugin: @netlify/plugin-nextjs (já configurado em package.json)
- Arquivo de config: netlify.toml (já existe)
- Email: rodrigomeirelles@gmail.com

TAREFAS EM ORDEM:

1. INICIALIZAR GIT
   - Configure Git user: rodrigomeirelles@gmail.com / "Rodrigo Meirelles"
   - Execute: git init
   - Execute: git add .
   - Faça commit: "feat: CRM RMJ MVP inicial — formulário BDMG + admin Kanban"
   - Verifique se .env.local está no .gitignore (deve estar)

2. CRIAR REPOSITÓRIO NO GITHUB (opcional, requer GitHub CLI)
   - Se GitHub CLI estiver instalado: gh repo create crm-rmj --private --source=. --push
   - Se não estiver instalado, pule este passo

3. INICIALIZAR NETLIFY
   - Execute: npx netlify-cli init
   - Quando perguntado: selecione "Create & configure a new site"
   - Nome do site: crm-rmj (ou crm-rmj-mvp se já existir)
   - Quando perguntado sobre repositório: pode responder "Yes, create and deploy manually"

4. CONFIGURAR VARIÁVEIS DE AMBIENTE NO NETLIFY
   - Use: npx netlify-cli env:set [NOME] [VALOR]
   - Configure as 4 variáveis abaixo:
   
   GOOGLE_SHEETS_ID:
   "1D8kQJSUp5UwlUsc-9-P9Nj-rft0BADbGeBg0aHPjT-8"
   
   GOOGLE_SERVICE_ACCOUNT_EMAIL:
   "rmj-admin-sheets@spartan-metric-499115-a3.iam.gserviceaccount.com"
   
   GOOGLE_PRIVATE_KEY:
   "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQDh/l9ol3zKmnCo\n2L4anGc5jJ+959mYKZfSzkSwfAe5re9KVGA5vRQ3NdCV+prmVVCYE60Bk9zysmVA\nDUmXMVF6OcLcfDUoUAJFCeXqPgZ2/HFlF+uQx0BFYznB8OJnb0x5P8VteJJgISHZ\nxI6Ls9Wy3kXcxD1PEkpdnSS8bTBSmQkrQSVtVDz50eDkiy4mLiKcuq5Ox4hoQHs3\nRSqxgaftyVnTr7clZoi0e7TmgtImuJbV9CrruKc4bCafjrjZ5G73i9INpFZZzN+6\nbOcI8ZbwShsPPQXQoN12kYUG9tmfFR+AyLw26EG+wL+C21At6oqtairjjYGJR4cq\nZVHM/2/dAgMBAAECggEAAmJi7SFOJXwDtUW/qojbBOPM9PJolwlc1VJGrgPCZTlR\n4yL1/juaQKzd8KiOW8KkBeRf9P43OsILm3wCwddmRrIc5u5wbblsfh5FWewPEznF\nIzV4BAt2l2TSDMwJusKkStIivrj1jXOO3EDCT+VPcfc59/9HkE/qWqXYK4ZJ28ly\n4XSWYOW9DJBthhgX1+OGwBfutCM8E7jPA0VEzCnpwu9kxAvBS5dIfXh1B6pCK8qr\nG2pU7yEo/ifIjRwtn9XZwVAM/zCK/BjXiKaeVXdBky+XBCHI/kT8dk8G/bXicnrm\nF2HRzFDt4VqZJLnPc/9upGBqpxaLUP4vsyeZ/SGCNwKBgQD/y4iqqK3jX43vQvTU\norHl3aceYrCysTZn/TrY8AP4OLanJDz6davTCeJQf/FNRJWvZRofXAQMQFq+aMSh\nn0BzuPLpbs8fKnBsC5T5ENvqzIRwMe9E2IsBB26hqTityO1MsBVaMd7MPTpIqAX7\nh/1dTYE56xilOmsZy+P8MunA0wKBgQDiLLnsi/Wn58vB1Ey6PYlDlYquRFacbkkl\nohrCTS3UPj6Sym92s9ljSrRX6KUdi7NvAVVyFsPcF0MS1i4v1Y1c+3AOgMCdDvP2\nd8jU4ZjoZs/W8GPpN9FsGSsCdGJvQnm35sNYbifdqB1RFwwaiXBHJ8knsDKL61dl\nTfNZJFwejwKBgGDUwqqf6hudq5Q8S4RHBoMW0lGtWGh8rzTUZreCvG31wicpj6/c\nZawhHLwOguEWKnfYFPh0E9AzeGaGMJFiQLrN856sZNnObfpos/9JA4cx3py+Om5c\nbtp33shxz9PxsOsL6TlYkZfNQcgJWyJpy17LnTS4q364y5xbU7W/7D8jAoGAFyyU\nBEu26PRUKVESZ4bEmLsq0X5JDZAzSHramQwFZRjXmnzJfPUikgzme5dny6YzxWzy\nj1ULznJHuhdd9iLAcEWHDsVcdvtAPgG5/y36V92o8BIDerLwb04I3SCFsXazOAeZ\n/maTCSAfmN5urA1nBrNp5fokw7diZgvdokWadrsCgYBF38JDbrxw6UHjVBs8OaXX\nL01QZRxybURrZZDJPtHUYOs4HnslLI+hCNQ1bWqgZ7t0zw0YRztCXPCMCiJA7TEi\nXOgtopsJh1D0vmuRJWLZdtOHZHIllHHsGhRob+EepnmqxagIHfdl/Qkwmn1m2bjy\nqKt2N2zsTBnBOL3QejfA3A==\n-----END PRIVATE KEY-----"
   
   ADMIN_PASSWORD:
   "rmjadmin2024"

5. FAZER DEPLOY EM PRODUÇÃO
   - Execute: npx netlify-cli deploy --build --prod
   - Aguarde o build completar (10-15 minutos)
   - Anote a URL gerada (será algo como: https://crm-rmj.netlify.app)

VERIFICAÇÃO FINAL:
- Acesse: https://[url-do-site]/cadastro/bdmg (deve carregar formulário)
- Acesse: https://[url-do-site]/admin/propostas (deve carregar painel)
- Acesse: https://[url-do-site]/api/propostas (deve retornar JSON)
- Confirme aba "Propostas" em: https://docs.google.com/spreadsheets/d/1D8kQJSUp5UwlUsc-9-P9Nj-rft0BADbGeBg0aHPjT-8

RELATÓRIO FINAL:
- Mostre a URL pública do site
- Confirme se as 3 rotas funcionaram
- Liste os erros (se houver) e como foram resolvidos
```

---

## 🤖 Como Usar com IA

1. **Claude / ChatGPT**: Copie o prompt acima e cole diretamente
2. **Com acesso a arquivos**: Compartilhe a pasta do projeto
3. **Sem acesso de escrita**: A IA pode fornecer comandos para você executar manualmente

## 📌 Informações Críticas
- **Credenciais são sensíveis**: Não compartilhe com pessoas não autorizadas
- **Git será inicializado**: Todos os arquivos serão commitados (exceto .env.local)
- **Repositório será privado**: No GitHub (se criado)
- **Build leva tempo**: Espere 10-15 minutos no deploy

## ⚙️ Variáveis Hardcoded no Prompt
As seguintes informações estão embutidas no prompt (específicas para este projeto):
- Email: rodrigomeirelles@gmail.com
- Google Sheets ID: 1D8kQJSUp5UwlUsc-9-P9Nj-rft0BADbGeBg0aHPjT-8
- Google Service Account Email: rmj-admin-sheets@spartan-metric-499115-a3.iam.gserviceaccount.com
- Google Private Key: [Chave de autenticação]
- Admin Password: rmjadmin2024
- Netlify Site Name: crm-rmj

---
**Criado em:** 24/06/2026
**Pronto para usar com qualquer IA**
