import { google } from "googleapis";
import { Proposta, KanbanColumn, StatusRepasse } from "@/types";
import { PropostaImovel, KanbanColumnImovel } from "@/types/imovel";
import { PropostaVeiculo } from "@/types/veiculo";

const SHEET_ID = process.env.GOOGLE_SHEETS_ID!;
const SHEET_NAME = "Propostas";

function getAuth() {
  return new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    },
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
}

export const SHEET_HEADERS = [
  "id_proposta","timestamp_envio","produto","coluna_kanban","status_repasse",
  "motivo_perda","data_recusa","followup_data","data_liberacao",
  "valor_solicitado",
  "emp_razao","emp_fantasia","emp_cnpj","emp_funcionarios",
  "emp_repr_nome","emp_repr_cpf","emp_email","emp_telefone",
  "emp_cep","emp_logradouro","emp_numero","emp_complemento",
  "emp_bairro","emp_cidade","emp_uf",
  "emp_imovel","emp_imovel_tipo","emp_imovel_valor",
  "banco_nome","banco_numero","banco_agencia","banco_conta","banco_digito",
  "obs_finais",
  ...Array.from({ length: 5 }, (_, i) => [
    `socio${i+1}_nome`,`socio${i+1}_cpf`,`socio${i+1}_rg`,
    `socio${i+1}_participacao`,`socio${i+1}_nascimento`,
    `socio${i+1}_estado_civil`,`socio${i+1}_regime`,
    `socio${i+1}_profissao`,`socio${i+1}_nacionalidade`,
    `socio${i+1}_email`,`socio${i+1}_telefone`,`socio${i+1}_renda`,
    `socio${i+1}_cep`,`socio${i+1}_logradouro`,`socio${i+1}_numero`,
    `socio${i+1}_complemento`,`socio${i+1}_bairro`,`socio${i+1}_cidade`,`socio${i+1}_uf`,
    `socio${i+1}_imovel_tipo`,`socio${i+1}_imovel_valor`,
    `socio${i+1}_veiculo_placas`,
    `conjuge${i+1}_nome`,`conjuge${i+1}_cpf`,`conjuge${i+1}_rg`,
    `conjuge${i+1}_nascimento`,`conjuge${i+1}_telefone`,`conjuge${i+1}_email`,
    `conjuge${i+1}_imovel_tipo`,`conjuge${i+1}_imovel_valor`,
    `conjuge${i+1}_veiculo_placas`,`conjuge${i+1}_renda`,`conjuge${i+1}_incluir_renda`,
  ]).flat(),
  // Novas colunas adicionadas no FINAL para não deslocar dados existentes
  "emp_regime_tributario",
  ...Array.from({ length: 5 }, (_, i) => [
    `socio${i+1}_imovel_residencial`,
    `socio${i+1}_reside_imovel_proprio`,
    `socio${i+1}_imovel_residencial_valor`,
  ]).flat(),
  "comissao_percentual",
];

function propostaToRow(p: Proposta): string[] {
  const base = [
    p.id_proposta, p.timestamp_envio, p.produto, p.coluna_kanban,
    p.status_repasse, p.motivo_perda ?? "", p.data_recusa ?? "",
    p.followup_data ?? "", p.data_liberacao ?? "",
    String(p.valor_solicitado ?? ""),
    p.emp_razao, p.emp_fantasia ?? "", p.emp_cnpj,
    String(p.emp_funcionarios),
    p.emp_repr_nome, p.emp_repr_cpf, p.emp_email, p.emp_telefone,
    p.emp_cep, p.emp_logradouro, p.emp_numero, p.emp_complemento ?? "",
    p.emp_bairro, p.emp_cidade, p.emp_uf,
    p.emp_imovel, p.emp_imovel_tipo ?? "", String(p.emp_imovel_valor ?? ""),
    p.banco_nome, p.banco_numero, p.banco_agencia, p.banco_conta, p.banco_digito,
    p.obs_finais ?? "",
  ];

  for (let i = 0; i < 5; i++) {
    const s = p.socios[i];
    if (s) {
      base.push(
        s.nome, s.cpf, s.rg, String(s.participacao), s.nascimento,
        s.estado_civil, s.regime ?? "",
        s.profissao, s.nacionalidade, s.email, s.telefone, String(s.renda),
        s.cep, s.logradouro, s.numero, s.complemento ?? "",
        s.bairro, s.cidade, s.uf,
        s.possui_imovel, String(s.possui_imovel === "sim" ? (s.imovel_valor ?? "") : ""),
        s.possui_veiculo === "sim" ? (s.veiculo_placas || []).join(";") : "",
      );
      const c = s.conjuge;
      if (c) {
        base.push(
          c.nome, c.cpf, c.rg, c.nascimento, c.telefone, c.email,
          c.possui_imovel, String(c.possui_imovel === "sim" ? (c.imovel_valor ?? "") : ""),
          c.possui_veiculo === "sim" ? (c.veiculo_placas || []).join(";") : "", String(c.incluir_renda === "sim" ? (c.renda ?? "") : ""), c.incluir_renda,
        );
      } else {
        base.push(...Array(11).fill(""));
      }
    } else {
      base.push(...Array(33).fill(""));
    }
  }

  // Novas colunas no final — não alteram posição das colunas existentes
  base.push(p.emp_regime_tributario ?? "");
  for (let i = 0; i < 5; i++) {
    const s = p.socios[i];
    base.push(
      s?.imovel_residencial ?? "",
      s?.reside_imovel_proprio ?? "",
      String(s?.imovel_residencial_valor ?? ""),
    );
  }
  base.push(String(p.comissao_percentual ?? ""));

  return base;
}

