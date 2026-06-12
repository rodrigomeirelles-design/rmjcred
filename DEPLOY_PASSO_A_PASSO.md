# 🚀 Deploy do Google Apps Script - Passo a Passo

## Método 1: Automático (Recomendado)

### Passo 1: Abrir o Projeto GAS
1. Abra este link no seu navegador:
   ```
   https://script.google.com/home/projects/1hZQFhkrZfkqM0caogfhSzY88IehWcjr7042MsAMGCSCyu4jZQH0dCwKF/edit
   ```

### Passo 2: Abrir o Console do Navegador
1. Pressione **F12** (ou Ctrl+Shift+I)
2. Clique na aba **"Console"** (geralmente é a última aba)

### Passo 3: Executar o Script de Auto-Deploy
1. Na pasta do seu projeto, abra o arquivo: `SCRIPT_AUTO_DEPLOY.js`
2. **Copie TODO o conteúdo** (Ctrl+A → Ctrl+C)
3. Volte ao **Console do navegador** (F12)
4. **Cole o código** no console (Ctrl+V)
5. Pressione **ENTER**

O script vai:
- ✅ Atualizar o código automaticamente
- ✅ Salvar o projeto
- ✅ Abrir a janela de deploy

### Passo 4: Configurar o Deployment (Manual)
Após executar o script, uma janela deve aparecer com "New deployment". Configure:

1. **Type / Tipo**: Selecione **"Web app"** ou **"App da Web"**
2. **Execute as / Executar como**: Deixe como está (seu email)
3. **Who has access / Quem pode acessar**: 
   - ⚠️ **IMPORTANTE**: Mude para **"Anyone"** ou **"Qualquer pessoa"**
4. Clique em **"Deploy"** ou **"Implantar"**

### Passo 5: Copiar a URL
1. Após o deploy, você verá uma caixa com:
   - **Deployment ID**
   - **Web app URL**: Começa com `https://script.google.com/macros/s/...`
2. **Copie a URL completa**

### Passo 6: Atualizar o .env.local
1. Abra ou crie o arquivo: `.env.local` na raiz do projeto
2. Atualize/adicione:
   ```
   GAS_WEB_APP_URL=https://script.google.com/macros/s/[URL_QUE_VOCE_COPIOU]/exec
   ```

Exemplo:
```
GAS_WEB_APP_URL=https://script.google.com/macros/s/AKfycbyXHiHxY0Llcm5K131Ns-aZvqHC-fW8pra3c7mEYNuomkCiejm62Fy6nGVr4Yn4s2jG6Q/exec
```

---

## Método 2: Manual (Se o automático não funcionar)

### Passo 1: Abrir o Projeto
1. Abra: https://script.google.com/home/projects/1hZQFhkrZfkqM0caogfhSzY88IehWcjr7042MsAMGCSCyu4jZQH0dCwKF/edit

### Passo 2: Limpar o Código Existente
1. Você verá um arquivo chamado "Código.gs" ou similar no painel esquerdo
2. Clique nele
3. Selecione **TODO o código** (Ctrl+A)
4. Delete o conteúdo (pressione Delete ou Backspace)

### Passo 3: Colar o Novo Código
1. Abra o arquivo `gas-script.js` da sua pasta do projeto
2. **Copie TODO o conteúdo** (Ctrl+A → Ctrl+C)
3. No editor do GAS, **cole** (Ctrl+V)
4. Pressione **Ctrl+S** para salvar

### Passo 4: Fazer o Deploy
1. No canto superior direito, você verá um botão azul **"Implantar"** ou **"Deploy"**
2. Clique nele
3. Selecione **"Nova implantação"** ou **"New deployment"**

### Passo 5: Configurar o Deployment
Uma janela vai aparecer com estas opções:

```
┌─────────────────────────────────┐
│ New Deployment / Nova Implantação│
├─────────────────────────────────┤
│                                  │
│ Type / Tipo:                    │
│ [▼ Web app / App da Web]        │
│                                  │
│ Execute as / Executar como:     │
│ [seu_email@gmail.com]           │
│                                  │
│ Who has access:                 │
│ [▼ Specific people → Qualquer p]│ ← MUDE ISSO
│                                  │
│ [  Cancel  ] [  Deploy  ]       │
└─────────────────────────────────┘
```

**⚠️ IMPORTANTE**: Na opção "Who has access", mude para **"Anyone"** ou **"Qualquer pessoa"**

### Passo 6: Clicar em Implantar
1. Após configurar, clique em **"Implantar"** ou **"Deploy"**
2. Aguarde a conclusão (pode levar alguns segundos)

### Passo 7: Copiar a URL
Após o deploy bem-sucedido, você verá:
```
✓ Deployment successful
Web app URL: https://script.google.com/macros/s/AKfycbzR6m.../exec
Deployment ID: AKfycbzR6m...
```

**Copie a URL completa**

### Passo 8: Adicionar ao .env.local
1. Abra/crie `.env.local` na raiz do projeto
2. Adicione:
   ```
   GAS_WEB_APP_URL=https://script.google.com/macros/s/[URL_COPIADA]/exec
   ```

---

## ✅ Verificar se o Deploy Funcionou

Após fazer o deploy, abra o terminal e teste:

```bash
curl -X POST "https://script.google.com/macros/s/[sua-url-aqui]/exec" \
  -H "Content-Type: application/json" \
  -d '{"tipo":"cadastro_pj","dados":{"empresa":{"emp_cnpj":"12345678000190","emp_razao":"Teste"},"socios":[],"bancario":null}}'
```

Deve retornar:
```
{"success":true}
```

---

## 🆘 Se Algo Der Errado

### Erro: "Tipo de requisição inválido"
- Significa que o `tipo` não é "cadastro_pj"
- Verifique o JSON enviado

### Erro: "Access Denied"
- Você não configurou "Qualquer pessoa" pode acessar
- Volte e refaça o deploy com a permissão correta

### Não consigo achar o botão "Implantar"
- Certifique-se que você está no editor de código (aba "Código.gs" selecionada)
- O botão azul deve estar no canto superior direito
- Procure por "Implantar", "Deploy", ou o ícone de nuvem

### O script automático não funcionou
- Use o **Método 2 (Manual)** acima
- Às vezes o DOM do Google Apps Script é diferente

---

## 📝 Checklist Final

- [ ] Abrir projeto GAS no navegador
- [ ] Executar SCRIPT_AUTO_DEPLOY.js (ou fazer manual)
- [ ] Configurar tipo: "Web app"
- [ ] Configurar acesso: "Qualquer pessoa"
- [ ] Fazer deploy
- [ ] Copiar URL
- [ ] Atualizar .env.local
- [ ] Testar com curl (opcional)
- [ ] Pronto para testar cadastro! ✅

---

## 🎯 Próximo Passo

Após o deploy estar funcionando, você pode:
1. Fazer um cadastro de teste no formulário
2. Verificar se os dados aparecem no Google Sheets
3. Confirmar que todas as 3 abas (Empresas, Sócios, DadosBancarios) estão preenchidas

**Boa sorte! 🚀**
