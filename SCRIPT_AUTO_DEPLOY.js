// ============================================================
// SCRIPT AUTOMÁTICO PARA FAZER DEPLOY NO GAS
// Abra o projeto GAS no navegador, pressione F12, vá para Console,
// copie TODO este arquivo e cole no console. Depois aperte ENTER.
// ============================================================

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
          'CNPJ Empresa', 'Banco', 'Agência', 'Conta Corrente', 'Observacoes', 'DataCadastro'
        ]);
        sheetBanco.appendRow([
          empresa.emp_cnpj,
          bancario.banco_nome,
          bancario.banco_agencia,
          bancario.banco_conta,
          requestData.dados.observacoes ? requestData.dados.observacoes.obs_finais : "",
          new Date().toISOString()
        ]);
      }

      // 3. Salvar Sócios e Cônjuges
      if (socios && Array.isArray(socios)) {
        const sheetSocios = getOrCreateSheet(ss, SHEET_SOCIOS, [
          'CNPJ Empresa', 'Nome Sócio', 'CPF Sócio', 'RG Sócio', 'Emissão RG Sócio',
          'Nascimento', 'Participação %', 'Estado Civil', 'Regime',
          'Profissão Sócio', 'Nacionalidade Sócio',
          'E-mail Sócio', 'Telefone Sócio', 'Renda Sócio', 'CEP Sócio',
          'Logradouro Sócio', 'Número Sócio', 'Complemento Sócio', 'Bairro Sócio', 'Cidade Sócio', 'UF Sócio',
          'Bens Sócio (Imóvel)', 'Valor Bens Sócio', 'Veículos Sócio',
          'Nome Cônjuge', 'CPF Cônjuge', 'RG Cônjuge', 'Emissão RG Cônjuge',
          'Nascimento Cônjuge', 'E-mail Cônjuge', 'Telefone Cônjuge',
          'CEP Cônjuge', 'Logradouro Cônjuge', 'Número Cônjuge', 'Bairro Cônjuge', 'Cidade Cônjuge', 'UF Cônjuge',
          'Incluir Renda Cônjuge', 'Renda Cônjuge', 'Imóvel Cônjuge', 'Valor Imóvel Cônjuge', 'Veículos Cônjuge',
          'DataCadastro'
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
            d.profissao || "",
            d.nacionalidade || "",
            d.email || "",
            d.telefone || "",
            d.renda || "",
            d.cep || "",
            d.logradouro || "",
            d.numero || "",
            d.complemento || "",
            d.bairro || "",
            d.cidade || "",
            d.uf || "",
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
            c ? c.cep : "",
            c ? c.logradouro : "",
            c ? c.numero : "",
            c ? c.bairro : "",
            c ? c.cidade : "",
            c ? c.uf : "",
            c ? c.incluir_renda : "",
            c ? (c.renda || "") : "",
            c ? c.imovel_tipo : "",
            c ? c.imovel_valor : "",
            c ? c.veiculo_placas : "",
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

// Função para fazer o deploy
async function deployCRM() {
  console.log('═══════════════════════════════════════════════════');
  console.log('   🚀 DEPLOY AUTOMÁTICO - CRM RMJ');
  console.log('═══════════════════════════════════════════════════');
  console.log('');

  // Passo 1: Encontrar o editor
  console.log('📝 Passo 1: Localizando editor...');
  const editors = document.querySelectorAll('[role="textbox"], textarea, .monaco-editor');
  let editor = null;

  // Tentar encontrar o editor do Apps Script
  for (let el of editors) {
    if (el.textContent.includes('function') || el.textContent.includes('const')) {
      editor = el;
      break;
    }
  }

  if (!editor) {
    console.error('❌ Não consegui encontrar o editor. Instruções manuais:');
    console.log('');
    console.log('PASSOS MANUAIS:');
    console.log('1. Abra: https://script.google.com/home/projects/1hZQFhkrZfkqM0caogfhSzY88IehWcjr7042MsAMGCSCyu4jZQH0dCwKF/edit');
    console.log('2. No editor, selecione TODO o código (Ctrl+A)');
    console.log('3. Delete (pressione Delete)');
    console.log('4. Cole este código (Ctrl+V):');
    console.log('');
    console.log(codigo);
    console.log('');
    console.log('5. Salve (Ctrl+S)');
    console.log('6. Clique em "Implantar" > "Nova implantação"');
    console.log('7. Escolha "App da Web" e "Qualquer pessoa" pode acessar');
    return;
  }

  console.log('✓ Editor encontrado!');

  // Passo 2: Limpar editor e inserir novo código
  console.log('💾 Passo 2: Limpando e atualizando código...');

  try {
    // Selecionar tudo
    editor.click();
    await new Promise(r => setTimeout(r, 300));

    const selectAllEvent = new KeyboardEvent('keydown', {
      key: 'a',
      code: 'KeyA',
      ctrlKey: true,
      bubbles: true
    });
    editor.dispatchEvent(selectAllEvent);

    await new Promise(r => setTimeout(r, 200));

    // Inserir novo código
    if (editor.tagName === 'TEXTAREA') {
      editor.value = codigo;
      editor.dispatchEvent(new Event('input', { bubbles: true }));
    } else {
      editor.textContent = codigo;
      editor.innerText = codigo;
      editor.dispatchEvent(new Event('input', { bubbles: true }));
      editor.dispatchEvent(new Event('change', { bubbles: true }));
    }

    console.log('✓ Código atualizado!');
  } catch (e) {
    console.error('❌ Erro ao atualizar código:', e.message);
    return;
  }

  // Passo 3: Salvar
  console.log('💾 Passo 3: Salvando projeto...');
  await new Promise(r => setTimeout(r, 500));

  document.dispatchEvent(new KeyboardEvent('keydown', {
    key: 's',
    code: 'KeyS',
    ctrlKey: true,
    bubbles: true
  }));

  console.log('✓ Salvando...');
  await new Promise(r => setTimeout(r, 3000));

  // Passo 4: Procurar botão de deploy
  console.log('🚀 Passo 4: Procurando botão "Implantar"...');

  const buttons = Array.from(document.querySelectorAll('button, [role="button"]'));
  const deployBtn = buttons.find(b => {
    const text = b.textContent.toLowerCase();
    return text.includes('implantar') || text.includes('deploy') || text.includes('deployment');
  });

  if (deployBtn) {
    console.log('✓ Botão encontrado! Clicando...');
    deployBtn.click();

    console.log('');
    console.log('═══════════════════════════════════════════════════');
    console.log('✅ PRÓXIMAS ETAPAS (FAÇA MANUALMENTE):');
    console.log('═══════════════════════════════════════════════════');
    console.log('');
    console.log('1. Uma janela deve ter aparecido (New deployment)');
    console.log('2. No campo "Tipo", selecione: "App da Web"');
    console.log('3. Em "Quem pode acessar", mude para: "Qualquer pessoa"');
    console.log('4. Clique em "Implantar"');
    console.log('5. Copie a URL gerada (parece com: https://script.google.com/macros/s/...)');
    console.log('6. Atualize seu arquivo .env.local com: GAS_WEB_APP_URL=<URL_COPIADA>');
    console.log('');
    console.log('═══════════════════════════════════════════════════');
  } else {
    console.error('❌ Botão "Implantar" não encontrado');
    console.log('');
    console.log('PRÓXIMAS ETAPAS MANUAIS:');
    console.log('1. Clique no botão azul "Implantar" no canto superior direito');
    console.log('2. Selecione "Nova implantação"');
    console.log('3. Escolha "App da Web"');
    console.log('4. Quem pode acessar: "Qualquer pessoa"');
    console.log('5. Clique em "Implantar"');
    console.log('6. Copie a URL e adicione ao .env.local');
  }
}

// Executar
deployCRM().catch(e => {
  console.error('❌ Erro geral:', e);
  console.log('Tente fazer o deploy manualmente seguindo os passos acima');
});