function rowToProposta(headers: string[], row: string[]): Proposta {
  const get = (key: string) => row[headers.indexOf(key)] ?? "";
  return {
    id_proposta: get("id_proposta"),
    timestamp_envio: get("timestamp_envio"),
    produto: get("produto"),
    tipo_pessoa: (get("produto") === "BDMG Capital de Giro" ? "PJ" : "PF") as import("@/types").TipoPessoa,
    coluna_kanban: get("coluna_kanban") as KanbanColumn,
    status_repasse: (get("status_repasse") || "pendente") as StatusRepasse,
    motivo_perda: get("motivo_perda") || undefined,
    data_recusa: get("data_recusa") || undefined,
    followup_data: get("followup_data") || undefined,
    data_liberacao: get("data_liberacao") || undefined,
    valor_solicitado: parseFloat(get("valor_solicitado")) || undefined,
    emp_razao: get("emp_razao"),
    emp_fantasia: get("emp_fantasia") || undefined,
    emp_cnpj: get("emp_cnpj"),
    emp_funcionarios: parseInt(get("emp_funcionarios")) || 0,
    emp_repr_nome: get("emp_repr_nome"),
    emp_repr_cpf: get("emp_repr_cpf"),
    emp_email: get("emp_email"),
    emp_telefone: get("emp_telefone"),
    emp_cep: get("emp_cep"),
    emp_logradouro: get("emp_logradouro"),
    emp_numero: get("emp_numero"),
    emp_complemento: get("emp_complemento") || undefined,
    emp_bairro: get("emp_bairro"),
    emp_cidade: get("emp_cidade"),
    emp_uf: get("emp_uf"),
    emp_imovel: get("emp_imovel"),
    emp_imovel_tipo: get("emp_imovel_tipo") || undefined,
    emp_imovel_valor: parseFloat(get("emp_imovel_valor")) || undefined,
    emp_regime_tributario: get("emp_regime_tributario") || undefined,
    banco_nome: get("banco_nome"),
    banco_numero: get("banco_numero"),
    banco_agencia: get("banco_agencia"),
    banco_conta: get("banco_conta"),
    banco_digito: get("banco_digito"),
    obs_finais: get("obs_finais") || undefined,
    comissao_percentual: parseFloat(get("comissao_percentual")) || undefined,
    socios: Array.from({ length: 5 }, (_, i) => {
      const nome = get(`socio${i+1}_nome`);
      if (!nome) return null;
      const conjugeNome = get(`conjuge${i+1}_nome`);
      return {
        nome,
        cpf: get(`socio${i+1}_cpf`),
        rg: get(`socio${i+1}_rg`),
        participacao: parseFloat(get(`socio${i+1}_participacao`)) || 0,
        nascimento: get(`socio${i+1}_nascimento`),
        estado_civil: get(`socio${i+1}_estado_civil`),
        regime: get(`socio${i+1}_regime`) || undefined,
        profissao: get(`socio${i+1}_profissao`),
        nacionalidade: get(`socio${i+1}_nacionalidade`),
        email: get(`socio${i+1}_email`),
        telefone: get(`socio${i+1}_telefone`),
        renda: parseFloat(get(`socio${i+1}_renda`)) || 0,
        cep: get(`socio${i+1}_cep`),
        logradouro: get(`socio${i+1}_logradouro`),
        numero: get(`socio${i+1}_numero`),
        complemento: get(`socio${i+1}_complemento`) || undefined,
        bairro: get(`socio${i+1}_bairro`),
        cidade: get(`socio${i+1}_cidade`),
        uf: get(`socio${i+1}_uf`),
        possui_imovel: (get(`socio${i+1}_imovel_tipo`) || "nao") as "sim" | "nao",
        imovel_tipo: get(`socio${i+1}_imovel_tipo`),
        imovel_valor: parseFloat(get(`socio${i+1}_imovel_valor`)) || null,
        imovel_residencial: (get(`socio${i+1}_imovel_residencial`) || undefined) as "sim" | "nao" | undefined,
        reside_imovel_proprio: (get(`socio${i+1}_reside_imovel_proprio`) || undefined) as "sim" | "nao" | undefined,
        imovel_residencial_valor: parseFloat(get(`socio${i+1}_imovel_residencial_valor`)) || null,
        possui_veiculo: get(`socio${i+1}_veiculo_placas`) ? "sim" : "nao",
        veiculo_placas: get(`socio${i+1}_veiculo_placas`).split(";").filter(Boolean),
        conjuge: conjugeNome ? {
          nome: conjugeNome,
          cpf: get(`conjuge${i+1}_cpf`),
          rg: get(`conjuge${i+1}_rg`),
          nascimento: get(`conjuge${i+1}_nascimento`),
          telefone: get(`conjuge${i+1}_telefone`),
          email: get(`conjuge${i+1}_email`),
          possui_imovel: (get(`conjuge${i+1}_imovel_tipo`) || "nao") as "sim" | "nao",
          imovel_tipo: get(`conjuge${i+1}_imovel_tipo`),
          imovel_valor: parseFloat(get(`conjuge${i+1}_imovel_valor`)) || null,
          possui_veiculo: get(`conjuge${i+1}_veiculo_placas`) ? "sim" : "nao",
          veiculo_placas: get(`conjuge${i+1}_veiculo_placas`).split(";").filter(Boolean),
          renda: parseFloat(get(`conjuge${i+1}_renda`)) || null,
          incluir_renda: (get(`conjuge${i+1}_incluir_renda`) || "nao") as "sim" | "nao",
        } : undefined,
      };
    }).filter(Boolean) as Proposta["socios"],
  };
}

