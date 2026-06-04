// ============================================================
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
}
