// ============================================================
// SCRIPT AUTOMÁTICO PARA FAZER DEPLOY NO GAS
// Copie e cole todo o conteúdo abaixo no Console (F12) do navegador
// ============================================================

// Código do CRM RMJ
const codigo = `// ============================================================
// CRM RMJ - Google Apps Script Backup v3.0 (Next.js Sync)
// ============================================================

const SHEET_EMPRESAS = 'Empresas';
const SHEET_SOCIOS   = 'Socios';
const SHEET_BANCOS   = 'DadosBancarios';

function doPost(e) {
  try {
    const requestData = JSON.parse(e.postData.contents);

    // Verifica se é o webhook de cadastro PJ
    if (requestData.tipo === "cadastro_pj") {
      const payload = requestData.dados;
      const empresa = payload.empresa;
      const socios = payload.socios;
      const bancario = payload.bancario;

      const ss = SpreadsheetApp.getActiveSpreadsheet();

      // 1. Salvar dados da Empresa
      const sheetEmp = getOrCreateSheet(ss, SHEET_EMPRESAS, [
        'CNPJ', 'Razão Social', 'Fantasia', 'Nº Funcionários',
        'Faturamento', 'Representante', 'CPF Representante',
        'E-mail', 'Telefone', 'CEP', 'Logradouro', 'Número',
        'Bairro', 'Cidade', 'UF', 'Possui Imóvel', 'Tipo Matrícula', 'Valor Imóvel', 'DataCadastro'
      ]);

      sheetEmp.appendRow([
        empresa.emp_cnpj,
        empresa.emp_razao,
        empresa.emp_fantasia || "",
        empresa.emp_funcionarios,
        empresa.emp_faturamento,
        empresa.emp_repr_nome,
        empresa.emp_repr_cpf,
        empresa.emp_email,
        empresa.emp_telefone,
        empresa.emp_cep,
        empresa.emp_logradouro,
        empresa.emp_numero,
        empresa.emp_bairro,
        empresa.emp_cidade,
        empresa.emp_uf,
        empresa.emp_imovel,
        empresa.emp_imovel_tipo || "Não possui",
        empresa.emp_imovel_valor || "",
        new Date().toISOString()
      ]);

      // 2. Salvar Dados Bancários
      if (bancario) {
        const sheetBanco = getOrCreateSheet(ss, SHEET_BANCOS, [
          'CNPJ Empresa', 'Banco', 'Agência', 'Conta Corrente', 'DataCadastro'
        ]);
        sheetBanco.appendRow([
          empresa.emp_cnpj,
          bancario.banco_nome,
          bancario.banco_agencia,
          bancario.banco_conta,
          new Date().toISOString()
        ]);
      }

      // 3. Salvar Sócios e Cônjuges
      if (socios && Array.isArray(socios)) {
        const sheetSocios = getOrCreateSheet(ss, SHEET_SOCIOS, [
          'CNPJ Empresa', 'Nome Sócio', 'CPF Sócio', 'RG Sócio', 'Emissão RG Sócio',
          'Nascimento', 'Participação %', 'Estado Civil', 'Regime',
          'E-mail Sócio', 'Telefone Sócio', 'Renda Sócio', 'CEP Sócio',
          'Endereço Sócio', 'Bens Sócio (Imóvel)', 'Valor Bens Sócio', 'Veículos Sócio',
          'Nome Cônjuge', 'CPF Cônjuge', 'RG Cônjuge', 'Emissão RG Cônjuge',
          'Nascimento Cônjuge', 'E-mail Cônjuge', 'Telefone Cônjuge',
          'Incluir Renda Cônjuge', 'Renda Cônjuge', 'DataCadastro'
        ]);

        socios.forEach(socio => {
          const d = socio.dados;
          const c = socio.conjuge;

          sheetSocios.appendRow([
            empresa.emp_cnpj,
            d.nome,
            d.cpf,
            d.rg || "",
            d.rg_data_emissao || "",
            d.nascimento || "",
            d.participacao || "",
            d.estado_civil || "",
            d.regime || "",
            d.email || "",
            d.telefone || "",
            d.renda || "",
            d.cep || "",
            (d.logradouro || "") + ", " + (d.numero || ""),
            d.imovel_tipo || "",
            d.imovel_valor || "",
            d.veiculo_placas || "",
            c ? c.nome : "",
            c ? c.cpf : "",
            c ? c.rg : "",
            c ? c.rg_data_emissao : "",
            c ? c.nascimento : "",
            c ? c.email : "",
            c ? c.telefone : "",
            c ? c.incluir_renda : "",
            c ? (c.renda || "") : "",
            new Date().toISOString()
          ]);
        });
      }

      return ContentService.createTextOutput(JSON.stringify({ success: true }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    return ContentService.createTextOutput(JSON.stringify({ success: false, error: "Tipo de requisição inválido" }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch(e) {
    return ContentService.createTextOutput(JSON.stringify({ success: false, error: e.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function getOrCreateSheet(ss, name, headers) {
  let sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
    sheet.appendRow(headers);
    sheet.getRange(1, 1, 1, headers.length)
      .setFontWeight('bold')
      .setBackground('#21446a')
      .setFontColor('#ffffff');
    sheet.setFrozenRows(1);
  }
  return sheet;
}`;