export async function getPropostas(): Promise<Proposta[]> {
  const auth = getAuth();
  const sheets = google.sheets({ version: "v4", auth });
  try {
    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range: `${SHEET_NAME}!A1:ZZ`,
    });
    const rows = res.data.values ?? [];
    if (rows.length < 2) return [];
    const headers = rows[0] as string[];
    return rows.slice(1).map((row) => rowToProposta(headers, row as string[]));
  } catch (error: any) {
    if (error.message?.includes("Unable to parse range")) return [];
    throw error;
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function ensurePropostasSheet(sheets: any): Promise<void> {
  const meta = await sheets.spreadsheets.get({ spreadsheetId: SHEET_ID });
  const exists = meta.data.sheets?.some((s: any) => s.properties?.title === SHEET_NAME);
  if (!exists) {
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId: SHEET_ID,
      requestBody: { requests: [{ addSheet: { properties: { title: SHEET_NAME } } }] },
    });
    await sheets.spreadsheets.values.update({
      spreadsheetId: SHEET_ID,
      range: `${SHEET_NAME}!A1`,
      valueInputOption: "RAW",
      requestBody: { values: [SHEET_HEADERS] },
    });
    return;
  }

  const headerRes = await sheets.spreadsheets.values.get({
    spreadsheetId: SHEET_ID,
    range: `${SHEET_NAME}!1:1`,
  });
  const existingHeaders = (headerRes.data.values?.[0] as string[] | undefined) ?? [];

  if (existingHeaders.length === 0) {
    await sheets.spreadsheets.values.update({
      spreadsheetId: SHEET_ID,
      range: `${SHEET_NAME}!A1`,
      valueInputOption: "RAW",
      requestBody: { values: [SHEET_HEADERS] },
    });
    return;
  }

  // Adiciona colunas novas que não existem no header atual (append-only, sem shift)
  const existingSet = new Set(existingHeaders);
  const missingHeaders = SHEET_HEADERS.filter((h) => !existingSet.has(h));
  if (missingHeaders.length > 0) {
    const meta = await sheets.spreadsheets.get({ spreadsheetId: SHEET_ID });
    const sheetMeta = meta.data.sheets?.find((s: any) => s.properties?.title === SHEET_NAME);
    const sheetId = sheetMeta?.properties?.sheetId ?? 0;
    const currentColCount = sheetMeta?.properties?.gridProperties?.columnCount ?? existingHeaders.length;
    const neededCols = existingHeaders.length + missingHeaders.length;
    if (neededCols > currentColCount) {
      await sheets.spreadsheets.batchUpdate({
        spreadsheetId: SHEET_ID,
        requestBody: {
          requests: [{
            appendDimension: {
              sheetId,
              dimension: "COLUMNS",
              length: neededCols - currentColCount,
            },
          }],
        },
      });
    }
    const startCol = colIndexToLetter(existingHeaders.length);
    await sheets.spreadsheets.values.update({
      spreadsheetId: SHEET_ID,
      range: `${SHEET_NAME}!${startCol}1`,
      valueInputOption: "RAW",
      requestBody: { values: [missingHeaders] },
    });
  }
}

export async function appendProposta(proposta: Proposta): Promise<void> {
  const auth = getAuth();
  const sheets = google.sheets({ version: "v4", auth });
  await ensurePropostasSheet(sheets);
  await sheets.spreadsheets.values.append({
    spreadsheetId: SHEET_ID,
    range: `${SHEET_NAME}!A1`,
    valueInputOption: "RAW",
    requestBody: { values: [propostaToRow(proposta)] },
  });
}

export async function updatePropostaField(
  id: string,
  fields: Record<string, string | number | null | undefined>
): Promise<void> {
  const auth = getAuth();
  const sheets = google.sheets({ version: "v4", auth });
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: SHEET_ID,
    range: `${SHEET_NAME}!A1:ZZ`,
  });
  const rows = res.data.values ?? [];
  if (rows.length < 2) return;
  const headers = rows[0] as string[];
  const rowIndex = rows.findIndex((r, i) => i > 0 && r[0] === id);
  if (rowIndex === -1) return;

  for (const [key, value] of Object.entries(fields)) {
    const colIndex = headers.indexOf(key);
    if (colIndex === -1) continue;
    const colLetter = colIndexToLetter(colIndex);
    const cellRef = `${SHEET_NAME}!${colLetter}${rowIndex + 1}`;
    await sheets.spreadsheets.values.update({
      spreadsheetId: SHEET_ID,
      range: cellRef,
      valueInputOption: "RAW",
      requestBody: {
        values: [[typeof value === "object" && value !== null ? JSON.stringify(value) : String(value ?? "")]],
      },
    });
  }
}

