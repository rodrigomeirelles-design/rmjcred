import Database from "better-sqlite3";
import path from "path";

const dbPath = path.join(process.cwd(), "crm.db");
const db = new Database(dbPath);

// Enable WAL mode and foreign keys
db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");

// Initialize tables
db.exec(`
  CREATE TABLE IF NOT EXISTS empresas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    cnpj TEXT UNIQUE NOT NULL,
    razao_social TEXT NOT NULL,
    faturamento REAL NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS contatos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    empresa_id INTEGER NOT NULL,
    nome TEXT NOT NULL,
    whatsapp TEXT NOT NULL,
    cargo TEXT NOT NULL,
    FOREIGN KEY(empresa_id) REFERENCES empresas(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS oportunidades (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    empresa_id INTEGER NOT NULL,
    valor_solicitado REAL NOT NULL,
    valor_aprovado REAL,
    comissao_esperada REAL NOT NULL,
    status_repasse TEXT DEFAULT 'pendente',
    coluna_kanban TEXT NOT NULL,
    motivo_perda TEXT,
    data_recusa TEXT,
    checklist_garantias TEXT NOT NULL,
    followup_data TEXT,
    canal TEXT DEFAULT 'Capital de Giro BDMG',
    modo_comissao TEXT DEFAULT 'credito',
    comissao_porcentagem REAL DEFAULT 4.0,
    data_liberacao TEXT,
    data_proposta TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(empresa_id) REFERENCES empresas(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS tarefas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    oportunidade_id INTEGER,
    cliente_nome TEXT NOT NULL,
    tipo TEXT NOT NULL DEFAULT 'Manual',
    descricao TEXT NOT NULL,
    data_vencimento TEXT NOT NULL,
    concluida INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(oportunidade_id) REFERENCES oportunidades(id) ON DELETE SET NULL
  );
`);

// Safe ALTER TABLE additions for existing databases (ignored if columns exist)
const safeAddColumn = (table: string, column: string, type: string, defaultVal?: string) => {
  try {
    const def = defaultVal !== undefined ? ` DEFAULT ${defaultVal}` : "";
    db.exec(`ALTER TABLE ${table} ADD COLUMN ${column} ${type}${def}`);
  } catch {
    // Column already exists, ignore
  }
};

safeAddColumn("oportunidades", "canal", "TEXT", "'Capital de Giro BDMG'");
safeAddColumn("oportunidades", "modo_comissao", "TEXT", "'credito'");
safeAddColumn("oportunidades", "comissao_porcentagem", "REAL", "4.0");
safeAddColumn("oportunidades", "data_liberacao", "TEXT", "NULL");
safeAddColumn("oportunidades", "data_proposta", "TEXT", "NULL");

// Seed initial data if empty
const count = db.prepare("SELECT COUNT(*) as count FROM empresas").get() as { count: number };
if (count.count === 0) {
  const insertEmpresa = db.prepare("INSERT OR IGNORE INTO empresas (cnpj, razao_social, faturamento) VALUES (?, ?, ?)");
  const insertContato = db.prepare("INSERT INTO contatos (empresa_id, nome, whatsapp, cargo) VALUES (?, ?, ?, ?)");
  const insertOportunidade = db.prepare(`
    INSERT INTO oportunidades (empresa_id, valor_solicitado, valor_aprovado, comissao_esperada, status_repasse, coluna_kanban, checklist_garantias, canal, comissao_porcentagem, data_proposta)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  db.transaction(() => {
    // Café das Alterosas
    const e1Result = insertEmpresa.run("12.345.678/0001-90", "Café das Alterosas Ltda", 1200000);
    const e1 = e1Result.changes > 0 ? e1Result.lastInsertRowid : null;
    if (e1) {
      insertContato.run(e1, "João das Neves", "35999887766", "Sócio Administrador");
      insertContato.run(e1, "Maria Silva", "35988776655", "Gerente Financeira");
      
      const allValidated = JSON.stringify([
        { item: "Imóvel", validado: true },
        { item: "Recebíveis", validado: true },
        { item: "Aval dos sócios", validado: true },
        { item: "Veículos", validado: true },
        { item: "Equipamentos", validado: true }
      ]);
      
      const pendingChecklist = JSON.stringify([
        { item: "Imóvel", validado: false },
        { item: "Recebíveis", validado: false },
        { item: "Aval dos sócios", validado: false },
        { item: "Veículos", validado: false },
        { item: "Equipamentos", validado: false }
      ]);

      insertOportunidade.run(e1, 150000, 150000, 6000, "pendente", "em_preenchimento", pendingChecklist, "Capital de Giro BDMG", 4.0, "2025-01-15");
      insertOportunidade.run(e1, 200000, null, 8000, "pendente", "em_analise", allValidated, "Financiamento Imobiliário", 2.5, "2025-02-10");
    }

    // Tecnologia Itajubense
    const e2Result = insertEmpresa.run("98.765.432/0001-10", "Tecnologia Itajubense S.A.", 4500000);
    const e2 = e2Result.changes > 0 ? e2Result.lastInsertRowid : null;
    if (e2) {
      insertContato.run(e2, "Rodrigo Meirelles", "35997248658", "CEO");
      
      const pendingChecklist = JSON.stringify([
        { item: "Imóvel", validado: false },
        { item: "Recebíveis", validado: false },
        { item: "Aval dos sócios", validado: false },
        { item: "Veículos", validado: false },
        { item: "Equipamentos", validado: false }
      ]);
      insertOportunidade.run(e2, 350000, 320000, 14000, "recebido", "aprovada", pendingChecklist, "Capital de Giro BDMG", 4.0, "2025-03-05");
    }

    // Metalúrgica Mantiqueira
    const e3Result = insertEmpresa.run("45.678.901/0001-23", "Metalúrgica Mantiqueira Eireli", 2800000);
    const e3 = e3Result.changes > 0 ? e3Result.lastInsertRowid : null;
    if (e3) {
      insertContato.run(e3, "Carlos Souza", "35977665544", "Diretor de Operações");
      
      const pendingChecklist = JSON.stringify([
        { item: "Imóvel", validado: false },
        { item: "Recebíveis", validado: false },
        { item: "Aval dos sócios", validado: false },
        { item: "Veículos", validado: false },
        { item: "Equipamentos", validado: false }
      ]);
      insertOportunidade.run(e3, 500000, null, 20000, "pendente", "aguardando_documentacao", pendingChecklist, "Financiamento de Veículos", 3.0, "2025-04-20");
    }

    // Seed initial tasks
    const insertTarefa = db.prepare(`
      INSERT INTO tarefas (oportunidade_id, cliente_nome, tipo, descricao, data_vencimento, concluida)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    insertTarefa.run(null, "Café das Alterosas Ltda", "Manual", "Enviar proposta comercial atualizada", "2025-06-10", 0);
    insertTarefa.run(null, "Tecnologia Itajubense S.A.", "Reenvio", "Reenviar documentação pendente BDMG", "2025-06-05", 0);
    insertTarefa.run(null, "Metalúrgica Mantiqueira Eireli", "Manual", "Agendar reunião para apresentação de garantias", "2025-06-15", 0);
  })();
}

export default db;