// Função para fazer todo o processo
async function deployCRM() {
  console.log('🚀 Iniciando deploy do CRM RMJ...');

  // Passo 1: Encontrar o editor e limpar
  console.log('📝 Passo 1: Preparando editor...');
  const editor = document.querySelector('[role="textbox"]');
  if (editor) {
    editor.click();
    await new Promise(r => setTimeout(r, 500));
    // Selecionar tudo
    editor.dispatchEvent(new KeyboardEvent('keydown', { key: 'a', ctrlKey: true }));
    await new Promise(r => setTimeout(r, 200));
  }

  // Passo 2: Colar o código
  console.log('💾 Passo 2: Adicionando código...');
  // Simular paste do código
  if (editor) {
    editor.textContent = codigo;
    editor.innerText = codigo;
    // Disparar evento de mudança
    editor.dispatchEvent(new Event('input', { bubbles: true }));
    editor.dispatchEvent(new Event('change', { bubbles: true }));
  }

  await new Promise(r => setTimeout(r, 1000));

  // Passo 3: Salvar (Ctrl+S)
  console.log('💾 Passo 3: Salvando projeto...');
  document.dispatchEvent(new KeyboardEvent('keydown', { key: 's', ctrlKey: true }));

  await new Promise(r => setTimeout(r, 2000));

  // Passo 4: Fazer deploy
  console.log('🚀 Passo 4: Iniciando deployment...');
  const deployBtn = Array.from(document.querySelectorAll('button')).find(b =>
    b.textContent.includes('Implantar') || b.textContent.includes('Deploy')
  );

  if (deployBtn) {
    deployBtn.click();
    console.log('✅ Clique no botão de deploy realizado!');
    console.log('⏳ Aguarde a janela de configuração aparecer...');
    console.log('📋 Próximas etapas:');
    console.log('   1. Selecione "App da Web"');
    console.log('   2. Mude "Quem pode acessar" para "Qualquer pessoa"');
    console.log('   3. Clique em "Implantar"');
    console.log('   4. Copie a URL gerada');
    console.log('   5. Adicione ao .env.local como: GAS_WEB_APP_URL=<URL>');
  } else {
    console.error('❌ Botão de deploy não encontrado!');
  }
}

// Executar
console.log('═══════════════════════════════════════════════════');
console.log('   DEPLOY AUTOMÁTICO - CRM RMJ');
console.log('═══════════════════════════════════════════════════');
console.log('');
deployCRM().catch(e => console.error('Erro:', e));