export async function deletePropostaRow(id: string): Promise<void> {
  const auth = getAuth();
  const sheets = google.sheets({ version: "v4", auth });
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: SHEET_ID,
    range: `${SHEET_NAME}!A:A`,
  });
  const rows = res.data.values ?? [];
  const rowIndex = rows.findIndex((r, i) => i > 0 && r[0] === id);
  if (rowIndex === -1) return;

  const meta = await sheets.spreadsheets.get({ spreadsheetId: SHEET_ID });
  const sheetId = meta.data.sheets?.find((s: any) => s.properties?.title === SHEET_NAME)?.properties?.sheetId ?? 0;

  await sheets.spreadsheets.batchUpdate({
    spreadsheetId: SHEET_ID,
    requestBody: {
      requests: [{
        deleteDimension: {
          range: {
            sheetId,
            dimension: "ROWS",
            startIndex: rowIndex,
            endIndex: rowIndex + 1,
          },
        },
      }],
    },
  });
}

function colIndexToLetter(index: number): string {
  let letter = "";
  let n = index;
  while (n >= 0) {
    letter = String.fromCharCode((n % 26) + 65) + letter;
    n = Math.floor(n / 26) - 1;
  }
  return letter;
}

export async function getConfig(key: string): Promise<string | null> {
  const auth = getAuth();
  const sheets = google.sheets({ version: "v4", auth });
  try {
    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range: "Config!A:B",
    });
    const rows = res.data.values ?? [];
    const row = rows.find(r => r[0] === key);
    return row ? row[1] : null;
  } catch (error: any) {
    if (error.message?.includes("Unable to parse range")) {
      return null;
    }
    throw error;
  }
}

export async function setConfig(key: string, value: string): Promise<void> {
  const auth = getAuth();
  const sheets = google.sheets({ version: "v4", auth });

  try {
    await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range: "Config!A1",
    });
  } catch (error: any) {
    if (error.message?.includes("Unable to parse range")) {
      await sheets.spreadsheets.batchUpdate({
        spreadsheetId: SHEET_ID,
        requestBody: {
          requests: [{ addSheet: { properties: { title: "Config" } } }]
        }
      });
    }
  }

  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: SHEET_ID,
    range: "Config!A:B",
  });

  const rows = res.data.values ?? [];
  const rowIndex = rows.findIndex(r => r[0] === key);

  if (rowIndex === -1) {
    await sheets.spreadsheets.values.append({
      spreadsheetId: SHEET_ID,
      range: "Config!A:B",
      valueInputOption: "RAW",
      requestBody: { values: [[key, value]] },
    });
  } else {
    await sheets.spreadsheets.values.update({
      spreadsheetId: SHEET_ID,
      range: `Config!B${rowIndex + 1}`,
      valueInputOption: "RAW",
      requestBody: { values: [[value]] },
    });
  }
}

// ─── PropostasImovel sheet ────────────────────────────────────────────────────

const SHEET_NAME_IMOVEL = "PropostasImovel";

export const SHEET_HEADERS_IMOVEL = [
  "id_proposta", "timestamp_envio", "produto", "coluna_kanban",
  "nome", "cpf", "celular", "email", "nascimento", "sexo",
  "nomeMae", "nomePai", "rgCnh", "orgaoEmissor", "estadoCivil",
  "naturalidade", "nacionalidade",
  "cep", "logradouro", "numero", "complemento", "bairro", "cidade", "uf",
  "fonteRenda", "rendaMensal", "profissao", "banco", "agencia", "conta",
  "temSegundoProponente",
  "sp_nome", "sp_cpf", "sp_celular", "sp_email", "sp_nascimento", "sp_sexo",
  "sp_nomeMae", "sp_nomePai", "sp_rgCnh", "sp_orgaoEmissor",
  "sp_fonteRenda", "sp_rendaMensal", "sp_profissao",
  "tipoImovel", "estadoConservacao", "valorImovel", "valorFinanciamento", "prazo", "ufImovel",
  "usarFgts", "valorFgts",
  "imovel_cep", "imovel_logradouro", "imovel_numero", "imovel_complemento",
  "imovel_bairro", "imovel_cidade", "imovel_uf", "matriculaIptu", "situacaoImovel",
  "regimeUniao",
  "conjuge_nome", "conjuge_cpf", "conjuge_celular", "conjuge_email",
  "conjuge_nascimento", "conjuge_sexo", "conjuge_profissao",
  "conjuge_fonteRenda", "conjuge_rendaMensal",
  "observacoes",
];

function propostaImovelToRow(p: PropostaImovel): string[] {
  return SHEET_HEADERS_IMOVEL.map((key) => {
    const val = (p as unknown as Record<string, unknown>)[key];
    if (val === null || val === undefined) return "";
    if (typeof val === "boolean") return val ? "sim" : "nao";
    return String(val);
  });
}

