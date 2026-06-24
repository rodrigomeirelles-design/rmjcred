import { google } from "googleapis";
import { Proposta, GarantiaItem, KanbanColumn, StatusRepasse } from "@/types";

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
  "motivo_perda","data_recusa","followup_data","checklist_garantias",
  "valor_solicitado","valor_aprovado","comissao_esperada",
  "emp_razao","emp_fantasia","emp_cnpj","emp_funcionarios","emp_faturamento",
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
];

function propostaToRow(p: Proposta): string[] {
  const base = [
    p.id_proposta, p.timestamp_envio, p.produto, p.coluna_kanban,
    p.status_repasse, p.motivo_perda ?? "", p.data_recusa ?? "",
    p.followup_data ?? "", JSON.stringify(p.checklist_garantias),
    String(p.valor_solicitado ?? ""), String(p.valor_aprovado ?? ""),
    String(p.comissao_esperada ?? ""),
    p.emp_razao, p.emp_fantasia ?? "", p.emp_cnpj,
    String(p.emp_funcionarios), String(p.emp_faturamento),
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
        s.imovel_tipo, String(s.imovel_valor ?? ""),
        s.veiculo_placas.join(";"),
      );
      const c = s.conjuge;
      if (c) {
        base.push(
          c.nome, c.cpf, c.rg, c.nascimento, c.telefone, c.email,
          c.imovel_tipo, String(c.imovel_valor ?? ""),
          c.veiculo_placas.join(";"), String(c.renda ?? ""), c.incluir_renda,
        );
      } else {
        base.push(...Array(11).fill(""));
      }
    } else {
      base.push(...Array(34).fill(""));
    }
  }
  return base;
}

function rowToProposta(headers: string[], row: string[]): Proposta {
  const get = (key: string) => row[headers.indexOf(key)] ?? "";
  return {
    id_proposta: get("id_proposta"),
    timestamp_envio: get("timestamp_envio"),
    produto: get("produto"),
    coluna_kanban: get("coluna_kanban") as KanbanColumn,
    status_repasse: (get("status_repasse") || "pendente") as StatusRepasse,
    motivo_perda: get("motivo_perda") || undefined,
    data_recusa: get("data_recusa") || undefined,
    followup_data: get("followup_data") || undefined,
    checklist_garantias: (() => {
      try { return JSON.parse(get("checklist_garantias")); } catch { return []; }
    })() as GarantiaItem[],
    valor_solicitado: parseFloat(get("valor_solicitado")) || undefined,
    valor_aprovado: parseFloat(get("valor_aprovado")) || undefined,
    comissao_esperada: parseFloat(get("comissao_esperada")) || undefined,
    emp_razao: get("emp_razao"),
    emp_fantasia: get("emp_fantasia") || undefined,
    emp_cnpj: get("emp_cnpj"),
    emp_funcionarios: parseInt(get("emp_funcionarios")) || 0,
    emp_faturamento: parseFloat(get("emp_faturamento")) || 0,
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
    banco_nome: get("banco_nome"),
    banco_numero: get("banco_numero"),
    banco_agencia: get("banco_agencia"),
    banco_conta: get("banco_conta"),
    banco_digito: get("banco_digito"),
    obs_finais: get("obs_finais") || undefined,
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
        imovel_tipo: get(`socio${i+1}_imovel_tipo`),
        imovel_valor: parseFloat(get(`socio${i+1}_imovel_valor`)) || null,
        veiculo_placas: get(`socio${i+1}_veiculo_placas`).split(";").filter(Boolean),
        conjuge: conjugeNome ? {
          nome: conjugeNome,
          cpf: get(`conjuge${i+1}_cpf`),
          rg: get(`conjuge${i+1}_rg`),
          nascimento: get(`conjuge${i+1}_nascimento`),
          telefone: get(`conjuge${i+1}_telefone`),
          email: get(`conjuge${i+1}_email`),
          imovel_tipo: get(`conjuge${i+1}_imovel_tipo`),
          imovel_valor: parseFloat(get(`conjuge${i+1}_imovel_valor`)) || null,
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
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: SHEET_ID,
    range: `${SHEET_NAME}!A1:ZZ`,
  });
  const rows = res.data.values ?? [];
  if (rows.length < 2) return [];
  const headers = rows[0] as string[];
  return rows.slice(1).map((row) => rowToProposta(headers, row as string[]));
}

export async function appendProposta(proposta: Proposta): Promise<void> {
  const auth = getAuth();
  const sheets = google.sheets({ version: "v4", auth });
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: SHEET_ID,
    range: `${SHEET_NAME}!A1:A1`,
  });
  if (!res.data.values) {
    await sheets.spreadsheets.values.update({
      spreadsheetId: SHEET_ID,
      range: `${SHEET_NAME}!A1`,
      valueInputOption: "RAW",
      requestBody: { values: [SHEET_HEADERS] },
    });
  }
  await sheets.spreadsheets.values.append({
    spreadsheetId: SHEET_ID,
    range: `${SHEET_NAME}!A1`,
    valueInputOption: "RAW",
    requestBody: { values: [propostaToRow(proposta)] },
  });
}

export async function updatePropostaField(
  id: string,
  fields: Partial<Pick<Proposta, "coluna_kanban" | "status_repasse" | "motivo_perda" | "data_recusa" | "followup_data" | "checklist_garantias" | "valor_solicitado" | "valor_aprovado" | "comissao_esperada">>
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
        values: [[key === "checklist_garantias" ? JSON.stringify(value) : String(value ?? "")]],
      },
    });
  }
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
