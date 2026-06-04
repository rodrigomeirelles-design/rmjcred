# 🔧 Correções na Integração Frontend ↔ Google Apps Script

## 📋 Resumo dos Problemas Identificados

Você tinha **3 falhas principais** na integração entre o formulário de cadastro e o Google Sheets via Google Apps Script:

---

## ❌ **Problema 1: Observações Não Eram Salvas**

### O que estava acontecendo:
- O frontend enviava `observacoes` (notas finais do cadastro)
- O script GAS **ignorava** este campo completamente
- Resultado: dados perdidos

### Onde estava o bug:
**Frontend** (`page.tsx` linha 476-481):
```typescript
body: JSON.stringify({
  empresa,
  socios,
  bancario,
  observacoes,  // ← ENVIAVA AQUI
}),
```

**Backend GAS** (`gas-script.js` linha 15):
```javascript
const { empresa, socios, bancario } = requestData.dados;
// observacoes eram IGNORADAS ❌
```

### ✅ Solução Implementada:
Atualizei `gas-script.js` para:
1. Adicionar coluna "Observacoes" na planilha "DadosBancarios"
2. Capturar e salvar o campo `obs_finais` das observações

```javascript
// ANTES (linhas 52-65):
const sheetBanco = getOrCreateSheet(ss, SHEET_BANCOS, [
  'CNPJ Empresa', 'Banco', 'Agência', 'Conta Corrente', 'DataCadastro'
]);

// DEPOIS:
const sheetBanco = getOrCreateSheet(ss, SHEET_BANCOS, [
  'CNPJ Empresa', 'Banco', 'Agência', 'Conta Corrente', 'Observacoes', 'DataCadastro'
]);
sheetBanco.appendRow([
  // ... outros campos ...
  requestData.dados.observacoes ? requestData.dados.observacoes.obs_finais : "",
  new Date().toISOString()
]);
```

---

## ❌ **Problema 2: Dados do Cônjuge Incompletos**

### O que estava acontecendo:
- RG e Data de Emissão do cônjuge **não eram capturados** no GAS
- Endereço do cônjuge **não existia** nas colunas
- Campos opcionais de profissão e nacionalidade do sócio **não eram salvos**

### Onde estava o bug:
**GAS script** (`gas-script.js` linhas 69-81):
- Apenas 31 colunas mapeadas
- Faltavam campos cruciais: RG cônjuge, endereço completo, profissão

### ✅ Solução Implementada:
Expandir a planilha "Socios" de **31 para 41 colunas**:

**Novos campos adicionados:**
```
// Sócio:
+ 'Profissão Sócio'
+ 'Nacionalidade Sócio'
+ 'Complemento Sócio'
+ 'Bairro Sócio'
+ 'Cidade Sócio'
+ 'UF Sócio'

// Cônjuge:
+ 'RG Cônjuge' (agora capturado corretamente)
+ 'Emissão RG Cônjuge' (agora capturado corretamente)
+ 'CEP Cônjuge'
+ 'Logradouro Cônjuge'
+ 'Número Cônjuge'
+ 'Bairro Cônjuge'
+ 'Cidade Cônjuge'
+ 'UF Cônjuge'
+ 'Imóvel Cônjuge'
+ 'Valor Imóvel Cônjuge'
+ 'Veículos Cônjuge'
```

---

## ❌ **Problema 3: Falta de Validação de Resposta do GAS**

### O que estava acontecendo:
- A API enviava dados para GAS mas **não validava se foi bem-sucedido**
- Se GAS retornava erro, o usuário **não sabia**
- Sem feedback, impossível diagnosticar problemas

### Onde estava o bug:
**API Route** (`src/app/api/cadastro/bdmg/route.ts` linhas 90-105):
```typescript
// ANTES - Sem tratamento de resposta:
await fetch(gasUrl, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    tipo: "cadastro_pj",
    dados: payload,
  }),
}).catch(err => console.error(err));
// ❌ Não lê a resposta!
```