function rowToPropostaImovel(headers: string[], row: string[]): PropostaImovel {
  const get = (key: string) => row[headers.indexOf(key)] ?? "";
  return {
    id_proposta: get("id_proposta"),
    timestamp_envio: get("timestamp_envio"),
    produto: get("produto") as PropostaImovel["produto"],
    coluna_kanban: (get("coluna_kanban") || "novo_lead") as KanbanColumnImovel,
    nome: get("nome"),
    cpf: get("cpf"),
    celular: get("celular"),
    email: get("email"),
    nascimento: get("nascimento"),
    sexo: get("sexo") || undefined,
    nomeMae: get("nomeMae"),
    nomePai: get("nomePai") || undefined,
    rgCnh: get("rgCnh"),
    orgaoEmissor: get("orgaoEmissor") || undefined,
    estadoCivil: get("estadoCivil"),
    naturalidade: get("naturalidade") || undefined,
    nacionalidade: get("nacionalidade") || undefined,
    cep: get("cep"),
    logradouro: get("logradouro"),
    numero: get("numero"),
    complemento: get("complemento") || undefined,
    bairro: get("bairro"),
    cidade: get("cidade"),
    uf: get("uf"),
    fonteRenda: get("fonteRenda"),
    rendaMensal: parseFloat(get("rendaMensal")) || 0,
    profissao: get("profissao") || undefined,
    banco: get("banco"),
    agencia: get("agencia") || undefined,
    conta: get("conta") || undefined,
    temSegundoProponente: get("temSegundoProponente") === "sim",
    sp_nome: get("sp_nome") || undefined,
    sp_cpf: get("sp_cpf") || undefined,
    sp_celular: get("sp_celular") || undefined,
    sp_email: get("sp_email") || undefined,
    sp_nascimento: get("sp_nascimento") || undefined,
    sp_sexo: get("sp_sexo") || undefined,
    sp_nomeMae: get("sp_nomeMae") || undefined,
    sp_nomePai: get("sp_nomePai") || undefined,
    sp_rgCnh: get("sp_rgCnh") || undefined,
    sp_orgaoEmissor: get("sp_orgaoEmissor") || undefined,
    sp_fonteRenda: get("sp_fonteRenda") || undefined,
    sp_rendaMensal: parseFloat(get("sp_rendaMensal")) || undefined,
    sp_profissao: get("sp_profissao") || undefined,
    tipoImovel: get("tipoImovel"),
    estadoConservacao: get("estadoConservacao"),
    valorImovel: parseFloat(get("valorImovel")) || 0,
    valorFinanciamento: parseFloat(get("valorFinanciamento")) || 0,
    prazo: get("prazo"),
    ufImovel: get("ufImovel") || undefined,
    usarFgts: (get("usarFgts") || undefined) as "sim" | "nao" | undefined,
    valorFgts: parseFloat(get("valorFgts")) || undefined,
    imovel_cep: get("imovel_cep") || undefined,
    imovel_logradouro: get("imovel_logradouro") || undefined,
    imovel_numero: get("imovel_numero") || undefined,
    imovel_complemento: get("imovel_complemento") || undefined,
    imovel_bairro: get("imovel_bairro") || undefined,
    imovel_cidade: get("imovel_cidade") || undefined,
    imovel_uf: get("imovel_uf") || undefined,
    matriculaIptu: get("matriculaIptu") || undefined,
    situacaoImovel: get("situacaoImovel") || undefined,
    regimeUniao: get("regimeUniao") || undefined,
    conjuge_nome: get("conjuge_nome") || undefined,
    conjuge_cpf: get("conjuge_cpf") || undefined,
    conjuge_celular: get("conjuge_celular") || undefined,
    conjuge_email: get("conjuge_email") || undefined,
    conjuge_nascimento: get("conjuge_nascimento") || undefined,
    conjuge_sexo: get("conjuge_sexo") || undefined,
    conjuge_profissao: get("conjuge_profissao") || undefined,
    conjuge_fonteRenda: get("conjuge_fonteRenda") || undefined,
    conjuge_rendaMensal: parseFloat(get("conjuge_rendaMensal")) || undefined,
    observacoes: get("observacoes") || undefined,
    aceite_lgpd: true,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function ensureImovelSheet(sheets: any): Promise<void> {
  const meta = await sheets.spreadsheets.get({ spreadsheetId: SHEET_ID });
  const exists = meta.data.sheets?.some((s: any) => s.properties?.title === SHEET_NAME_IMOVEL);
  if (!exists) {
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId: SHEET_ID,
      requestBody: { requests: [{ addSheet: { properties: { title: SHEET_NAME_IMOVEL } } }] },
    });
    await sheets.spreadsheets.values.update({
      spreadsheetId: SHEET_ID,
      range: `${SHEET_NAME_IMOVEL}!A1`,
      valueInputOption: "RAW",
      requestBody: { values: [SHEET_HEADERS_IMOVEL] },
    });
    return;
  }

  const headerRes = await sheets.spreadsheets.values.get({
    spreadsheetId: SHEET_ID,
    range: `${SHEET_NAME_IMOVEL}!1:1`,
  });
  const existingHeaders = (headerRes.data.values?.[0] as string[] | undefined) ?? [];
  if (existingHeaders.length === 0) {
    await sheets.spreadsheets.values.update({
      spreadsheetId: SHEET_ID,
      range: `${SHEET_NAME_IMOVEL}!A1`,
      valueInputOption: "RAW",
      requestBody: { values: [SHEET_HEADERS_IMOVEL] },
    });
    return;
  }

  const existingSet = new Set(existingHeaders);
  const missingHeaders = SHEET_HEADERS_IMOVEL.filter((h) => !existingSet.has(h));
  if (missingHeaders.length > 0) {
    const startCol = colIndexToLetter(existingHeaders.length);
    await sheets.spreadsheets.values.update({
      spreadsheetId: SHEET_ID,
      range: `${SHEET_NAME_IMOVEL}!${startCol}1`,
      valueInputOption: "RAW",
      requestBody: { values: [missingHeaders] },
    });
  }
}

