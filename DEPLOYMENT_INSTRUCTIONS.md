# Instruções de Deploy - Google Apps Script CRM RMJ

## Projeto Criado
- **Nome**: CRM RMJ Sync
- **ID**: 1hZQFhkrZfkqM0caogfhSzY88IehWcjr7042MsAMGCSCyu4jZQH0dCwKF
- **URL**: https://script.google.com/home/projects/1hZQFhkrZfkqM0caogfhSzY88IehWcjr7042MsAMGCSCyu4jZQH0dCwKF/edit

## Passo 1: Adicionar o Código Correto

1. Abra o link acima (URL do projeto)
2. Clique no arquivo "Código.gs" no painel esquerdo
3. Selecione todo o conteúdo (Ctrl+A)
4. Cole o conteúdo do arquivo: `C:\Users\RODRIGO\rmjcred\gas-script.js`
5. Clique em "Salvar projeto no Drive" ou pressione Ctrl+S

## Passo 2: Fazer o Deploy como Web App

1. Clique no botão **"Implantar"** (azul, canto superior direito)
2. Selecione **"Nova implantação"**
3. Uma janela irá abrir:
   - **Tipo**: Selecione "App da Web"
   - **Executar como**: "Eu (seu email)"
   - **Quem pode acessar**: Mude para **"Qualquer pessoa"**
4. Clique em **"Implantar"**

## Passo 3: Copiar a URL do Web App

Após o deploy, você verá uma caixa com:
- **ID da implantação**: (copie para referência)
- **URL de execução do Web App**: Começa com `https://script.google.com/macros/s/.../exec`

Copie a URL completa.

## Passo 4: Atualizar o Arquivo .env.local

1. Abra ou crie o arquivo: `C:\Users\RODRIGO\rmjcred\.env.local`
2. Adicione ou atualize:
```
GAS_WEB_APP_URL=<URL_COPIADA_NO_PASSO_3>
```

Exemplo:
```
GAS_WEB_APP_URL=https://script.google.com/macros/s/AKfycbxxxxxxxxxxxxxyyyyyyyyy/exec
```

## Passo 5: Testar a Comunicação

Abra o Terminal e execute:

```bash
curl -X POST "https://script.google.com/macros/s/YOUR_URL_HERE/exec" \
  -H "Content-Type: application/json" \
  -d '{
    "tipo": "cadastro_pj",
    "dados": {
      "empresa": {
        "emp_cnpj": "12345678000190",
        "emp_razao": "Empresa Teste",
        "emp_funcionarios": "10",
        "emp_faturamento": "100000",
        "emp_repr_nome": "João Silva",
        "emp_repr_cpf": "12345678900",
        "emp_email": "teste@empresa.com",
        "emp_telefone": "1133334444",
        "emp_cep": "01234567",
        "emp_logradouro": "Rua Teste",
        "emp_numero": "123",
        "emp_bairro": "Centro",
        "emp_cidade": "São Paulo",
        "emp_uf": "SP",
        "emp_imovel": "Sim"
      },
      "socios": [],
      "bancario": null
    }
  }'
```

Deve retornar: `{"success":true}`

## Arquivo de Código (gas-script.js)

O arquivo está em: `C:\Users\RODRIGO\rmjcred\gas-script.js`

## Suporte

Se encontrar problemas:
1. Verifique se o projeto foi criado corretamente
2. Confirme que o código está completo no editor
3. Assegure-se de que "Quem pode acessar" está como "Qualquer pessoa"
4. Teste a URL com curl conforme acima