### ✅ Solução Implementada:
Adicionar validação e logging da resposta GAS:

```typescript
// DEPOIS - Com tratamento de resposta:
const gasResponse = await fetch(gasUrl, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    tipo: "cadastro_pj",
    dados: payload,
  }),
});

const gasData = await gasResponse.json();
if (!gasData.success) {
  console.warn("GAS retornou erro:", gasData);
} else {
  console.log("Dados salvos com sucesso no Google Sheets (GAS)");
}
```

---

## 🚀 **Próximos Passos - IMPORTANTE**

### 1️⃣ Deploy do Google Apps Script Atualizado

O arquivo `gas-script.js` foi **modificado com 41 campos**. Você precisa fazer o deploy atualizado:

**Instruções detalhadas em**: `C:\Users\RODRIGO\rmjcred\DEPLOYMENT_INSTRUCTIONS.md`

**Resumo rápido:**
1. Abra: https://script.google.com/home/projects/1hZQFhkrZfkqM0caogfhSzY88IehWcjr7042MsAMGCSCyu4jZQH0dCwKF/edit
2. Copie todo o conteúdo de `C:\Users\RODRIGO\rmjcred\gas-script.js`
3. Cola no editor (substitua tudo)
4. Clique "Salvar" (Ctrl+S)
5. Clique "Implantar" → "Nova implantação"
6. Tipo: "App da Web" | Executar como: "Você" | Quem pode acessar: "Qualquer pessoa"
7. Copie a URL e atualize `.env.local` se necessário

### 2️⃣ Testando a Integração

Após fazer deploy do GAS, teste completando um cadastro:

1. Abra `http://localhost:3000/cadastro/bdmg` (ou sua URL)
2. Preencha um cadastro completo com cônjuge
3. Submeta o formulário
4. Verifique no Google Sheets se:
   - ✅ Planilha "Empresas" tem os dados
   - ✅ Planilha "Socios" tem **todos os 41 campos** preenchidos
   - ✅ Planilha "DadosBancarios" tem as "Observações"

### 3️⃣ Verificar Logs de Erro

Se houver problemas:

1. **Console do Next.js** (terminal onde você rodou `npm run dev`):
   - Procure por `"Dados salvos com sucesso no Google Sheets (GAS)"`
   - Se ver warning: `"GAS retornou erro"`, aí há problema no script

2. **Google Apps Script Logs**:
   - Acesse: https://script.google.com/home/projects/1hZQFhkrZfkqM0caogfhSzY88IehWcjr7042MsAMGCSCyu4jZQH0dCwKF/edit
   - Menu: "Execução" → vê logs de execução

---

## 📊 **Arquivos Modificados**

| Arquivo | Mudança | Linhas |
|---------|---------|--------|
| `gas-script.js` | Adicionou campos de cônjuge e observações | 52-65, 67-133 |
| `src/app/api/cadastro/bdmg/route.ts` | Validação de resposta GAS | 90-106 |
| `CORRECOES_INTEGRACAO_GAS.md` | Este arquivo (novo) | — |

---

## ✅ **Checklist para Confirmar Sucesso**

- [ ] Deploy do GAS atualizado feito
- [ ] `.env.local` tem `GAS_WEB_APP_URL` correto
- [ ] Teste de cadastro completo executado
- [ ] Dados aparecem corretamente no Google Sheets
- [ ] Logs mostram "sucesso" na integração
- [ ] Campos do cônjuge aparecem na planilha "Socios"
- [ ] Observações aparecem na planilha "DadosBancarios"

---

## 🔗 **Recursos Úteis**

- **Google Apps Script Console**: https://script.google.com/home
- **Seu projeto GAS**: https://script.google.com/home/projects/1hZQFhkrZfkqM0caogfhSzY88IehWcjr7042MsAMGCSCyu4jZQH0dCwKF/edit
- **Documentação GAS**: https://developers.google.com/apps-script/overview