export async function appendPropostaImovel(proposta: PropostaImovel): Promise<void> {
  const auth = getAuth();
  const sheets = google.sheets({ version: "v4", auth });
  await ensureImovelSheet(sheets);
  await sheets.spreadsheets.values.append({
    spreadsheetId: SHEET_ID,
    range: `${SHEET_NAME_IMOVEL}!A1`,
    valueInputOption: "RAW",
    requestBody: { values: [propostaImovelToRow(proposta)] },
  });
}

export async function getPropostasImovel(): Promise<PropostaImovel[]> {
  const auth = getAuth();
  const sheets = google.sheets({ version: "v4", auth });
  try {
    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range: `${SHEET_NAME_IMOVEL}!A1:BZ`,
    });
    const rows = res.data.values ?? [];
    if (rows.length < 2) return [];
    const headers = rows[0] as string[];
    return rows.slice(1).map((row) => rowToPropostaImovel(headers, row as string[]));
  } catch (error: any) {
    if (error.message?.includes("Unable to parse range")) return [];
    throw error;
  }
}

export async function deletePropostaImovelRow(id: string): Promise<void> {
  const auth = getAuth();
  const sheets = google.sheets({ version: "v4", auth });
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: SHEET_ID,
    range: `${SHEET_NAME_IMOVEL}!A:A`,
  });
  const rows = res.data.values ?? [];
  const rowIndex = rows.findIndex((r, i) => i > 0 && r[0] === id);
  if (rowIndex === -1) return;

  const meta = await sheets.spreadsheets.get({ spreadsheetId: SHEET_ID });
  const sheetId = meta.data.sheets?.find((s: any) => s.properties?.title === SHEET_NAME_IMOVEL)?.properties?.sheetId;
  if (sheetId == null) return;

  await sheets.spreadsheets.batchUpdate({
    spreadsheetId: SHEET_ID,
    requestBody: {
      requests: [{ deleteDimension: { range: { sheetId, dimension: "ROWS", startIndex: rowIndex, endIndex: rowIndex + 1 } } }],
    },
  });
}

export async function updatePropostaImovelField(
  id: string,
  fields: Record<string, string | number | boolean | null | undefined>
): Promise<void> {
  const auth = getAuth();
  const sheets = google.sheets({ version: "v4", auth });
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: SHEET_ID,
    range: `${SHEET_NAME_IMOVEL}!A1:BZ`,
  });
  const rows = res.data.values ?? [];
  if (rows.length < 2) return;
  const headers = rows[0] as string[];
  const rowIndex = rows.findIndex((r, i) => i > 0 && r[0] === id);
  if (rowIndex === -1) return;

  for (const [key, value] of Object.entries(fields)) {
    const colIndex = headers.indexOf(key);
    if (colIndex === -1) continue;
    const colLetter = colIndexToLetter(colIndex);
    const cellRef = `${SHEET_NAME_IMOVEL}!${colLetter}${rowIndex + 1}`;
    await sheets.spreadsheets.values.update({
      spreadsheetId: SHEET_ID,
      range: cellRef,
      valueInputOption: "RAW",
      requestBody: {
        values: [[typeof value === "boolean" ? (value ? "sim" : "nao") : String(value ?? "")]],
      },
    });
  }
}

// ─── PropostasVeiculo sheet ───────────────────────────────────────────────────

const SHEET_NAME_VEICULO = "PropostasVeiculo";

export const SHEET_HEADERS_VEICULO = [
  "id_proposta", "timestamp_envio", "produto", "coluna_kanban",
  "nome", "cpf", "rg", "rg_orgao_emissor", "rg_data_emissao",
  "nascimento", "estado_civil", "nacionalidade", "nome_mae",
  "celular", "telefone", "email",
  "cep", "logradouro", "numero", "complemento", "bairro", "cidade", "uf", "tempo_residencia",
  "situacao_profissional",
  "empresa", "empresa_cnpj", "cargo", "data_admissao",
  "autonomo_empresa", "autonomo_cnpj", "autonomo_atividade", "autonomo_tempo",
  "renda_mensal", "outras_rendas", "outras_rendas_valor",
  "banco", "banco_agencia", "banco_conta", "banco_tipo_conta",
  "veiculo_tipo", "veiculo_categoria", "veiculo_marca", "veiculo_modelo",
  "veiculo_ano_fabricacao", "veiculo_placa", "veiculo_valor_fipe",
  "valor_veiculo", "valor_entrada", "valor_financiamento", "parcelas",
  "veiculo_tem_divida", "veiculo_saldo_devedor",
  "observacoes",
];

