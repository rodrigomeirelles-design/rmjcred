export interface Empresa {
  id: number;
  cnpj: string;
  razao_social: string;
  faturamento: number;
  created_at: string;
}

export interface Contato {
  id: number;
  empresa_id: number;
  nome: string;
  whatsapp: string;
  cargo: string;
}

export interface GarantiaItem {
  item: string;
  validado: boolean;
}

export interface Oportunidade {
  id: number;
  empresa_id: number;
  valor_solicitado: number;
  valor_aprovado: number | null;
  comissao_esperada: number;
  status_repasse: 'pendente' | 'recebido';
  coluna_kanban: string;
  motivo_perda: string | null;
  data_recusa: string | null;
  checklist_garantias: string; // JSON string representation of GarantiaItem[]
  followup_data: string | null;
  created_at: string;
  updated_at: string;
  
  // Joined fields
  razao_social?: string;
  cnpj?: string;
}