function propostaVeiculoToRow(p: PropostaVeiculo): string[] {
  return SHEET_HEADERS_VEICULO.map((key) => {
    const val = (p as unknown as Record<string, unknown>)[key];
    if (val === null || val === undefined) return "";
    if (typeof val === "boolean") return val ? "sim" : "nao";
    return String(val);
  });
}

function rowToPropostaVeiculo(headers: string[], row: string[]): PropostaVeiculo {
  const get = (key: string) => row[headers.indexOf(key)] ?? "";
  return {
    id_proposta:    get("id_proposta"),
    timestamp_envio: get("timestamp_envio"),
    produto:        get("produto") as PropostaVeiculo["produto"],
    coluna_kanban:  (get("coluna_kanban") || "novo_lead") as PropostaVeiculo["coluna_kanban"],
    nome:           get("nome"),
    cpf:            get("cpf"),
    rg:             get("rg"),
    rg_orgao_emissor: get("rg_orgao_emissor") || undefined,
    rg_data_emissao:  get("rg_data_emissao")  || undefined,
    nascimento:     get("nascimento"),
    estado_civil:   get("estado_civil"),
    nacionalidade:  get("nacionalidade") || undefined,
    nome_mae:       get("nome_mae"),
    celular:        get("celular"),
    telefone:       get("telefone") || undefined,
    email:          get("email"),
    cep:            get("cep"),
    logradouro:     get("logradouro"),
    numero:         get("numero"),
    complemento:    get("complemento") || undefined,
    bairro:         get("bairro"),
    cidade:         get("cidade"),
    uf:             get("uf"),
    tempo_residencia: get("tempo_residencia") || undefined,
    situacao_profissional: (get("situacao_profissional") || "assalariado") as PropostaVeiculo["situacao_profissional"],
    empresa:        get("empresa") || undefined,
    empresa_cnpj:   get("empresa_cnpj") || undefined,
    cargo:          get("cargo") || undefined,
    data_admissao:  get("data_admissao") || undefined,
    autonomo_empresa:   get("autonomo_empresa")   || undefined,
    autonomo_cnpj:      get("autonomo_cnpj")      || undefined,
    autonomo_atividade: get("autonomo_atividade") || undefined,
    autonomo_tempo:     get("autonomo_tempo")     || undefined,
    renda_mensal:    parseFloat(get("renda_mensal")) || 0,
    outras_rendas:   get("outras_rendas")  || undefined,
    outras_rendas_valor: parseFloat(get("outras_rendas_valor")) || undefined,
    banco:           get("banco"),
    banco_agencia:   get("banco_agencia") || undefined,
    banco_conta:     get("banco_conta")   || undefined,
    banco_tipo_conta: (get("banco_tipo_conta") || undefined) as PropostaVeiculo["banco_tipo_conta"],
    veiculo_tipo:       (get("veiculo_tipo") || "novo") as "novo" | "usado",
    veiculo_categoria:  (get("veiculo_categoria") || "carros") as PropostaVeiculo["veiculo_categoria"],
    veiculo_marca:      get("veiculo_marca"),
    veiculo_modelo:     get("veiculo_modelo"),
    veiculo_ano_fabricacao: get("veiculo_ano_fabricacao"),
    veiculo_placa:      get("veiculo_placa") || undefined,
    veiculo_valor_fipe: parseFloat(get("veiculo_valor_fipe")) || undefined,
    valor_veiculo:      parseFloat(get("valor_veiculo"))      || 0,
    valor_entrada:      parseFloat(get("valor_entrada"))      || undefined,
    valor_financiamento: parseFloat(get("valor_financiamento")) || 0,
    parcelas:       get("parcelas"),
    veiculo_tem_divida:    (get("veiculo_tem_divida") || undefined) as "sim" | "nao" | undefined,
    veiculo_saldo_devedor: parseFloat(get("veiculo_saldo_devedor")) || undefined,
    observacoes:    get("observacoes") || undefined,
    aceite_lgpd:    true,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function ensureVeiculoSheet(sheets: any): Promise<void> {
  const meta = await sheets.spreadsheets.get({ spreadsheetId: SHEET_ID });
  const exists = meta.data.sheets?.some((s: any) => s.properties?.title === SHEET_NAME_VEICULO);
  if (!exists) {
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId: SHEET_ID,
      requestBody: { requests: [{ addSheet: { properties: { title: SHEET_NAME_VEICULO } } }] },
    });
    await sheets.spreadsheets.values.update({
      spreadsheetId: SHEET_ID,
      range: `${SHEET_NAME_VEICULO}!A1`,
      valueInputOption: "RAW",
      requestBody: { values: [SHEET_HEADERS_VEICULO] },
    });
    return;
  }

  const headerRes = await sheets.spreadsheets.values.get({
    spreadsheetId: SHEET_ID,
    range: `${SHEET_NAME_VEICULO}!1:1`,
  });
  const existingHeaders = (headerRes.data.values?.[0] as string[] | undefined) ?? [];
  if (existingHeaders.length === 0) {
    await sheets.spreadsheets.values.update({
      spreadsheetId: SHEET_ID,
      range: `${SHEET_NAME_VEICULO}!A1`,
      valueInputOption: "RAW",
      requestBody: { values: [SHEET_HEADERS_VEICULO] },
    });
    return;
  }

  const existingSet = new Set(existingHeaders);
  const missingHeaders = SHEET_HEADERS_VEICULO.filter((h) => !existingSet.has(h));
  if (missingHeaders.length > 0) {
    const sheetMeta = meta.data.sheets?.find((s: any) => s.properties?.title === SHEET_NAME_VEICULO);
    const sheetId = sheetMeta?.properties?.sheetId ?? 0;
    const currentColCount = sheetMeta?.properties?.gridProperties?.columnCount ?? existingHeaders.length;
    const neededCols = existingHeaders.length + missingHeaders.length;
    if (neededCols > currentColCount) {
      await sheets.spreadsheets.batchUpdate({
        spreadsheetId: SHEET_ID,
        requestBody: {
          requests: [{
            appendDimension: { sheetId, dimension: "COLUMNS", length: neededCols - currentColCount },
          }],
        },
      });
    }
    const startCol = colIndexToLetter(existingHeaders.length);
    await sheets.spreadsheets.values.update({
      spreadsheetId: SHEET_ID,
      range: `${SHEET_NAME_VEICULO}!${startCol}1`,
      valueInputOption: "RAW",
      requestBody: { values: [missingHeaders] },
    });
  }
}

export async function appendPropostaVeiculo(proposta: PropostaVeiculo): Promise<void> {
  const auth   = getAuth();
  const sheets = google.sheets({ version: "v4", auth });
  await ensureVeiculoSheet(sheets);
  await sheets.spreadsheets.values.append({
    spreadsheetId: SHEET_ID,
    range: `${SHEET_NAME_VEICULO}!A1`,
    valueInputOption: "RAW",
    requestBody: { values: [propostaVeiculoToRow(proposta)] },
  });
}

export async function getPropostasVeiculo(): Promise<PropostaVeiculo[]> {
  const auth   = getAuth();
  const sheets = google.sheets({ version: "v4", auth });
  try {
    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range: `${SHEET_NAME_VEICULO}!A1:BZ`,
    });
    const rows = res.data.values ?? [];
    if (rows.length < 2) return [];
    const headers = rows[0] as string[];
    return rows.slice(1).map((row) => rowToPropostaVeiculo(headers, row as string[]));
  } catch (error: any) {
    if (error.message?.includes("Unable to parse range")) return [];
    throw error;
  }
}

export async function deletePropostaVeiculoRow(id: string): Promise<void> {
  const auth   = getAuth();
  const sheets = google.sheets({ version: "v4", auth });
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: SHEET_ID,
    range: `${SHEET_NAME_VEICULO}!A:A`,
  });
  const rows = res.data.values ?? [];
  const rowIndex = rows.findIndex((r, i) => i > 0 && r[0] === id);
  if (rowIndex === -1) return;

  const meta    = await sheets.spreadsheets.get({ spreadsheetId: SHEET_ID });
  const sheetId = meta.data.sheets?.find((s: any) => s.properties?.title === SHEET_NAME_VEICULO)?.properties?.sheetId;
  if (sheetId == null) return;

  await sheets.spreadsheets.batchUpdate({
    spreadsheetId: SHEET_ID,
    requestBody: {
      requests: [{ deleteDimension: { range: { sheetId, dimension: "ROWS", startIndex: rowIndex, endIndex: rowIndex + 1 } } }],
    },
  });
}

export async function updatePropostaVeiculoField(
  id: string,
  fields: Record<string, string | number | boolean | null | undefined>
): Promise<void> {
  const auth   = getAuth();
  const sheets = google.sheets({ version: "v4", auth });
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: SHEET_ID,
    range: `${SHEET_NAME_VEICULO}!A1:BZ`,
  });
  const rows = res.data.values ?? [];
  if (rows.length < 2) return;
  const headers  = rows[0] as string[];
  const rowIndex = rows.findIndex((r, i) => i > 0 && r[0] === id);
  if (rowIndex === -1) return;

  for (const [key, value] of Object.entries(fields)) {
    const colIndex = headers.indexOf(key);
    if (colIndex === -1) continue;
    const colLetter = colIndexToLetter(colIndex);
    const cellRef   = `${SHEET_NAME_VEICULO}!${colLetter}${rowIndex + 1}`;
    await sheets.spreadsheets.values.update({
      spreadsheetId: SHEET_ID,
      range: cellRef,
      valueInputOption: "RAW",
      requestBody: {
        values: [[typeof value === "boolean" ? (value ? "sim" : "nao") : String(value ?? "")]],
      },
    });
  }
}

export async function getPropostaVeiculoById(id: string): Promise<PropostaVeiculo | null> {
  const auth   = getAuth();
  const sheets = google.sheets({ version: "v4", auth });
  try {
    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range: `${SHEET_NAME_VEICULO}!A1:BZ`,
    });
    const rows = res.data.values ?? [];
    if (rows.length < 2) return null;
    const headers = rows[0] as string[];
    const row = rows.find((r, i) => i > 0 && r[0] === id);
    if (!row) return null;
    return rowToPropostaVeiculo(headers, row as string[]);
  } catch {
    return null;
  }
}

