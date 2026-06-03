"use client";

import { useState } from "react";
import Link from "next/link";

interface Socio {
  dados: {
    nome: string;
    cpf: string;
    rg: string;
    participacao: string;
    nascimento: string;
    estado_civil: string;
    regime: string;
    profissao: string;
    nacionalidade: string;
    email: string;
    telefone: string;
    renda: string;
    cep: string;
    logradouro: string;
    numero: string;
    complemento: string;
    bairro: string;
    cidade: string;
    uf: string;
    imovel_tipo: string;
    imovel_valor: string;
    veiculo_placas: string;
  };
  conjuge: {
    nome: string;
    cpf: string;
    rg: string;
    nascimento: string;
    telefone: string;
    email: string;
    imovel_tipo: string;
    imovel_valor: string;
    veiculo_placas: string;
    renda: string;
    incluir_renda: string;
  } | null;
}

export default function CadastroBdmg() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  // Dados da Empresa
  const [empresa, setEmpresa] = useState({
    emp_razao: "",
    emp_fantasia: "",
    emp_cnpj: "",
    emp_funcionarios: "",
    emp_faturamento: "",
    emp_repr_nome: "",
    emp_repr_cpf: "",
    emp_email: "",
    emp_telefone: "",
    emp_cep: "",
    emp_logradouro: "",
    emp_numero: "",
    emp_complemento: "",
    emp_bairro: "",
    emp_cidade: "",
    emp_uf: "",
    emp_imovel: "Não",
    emp_imovel_tipo: "Não possui",
    emp_imovel_valor: "",
  });

  // Dados dos Sócios
  const [socios, setSocios] = useState<Socio[]>([
    {
      dados: {
        nome: "",
        cpf: "",
        rg: "",
        participacao: "",
        nascimento: "",
        estado_civil: "Solteiro(a)",
        regime: "Não aplicável",
        profissao: "",
        nacionalidade: "Brasileiro(a)",
        email: "",
        telefone: "",
        renda: "",
        cep: "",
        logradouro: "",
        numero: "",
        complemento: "",
        bairro: "",
        cidade: "",
        uf: "",
        imovel_tipo: "Não possui",
        imovel_valor: "",
        veiculo_placas: "",
      },
      conjuge: null,
    },
  ]);

  // Conta Bancária
  const [bancario, setBancario] = useState({
    banco_nome: "",
    banco_numero: "",
    banco_agencia: "",
    banco_conta: "",
    banco_digito: "",
  });

  // Observações
  const [observacoes, setObservacoes] = useState({
    obs_finais: "",
    aceite_lgpd: false,
  });

  // Validador simples de CPF
  const validarCPF = (cpf: string) => {
    const clean = cpf.replace(/\D/g, "");
    if (clean.length !== 11 || /^(\d)\1+$/.test(clean)) return false;
    let soma = 0;
    for (let i = 1; i <= 9; i++) soma += parseInt(clean[i - 1]) * (11 - i);
    let resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(clean[9])) return false;
    soma = 0;
    for (let i = 1; i <= 10; i++) soma += parseInt(clean[i - 1]) * (12 - i);
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    return resto === parseInt(clean[10]);
  };

  // Validador simples de CNPJ
  const validarCNPJ = (cnpj: string) => {
    const clean = cnpj.replace(/\D/g, "");
    if (clean.length !== 14 || /^(\d)\1+$/.test(clean)) return false;
    const calc = (t: number) => {
      let m = t - 7;
      let soma = 0;
      for (let i = t; i >= 1; i--) {
        soma += parseInt(clean[t - i]) * m--;
        if (m < 2) m = 9;
      }
      const r = soma % 11;
      return r < 2 ? 0 : 11 - r;
    };
    return calc(12) === parseInt(clean[12]) && calc(13) === parseInt(clean[13]);
  };

  // Busca CEP automático via ViaCEP
  const buscarCEP = async (cep: string, isEmpresa: boolean, socioIndex?: number) => {
    const clean = cep.replace(/\D/g, "");
    if (clean.length !== 8) return;

    try {
      const res = await fetch(`https://viacep.com.br/ws/${clean}/json/`);
      const data = await res.json();
      if (!data.erro) {
        if (isEmpresa) {
          setEmpresa((prev) => ({
            ...prev,
            emp_logradouro: data.logradouro,
            emp_bairro: data.bairro,
            emp_cidade: data.localidade,
            emp_uf: data.uf,
          }));
        } else if (socioIndex !== undefined) {
          const list = [...socios];
          list[socioIndex].dados.logradouro = data.logradouro;
          list[socioIndex].dados.bairro = data.bairro;
          list[socioIndex].dados.cidade = data.localidade;
          list[socioIndex].dados.uf = data.uf;
          setSocios(list);
        }
      }
    } catch (e) {
      console.error("Erro ao buscar CEP", e);
    }
  };

  // Máscaras de preenchimento
  const maskCNPJ = (v: string) =>
    v
      .replace(/\D/g, "")
      .replace(/^(\d{2})(\d)/, "$1.$2")
      .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
      .replace(/\.(\d{3})(\d)/, ".$1/$2")
      .replace(/(\d{4})(\d)/, "$1-$2")
      .substring(0, 18);

  const maskCPF = (v: string) =>
    v
      .replace(/\D/g, "")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
      .replace(/(\d{3})\.(\d{3})\.(\d{3})(\d)/, "$1.$2.$3-$4")
      .substring(0, 14);

  const maskCEP = (v: string) =>
    v
      .replace(/\D/g, "")
      .replace(/(\d{5})(\d)/, "$1-$2")
      .substring(0, 9);

  const maskPhone = (v: string) => {
    const clean = v.replace(/\D/g, "");
    if (clean.length <= 10) {
      return clean
        .replace(/(\d{2})(\d)/, "($1) $2")
        .replace(/(\d{4})(\d)/, "$1-$2")
        .substring(0, 14);
    }
    return clean
      .replace(/(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{5})(\d)/, "$1-$2")
      .substring(0, 15);
  };

  const handleSocioChange = (index: number, key: string, value: string) => {
    const list = [...socios];
    // @ts-ignore
    list[index].dados[key] = value;

    if (key === "estado_civil") {
      if (value === "Casado(a)" || value === "União estável") {
        list[index].conjuge = {
          nome: "",
          cpf: "",
          rg: "",
          nascimento: "",
          telefone: "",
          email: "",
          imovel_tipo: "Não possui",
          imovel_valor: "",
          veiculo_placas: "",
          renda: "",
          incluir_renda: "Não",
        };
      } else {
        list[index].conjuge = null;
      }
    }
    setSocios(list);
  };

  const handleConjugeChange = (index: number, key: string, value: string) => {
    const list = [...socios];
    if (list[index].conjuge) {
      // @ts-ignore
      list[index].conjuge[key] = value;
    }
    setSocios(list);
  };

  const addSocio = () => {
    if (socios.length >= 5) return alert("Limite máximo de 5 sócios atingido.");
    setSocios([
      ...socios,
      {
        dados: {
          nome: "",
          cpf: "",
          rg: "",
          participacao: "",
          nascimento: "",
          estado_civil: "Solteiro(a)",
          regime: "Não aplicável",
          profissao: "",
          nacionalidade: "Brasileiro(a)",
          email: "",
          telefone: "",
          renda: "",
          cep: "",
          logradouro: "",
          numero: "",
          complemento: "",
          bairro: "",
          cidade: "",
          uf: "",
          imovel_tipo: "Não possui",
          imovel_valor: "",
          veiculo_placas: "",
        },
        conjuge: null,
      },
    ]);
  };

  const removeSocio = (index: number) => {
    if (socios.length === 1) return alert("A proposta deve possuir ao menos 1 sócio.");
    setSocios(socios.filter((_, i) => i !== index));
  };

  const validateStep = () => {
    setError("");

    if (step === 1) {
      if (!empresa.emp_razao || !empresa.emp_cnpj || !empresa.emp_faturamento || !empresa.emp_email || !empresa.emp_telefone) {
        setError("Preencha todos os campos obrigatórios da empresa.");
        return false;
      }
      if (!validarCNPJ(empresa.emp_cnpj)) {
        setError("CNPJ informado é inválido.");
        return false;
      }
      if (!validarCPF(empresa.emp_repr_cpf)) {
        setError("CPF do Representante é inválido.");
        return false;
      }
    }

    if (step === 2) {
      let totalPart = 0;
      for (let i = 0; i < socios.length; i++) {
        const s = socios[i];
        if (!s.dados.nome || !s.dados.cpf || !s.dados.participacao || !s.dados.renda) {
          setError(`Preencha todos os campos obrigatórios do Sócio ${i + 1}.`);
          return false;
        }
        if (!validarCPF(s.dados.cpf)) {
          setError(`CPF do Sócio ${i + 1} é inválido.`);
          return false;
        }
        totalPart += parseFloat(s.dados.participacao.replace(",", ".")) || 0;

        if (s.conjuge) {
          if (!s.conjuge.nome || !s.conjuge.cpf) {
            setError(`Preencha os campos obrigatórios do cônjuge do Sócio ${i + 1}.`);
            return false;
          }
          if (!validarCPF(s.conjuge.cpf)) {
            setError(`CPF do cônjuge do Sócio ${i + 1} é inválido.`);
            return false;
          }
        }
      }
      if (totalPart > 100) {
        setError("A soma da participação societária dos sócios cadastrados não pode exceder 100%.");
        return false;
      }
    }

    if (step === 3) {
      if (!bancario.banco_nome || !bancario.banco_agencia || !bancario.banco_conta) {
        setError("Preencha as informações bancárias para recebimento do crédito.");
        return false;
      }
    }

    return true;
  };

  const handleNext = () => {
    if (validateStep()) {
      setStep((prev) => prev + 1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep()) return;

    if (!observacoes.aceite_lgpd) {
      setError("Você deve ler e aceitar a declaração da LGPD para submeter o cadastro.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/cadastro/bdmg", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          empresa,
          socios,
          bancario,
          observacoes,
        }),
      });

      const result = await res.json();
      if (result.success) {
        setSuccess(true);
      } else {
        setError(result.error || "Ocorreu um erro ao enviar sua proposta.");
      }
    } catch (err) {
      setError("Erro interno de comunicação com a API.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="container" style={{ minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div className="glass-panel" style={{ maxWidth: "600px", padding: "3rem", borderRadius: "var(--radius-md)", textAlign: "center", backgroundColor: "var(--neutral-white)" }}>
          <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>🎉</div>
          <h2 style={{ color: "var(--primary-dark)", marginBottom: "1rem" }}>Ficha Cadastral Submetida!</h2>
          <p style={{ color: "var(--neutral-muted)", lineHeight: "1.7", marginBottom: "2rem" }}>
            Seus dados fiscais e cadastrais foram registrados com sucesso em nossa central segura. Nosso time técnico da <strong>RMJ Soluções de Crédito</strong> iniciará a estruturação do seu limite junto ao BDMG imediatamente.
          </p>
          <p style={{ color: "var(--neutral-muted)", fontSize: "0.9rem" }}>
            Entraremos em contato em breve via WhatsApp ou e-mail para confirmação e combinação dos documentos fiscais extras.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: "var(--neutral-light)", minHeight: "90vh", padding: "3rem 0" }}>
      <div className="container" style={{ maxWidth: "900px" }}>
        
        {/* Topo do Cadastro */}
        <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          <Link href="/" className="back-link" style={{ fontSize: "0.9rem", color: "var(--primary-color)", display: "inline-block", marginBottom: "1rem" }}>
            &larr; Voltar para a Home
          </Link>
          <h1 style={{ fontSize: "2.2rem", color: "var(--primary-dark)", margin: 0 }}>
            Ficha de Crédito <span style={{ color: "var(--secondary-color)", fontWeight: "normal", fontStyle: "italic" }}>PJ BDMG</span>
          </h1>
          <p style={{ color: "var(--neutral-muted)", marginTop: "0.5rem", fontSize: "1.05rem" }}>
            Preencha seus dados corporativos de forma segura. Dados criptografados e protegidos pela LGPD.
          </p>
        </div>

        {/* Stepper Visual */}
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "2rem", gap: "0.5rem" }}>
          {["1. Empresa", "2. Sócios", "3. Conta Bancária", "4. Finalizar"].map((label, idx) => {
            const stepNum = idx + 1;
            const isActive = step === stepNum;
            const isDone = step > stepNum;
            return (
              <div
                key={label}
                style={{
                  flex: 1,
                  padding: "0.75rem",
                  borderRadius: "var(--radius-sm)",
                  textAlign: "center",
                  fontSize: "0.85rem",
                  fontWeight: "bold",
                  backgroundColor: isActive
                    ? "var(--primary-dark)"
                    : isDone
                    ? "#d6f0e2"
                    : "var(--neutral-white)",
                  color: isActive ? "#fff" : isDone ? "#1e7e4e" : "var(--neutral-muted)",
                  border: `1px solid ${isActive ? "var(--primary-dark)" : "var(--neutral-border)"}`,
                }}
              >
                {label}
              </div>
            );
          })}
        </div>

        {error && (
          <div style={{ backgroundColor: "#fff5f5", color: "var(--accent-color)", border: "1px solid #fed7d7", padding: "1rem", borderRadius: "var(--radius-md)", marginBottom: "1.5rem", fontSize: "0.9rem" }}>
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="glass-panel" style={{ padding: "3rem", borderRadius: "var(--radius-md)", backgroundColor: "var(--neutral-white)", boxShadow: "0 10px 30px rgba(17,34,63,0.04)" }}>
          
          {/* ETAPA 1: DADOS DA EMPRESA */}
          {step === 1 && (
            <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
              <h2 style={{ fontSize: "1.5rem", color: "var(--primary-dark)", borderBottom: "2px solid var(--neutral-border)", paddingBottom: "0.5rem" }}>Dados Cadastrais da Empresa</h2>
              
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
                  <label style={{ fontSize: "0.85rem", fontWeight: "bold" }}>Razão Social *</label>
                  <input type="text" required value={empresa.emp_razao} onChange={(e) => setEmpresa({ ...empresa, emp_razao: e.target.value })} placeholder="Nome oficial do CNPJ" style={{ padding: "0.75rem", border: "1px solid var(--neutral-border)", borderRadius: "var(--radius-sm)" }} />
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
                  <label style={{ fontSize: "0.85rem", fontWeight: "bold" }}>Nome Fantasia</label>
                  <input type="text" value={empresa.emp_fantasia} onChange={(e) => setEmpresa({ ...empresa, emp_fantasia: e.target.value })} placeholder="Nome comercial" style={{ padding: "0.75rem", border: "1px solid var(--neutral-border)", borderRadius: "var(--radius-sm)" }} />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
                  <label style={{ fontSize: "0.85rem", fontWeight: "bold" }}>CNPJ *</label>
                  <input type="text" required value={empresa.emp_cnpj} onChange={(e) => setEmpresa({ ...empresa, emp_cnpj: maskCNPJ(e.target.value) })} placeholder="00.000.000/0000-00" style={{ padding: "0.75rem", border: "1px solid var(--neutral-border)", borderRadius: "var(--radius-sm)" }} />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
                    <label style={{ fontSize: "0.85rem", fontWeight: "bold" }}>Nº Funcionários *</label>
                    <input type="number" required value={empresa.emp_funcionarios} onChange={(e) => setEmpresa({ ...empresa, emp_funcionarios: e.target.value })} placeholder="Ex: 5" style={{ padding: "0.75rem", border: "1px solid var(--neutral-border)", borderRadius: "var(--radius-sm)" }} />
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
                    <label style={{ fontSize: "0.85rem", fontWeight: "bold" }}>Faturamento Médio (R$) *</label>
                    <input type="text" required value={empresa.emp_faturamento} onChange={(e) => setEmpresa({ ...empresa, emp_faturamento: e.target.value })} placeholder="Ex: 50.000" style={{ padding: "0.75rem", border: "1px solid var(--neutral-border)", borderRadius: "var(--radius-sm)" }} />
                  </div>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
                  <label style={{ fontSize: "0.85rem", fontWeight: "bold" }}>Representante Legal *</label>
                  <input type="text" required value={empresa.emp_repr_nome} onChange={(e) => setEmpresa({ ...empresa, emp_repr_nome: e.target.value })} placeholder="Nome do titular ou procurador" style={{ padding: "0.75rem", border: "1px solid var(--neutral-border)", borderRadius: "var(--radius-sm)" }} />
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
                  <label style={{ fontSize: "0.85rem", fontWeight: "bold" }}>CPF do Representante *</label>
                  <input type="text" required value={empresa.emp_repr_cpf} onChange={(e) => setEmpresa({ ...empresa, emp_repr_cpf: maskCPF(e.target.value) })} placeholder="000.000.000-00" style={{ padding: "0.75rem", border: "1px solid var(--neutral-border)", borderRadius: "var(--radius-sm)" }} />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
                  <label style={{ fontSize: "0.85rem", fontWeight: "bold" }}>E-mail da Empresa *</label>
                  <input type="email" required value={empresa.emp_email} onChange={(e) => setEmpresa({ ...empresa, emp_email: e.target.value })} placeholder="financeiro@empresa.com" style={{ padding: "0.75rem", border: "1px solid var(--neutral-border)", borderRadius: "var(--radius-sm)" }} />
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
                  <label style={{ fontSize: "0.85rem", fontWeight: "bold" }}>Telefone / WhatsApp *</label>
                  <input type="text" required value={empresa.emp_telefone} onChange={(e) => setEmpresa({ ...empresa, emp_telefone: maskPhone(e.target.value) })} placeholder="(35) 99999-9999" style={{ padding: "0.75rem", border: "1px solid var(--neutral-border)", borderRadius: "var(--radius-sm)" }} />
                </div>
              </div>

              {/* Endereço por CEP */}
              <div style={{ display: "grid", gridTemplateColumns: "150px 1fr 120px", gap: "1rem" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
                  <label style={{ fontSize: "0.85rem", fontWeight: "bold" }}>CEP *</label>
                  <input type="text" required value={empresa.emp_cep} onChange={(e) => {
                    const v = maskCEP(e.target.value);
                    setEmpresa({ ...empresa, emp_cep: v });
                    if (v.length === 9) buscarCEP(v, true);
                  }} placeholder="37500-000" style={{ padding: "0.75rem", border: "1px solid var(--neutral-border)", borderRadius: "var(--radius-sm)" }} />
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
                  <label style={{ fontSize: "0.85rem", fontWeight: "bold" }}>Rua / Logradouro *</label>
                  <input type="text" required value={empresa.emp_logradouro} onChange={(e) => setEmpresa({ ...empresa, emp_logradouro: e.target.value })} placeholder="Preenchimento automático" style={{ padding: "0.75rem", border: "1px solid var(--neutral-border)", borderRadius: "var(--radius-sm)" }} />
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
                  <label style={{ fontSize: "0.85rem", fontWeight: "bold" }}>Número *</label>
                  <input type="text" required value={empresa.emp_numero} onChange={(e) => setEmpresa({ ...empresa, emp_numero: e.target.value })} placeholder="Nº 193" style={{ padding: "0.75rem", border: "1px solid var(--neutral-border)", borderRadius: "var(--radius-sm)" }} />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 100px", gap: "1rem" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
                  <label style={{ fontSize: "0.85rem", fontWeight: "bold" }}>Bairro *</label>
                  <input type="text" required value={empresa.emp_bairro} onChange={(e) => setEmpresa({ ...empresa, emp_bairro: e.target.value })} placeholder="Bairro" style={{ padding: "0.75rem", border: "1px solid var(--neutral-border)", borderRadius: "var(--radius-sm)" }} />
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
                  <label style={{ fontSize: "0.85rem", fontWeight: "bold" }}>Cidade *</label>
                  <input type="text" required value={empresa.emp_cidade} onChange={(e) => setEmpresa({ ...empresa, emp_cidade: e.target.value })} placeholder="Itajubá" style={{ padding: "0.75rem", border: "1px solid var(--neutral-border)", borderRadius: "var(--radius-sm)" }} />
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
                  <label style={{ fontSize: "0.85rem", fontWeight: "bold" }}>UF *</label>
                  <input type="text" required maxLength={2} value={empresa.emp_uf} onChange={(e) => setEmpresa({ ...empresa, emp_uf: e.target.value.toUpperCase() })} placeholder="MG" style={{ padding: "0.75rem", border: "1px solid var(--neutral-border)", borderRadius: "var(--radius-sm)", textAlign: "center" }} />
                </div>
              </div>

              {/* Bens da Empresa */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1.5fr 1fr", gap: "1rem" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
                  <label style={{ fontSize: "0.85rem", fontWeight: "bold" }}>Possui Imóvel no CNPJ? *</label>
                  <select value={empresa.emp_imovel} onChange={(e) => setEmpresa({ ...empresa, emp_imovel: e.target.value })} style={{ padding: "0.75rem", border: "1px solid var(--neutral-border)", borderRadius: "var(--radius-sm)" }}>
                    <option value="Sim">Sim</option>
                    <option value="Não">Não</option>
                  </select>
                </div>
                {empresa.emp_imovel === "Sim" && (
                  <>
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
                      <label style={{ fontSize: "0.85rem", fontWeight: "bold" }}>Tipo de Comprovação</label>
                      <select value={empresa.emp_imovel_tipo} onChange={(e) => setEmpresa({ ...empresa, emp_imovel_tipo: e.target.value })} style={{ padding: "0.75rem", border: "1px solid var(--neutral-border)", borderRadius: "var(--radius-sm)" }}>
                        <option value="Escritura/Matrícula">Matrícula Registrada</option>
                        <option value="Contrato de Compra/Venda">Contrato Particular</option>
                        <option value="IPTU">IPTU no CNPJ</option>
                      </select>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
                      <label style={{ fontSize: "0.85rem", fontWeight: "bold" }}>Valor Estimado (R$)</label>
                      <input type="text" value={empresa.emp_imovel_valor} onChange={(e) => setEmpresa({ ...empresa, emp_imovel_valor: e.target.value })} placeholder="Ex: 500.000" style={{ padding: "0.75rem", border: "1px solid var(--neutral-border)", borderRadius: "var(--radius-sm)" }} />
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {/* ETAPA 2: DADOS DOS SÓCIOS */}
          {step === 2 && (
            <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "2px solid var(--neutral-border)", paddingBottom: "0.5rem" }}>
                <h2 style={{ fontSize: "1.5rem", color: "var(--primary-dark)", margin: 0 }}>Sócios da Empresa</h2>
                <button type="button" onClick={addSocio} className="btn btn-ghost" style={{ fontSize: "0.85rem", padding: "0.4rem 0.8rem" }}>
                  + Adicionar Sócio
                </button>
              </div>

              {socios.map((socio, idx) => (
                <div key={idx} style={{ padding: "2rem", backgroundColor: "var(--neutral-light)", borderRadius: "var(--radius-md)", border: "1px solid var(--neutral-border)", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <h3 style={{ margin: 0, color: "var(--primary-color)" }}>Sócio #{idx + 1}</h3>
                    {socios.length > 1 && (
                      <button type="button" onClick={() => removeSocio(idx)} style={{ color: "var(--accent-color)", background: "none", border: "none", cursor: "pointer", fontSize: "0.85rem" }}>
                        Excluir Sócio
                      </button>
                    )}
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: "1rem" }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
                      <label style={{ fontSize: "0.85rem", fontWeight: "bold" }}>Nome Completo *</label>
                      <input type="text" required value={socio.dados.nome} onChange={(e) => handleSocioChange(idx, "nome", e.target.value)} placeholder="Como no CPF" style={{ padding: "0.75rem", border: "1px solid var(--neutral-border)", borderRadius: "var(--radius-sm)" }} />
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
                      <label style={{ fontSize: "0.85rem", fontWeight: "bold" }}>CPF *</label>
                      <input type="text" required value={socio.dados.cpf} onChange={(e) => handleSocioChange(idx, "cpf", maskCPF(e.target.value))} placeholder="000.000.000-00" style={{ padding: "0.75rem", border: "1px solid var(--neutral-border)", borderRadius: "var(--radius-sm)" }} />
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
                      <label style={{ fontSize: "0.85rem", fontWeight: "bold" }}>% Sociedade *</label>
                      <input type="text" required value={socio.dados.participacao} onChange={(e) => handleSocioChange(idx, "participacao", e.target.value)} placeholder="Ex: 50" style={{ padding: "0.75rem", border: "1px solid var(--neutral-border)", borderRadius: "var(--radius-sm)" }} />
                    </div>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1.5fr 1.5fr", gap: "1rem" }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
                      <label style={{ fontSize: "0.85rem", fontWeight: "bold" }}>Data Nascimento *</label>
                      <input type="date" required value={socio.dados.nascimento} onChange={(e) => handleSocioChange(idx, "nascimento", e.target.value)} style={{ padding: "0.75rem", border: "1px solid var(--neutral-border)", borderRadius: "var(--radius-sm)" }} />
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
                      <label style={{ fontSize: "0.85rem", fontWeight: "bold" }}>Estado Civil *</label>
                      <select value={socio.dados.estado_civil} onChange={(e) => handleSocioChange(idx, "estado_civil", e.target.value)} style={{ padding: "0.75rem", border: "1px solid var(--neutral-border)", borderRadius: "var(--radius-sm)" }}>
                        <option value="Solteiro(a)">Solteiro(a)</option>
                        <option value="Casado(a)">Casado(a)</option>
                        <option value="União estável">União estável</option>
                        <option value="Divorciado(a)">Divorciado(a)</option>
                        <option value="Viúvo(a)">Viúvo(a)</option>
                      </select>
                    </div>
                    {socio.conjuge && (
                      <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
                        <label style={{ fontSize: "0.85rem", fontWeight: "bold" }}>Regime de Casamento</label>
                        <select value={socio.dados.regime} onChange={(e) => handleSocioChange(idx, "regime", e.target.value)} style={{ padding: "0.75rem", border: "1px solid var(--neutral-border)", borderRadius: "var(--radius-sm)" }}>
                          <option value="Comunhão parcial de bens">Comunhão parcial de bens</option>
                          <option value="Comunhão universal de bens">Comunhão universal de bens</option>
                          <option value="Separação total de bens">Separação total de bens</option>
                        </select>
                      </div>
                    )}
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
                      <label style={{ fontSize: "0.85rem", fontWeight: "bold" }}>E-mail *</label>
                      <input type="email" required value={socio.dados.email} onChange={(e) => handleSocioChange(idx, "email", e.target.value)} placeholder="email@socio.com" style={{ padding: "0.75rem", border: "1px solid var(--neutral-border)", borderRadius: "var(--radius-sm)" }} />
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
                      <label style={{ fontSize: "0.85rem", fontWeight: "bold" }}>Telefone *</label>
                      <input type="text" required value={socio.dados.telefone} onChange={(e) => handleSocioChange(idx, "telefone", maskPhone(e.target.value))} placeholder="(35) 99999-9999" style={{ padding: "0.75rem", border: "1px solid var(--neutral-border)", borderRadius: "var(--radius-sm)" }} />
                    </div>
                  </div>

                  {/* Campo de Renda do Sócio com Balão Motivacional */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "1.5rem", alignItems: "start" }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
                      <label style={{ fontSize: "0.85rem", fontWeight: "bold" }}>Renda Mensal (Imposto de Renda) *</label>
                      <input type="text" required value={socio.dados.renda} onChange={(e) => handleSocioChange(idx, "renda", e.target.value)} placeholder="Ex: 15.000" style={{ padding: "0.75rem", border: "1px solid var(--neutral-border)", borderRadius: "var(--radius-sm)" }} />
                    </div>
                    <div style={{ fontSize: "0.8rem", color: "#1e5a96", backgroundColor: "#e8f2ff", border: "1px solid #b8d4f5", borderRadius: "var(--radius-sm)", padding: "0.75rem", lineHeight: "1.4" }}>
                      <strong>Dica da RMJ:</strong> Informar a sua renda exatamente em conformidade com o IRPF declarado acelera a aprovação e evita pendências cadastrais na auditoria bancária.
                    </div>
                  </div>

                  {/* Campo de Bens do Sócio com Balão Motivacional */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem" }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
                      <label style={{ fontSize: "0.85rem", fontWeight: "bold" }}>Imóvel Próprio?</label>
                      <select value={socio.dados.imovel_tipo} onChange={(e) => handleSocioChange(idx, "imovel_tipo", e.target.value)} style={{ padding: "0.75rem", border: "1px solid var(--neutral-border)", borderRadius: "var(--radius-sm)" }}>
                        <option value="Não possui">Não possui</option>
                        <option value="Escritura/Matrícula">Matrícula no IRPF</option>
                        <option value="Contrato de Compra">Contrato de Compra</option>
                        <option value="IPTU">IPTU em nome</option>
                      </select>
                    </div>
                    {socio.dados.imovel_tipo !== "Não possui" && (
                      <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
                        <label style={{ fontSize: "0.85rem", fontWeight: "bold" }}>Valor do Imóvel (R$)</label>
                        <input type="text" value={socio.dados.imovel_valor} onChange={(e) => handleSocioChange(idx, "imovel_valor", e.target.value)} placeholder="Ex: 350.000" style={{ padding: "0.75rem", border: "1px solid var(--neutral-border)", borderRadius: "var(--radius-sm)" }} />
                      </div>
                    )}
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
                      <label style={{ fontSize: "0.85rem", fontWeight: "bold" }}>Placa de Veículos (IRPF)</label>
                      <input type="text" value={socio.dados.veiculo_placas} onChange={(e) => handleSocioChange(idx, "veiculo_placas", e.target.value.toUpperCase())} placeholder="Ex: ABC1D23" style={{ padding: "0.75rem", border: "1px solid var(--neutral-border)", borderRadius: "var(--radius-sm)" }} />
                    </div>
                  </div>
                  
                  <div style={{ fontSize: "0.8rem", color: "#1e5a96", backgroundColor: "#e8f2ff", border: "1px solid #b8d4f5", borderRadius: "var(--radius-sm)", padding: "0.75rem", lineHeight: "1.4" }}>
                    <strong>Solidez Cadastral:</strong> Listar as placas dos veículos ou declarar o tipo de comprovante de bens próprios atua como fator redutor de risco de crédito, auxiliando na liberação de limites expressivos e na redução de taxas de juros.
                  </div>

                  {/* Endereço do Sócio */}
                  <div style={{ display: "grid", gridTemplateColumns: "150px 1fr 120px", gap: "1rem" }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
                      <label style={{ fontSize: "0.85rem", fontWeight: "bold" }}>CEP Sócio *</label>
                      <input type="text" required value={socio.dados.cep} onChange={(e) => {
                        const v = maskCEP(e.target.value);
                        handleSocioChange(idx, "cep", v);
                        if (v.length === 9) buscarCEP(v, false, idx);
                      }} placeholder="37500-000" style={{ padding: "0.75rem", border: "1px solid var(--neutral-border)", borderRadius: "var(--radius-sm)" }} />
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
                      <label style={{ fontSize: "0.85rem", fontWeight: "bold" }}>Rua / Logradouro *</label>
                      <input type="text" required value={socio.dados.logradouro} onChange={(e) => handleSocioChange(idx, "logradouro", e.target.value)} placeholder="Logradouro" style={{ padding: "0.75rem", border: "1px solid var(--neutral-border)", borderRadius: "var(--radius-sm)" }} />
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
                      <label style={{ fontSize: "0.85rem", fontWeight: "bold" }}>Número *</label>
                      <input type="text" required value={socio.dados.numero} onChange={(e) => handleSocioChange(idx, "numero", e.target.value)} placeholder="Número" style={{ padding: "0.75rem", border: "1px solid var(--neutral-border)", borderRadius: "var(--radius-sm)" }} />
                    </div>
                  </div>

                  {/* Bloco Dinâmico do Cônjuge se Casado */}
                  {socio.conjuge && (
                    <div style={{ marginTop: "1rem", padding: "1.5rem", border: "1px dashed var(--secondary-color)", borderRadius: "var(--radius-sm)", backgroundColor: "#fff8f2", display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                      <h4 style={{ margin: 0, color: "var(--secondary-color)" }}>Dados do Cônjuge (Sócio #{idx + 1})</h4>
                      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: "1rem" }}>
                        <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
                          <label style={{ fontSize: "0.85rem", fontWeight: "bold" }}>Nome Completo Cônjuge *</label>
                          <input type="text" required value={socio.conjuge.nome} onChange={(e) => handleConjugeChange(idx, "nome", e.target.value)} placeholder="Nome" style={{ padding: "0.75rem", border: "1px solid var(--neutral-border)", borderRadius: "var(--radius-sm)" }} />
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
                          <label style={{ fontSize: "0.85rem", fontWeight: "bold" }}>CPF Cônjuge *</label>
                          <input type="text" required value={socio.conjuge.cpf} onChange={(e) => handleConjugeChange(idx, "cpf", maskCPF(e.target.value))} placeholder="000.000.000-00" style={{ padding: "0.75rem", border: "1px solid var(--neutral-border)", borderRadius: "var(--radius-sm)" }} />
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
                          <label style={{ fontSize: "0.85rem", fontWeight: "bold" }}>Data Nascimento *</label>
                          <input type="date" required value={socio.conjuge.nascimento} onChange={(e) => handleConjugeChange(idx, "nascimento", e.target.value)} style={{ padding: "0.75rem", border: "1px solid var(--neutral-border)", borderRadius: "var(--radius-sm)" }} />
                        </div>
                      </div>

                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                        <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
                          <label style={{ fontSize: "0.85rem", fontWeight: "bold" }}>Celular Cônjuge *</label>
                          <input type="text" required value={socio.conjuge.telefone} onChange={(e) => handleConjugeChange(idx, "telefone", maskPhone(e.target.value))} placeholder="(35) 99999-9999" style={{ padding: "0.75rem", border: "1px solid var(--neutral-border)", borderRadius: "var(--radius-sm)" }} />
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
                          <label style={{ fontSize: "0.85rem", fontWeight: "bold" }}>E-mail Cônjuge *</label>
                          <input type="email" required value={socio.conjuge.email} onChange={(e) => handleConjugeChange(idx, "email", e.target.value)} placeholder="email@conjuge.com" style={{ padding: "0.75rem", border: "1px solid var(--neutral-border)", borderRadius: "var(--radius-sm)" }} />
                        </div>
                      </div>
                    </div>
                  )}

                </div>
              ))}
            </div>
          )}

          {/* ETAPA 3: DADOS BANCÁRIOS */}
          {step === 3 && (
            <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
              <h2 style={{ fontSize: "1.5rem", color: "var(--primary-dark)", borderBottom: "2px solid var(--neutral-border)", paddingBottom: "0.5rem" }}>Conta PJ para Liberação do Crédito BDMG</h2>
              
              <p style={{ color: "var(--neutral-muted)", fontSize: "0.9rem" }}>
                A conta indicada abaixo deve pertencer ao mesmo CNPJ solicitante e será a conta oficial homologada para recebimento do recurso contratado.
              </p>

              <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: "1.5rem" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
                  <label style={{ fontSize: "0.85rem", fontWeight: "bold" }}>Banco *</label>
                  <input type="text" required value={bancario.banco_nome} onChange={(e) => setBancario({ ...bancario, banco_nome: e.target.value })} placeholder="Ex: Itaú Unibanco" style={{ padding: "0.75rem", border: "1px solid var(--neutral-border)", borderRadius: "var(--radius-sm)" }} />
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
                  <label style={{ fontSize: "0.85rem", fontWeight: "bold" }}>Código do Banco</label>
                  <input type="text" value={bancario.banco_numero} onChange={(e) => setBancario({ ...bancario, banco_numero: e.target.value })} placeholder="Ex: 341" style={{ padding: "0.75rem", border: "1px solid var(--neutral-border)", borderRadius: "var(--radius-sm)" }} />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr 100px", gap: "1rem" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
                  <label style={{ fontSize: "0.85rem", fontWeight: "bold" }}>Agência *</label>
                  <input type="text" required value={bancario.banco_agencia} onChange={(e) => setBancario({ ...bancario, banco_agencia: e.target.value })} placeholder="Agência" style={{ padding: "0.75rem", border: "1px solid var(--neutral-border)", borderRadius: "var(--radius-sm)" }} />
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
                  <label style={{ fontSize: "0.85rem", fontWeight: "bold" }}>Conta Corrente *</label>
                  <input type="text" required value={bancario.banco_conta} onChange={(e) => setBancario({ ...bancario, banco_conta: e.target.value })} placeholder="Conta" style={{ padding: "0.75rem", border: "1px solid var(--neutral-border)", borderRadius: "var(--radius-sm)" }} />
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
                  <label style={{ fontSize: "0.85rem", fontWeight: "bold" }}>Dígito</label>
                  <input type="text" value={bancario.banco_digito} onChange={(e) => setBancario({ ...bancario, banco_digito: e.target.value })} placeholder="Dígito" style={{ padding: "0.75rem", border: "1px solid var(--neutral-border)", borderRadius: "var(--radius-sm)", textAlign: "center" }} />
                </div>
              </div>
            </div>
          )}

          {/* ETAPA 4: OBSERVACÕES E LGPD */}
          {step === 4 && (
            <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
              <h2 style={{ fontSize: "1.5rem", color: "var(--primary-dark)", borderBottom: "2px solid var(--neutral-border)", paddingBottom: "0.5rem" }}>Confirmação e Declaração da LGPD</h2>
              
              <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
                <label style={{ fontSize: "0.85rem", fontWeight: "bold" }}>Observações ou Dúvidas de Crédito</label>
                <textarea value={observacoes.obs_finais} onChange={(e) => setObservacoes({ ...observacoes, obs_finais: e.target.value })} placeholder="Informe aqui qualquer detalhe adicional do faturamento ou garantias..." style={{ padding: "0.75rem", border: "1px solid var(--neutral-border)", borderRadius: "var(--radius-sm)", minHeight: "100px" }} />
              </div>

              {/* Box de Documentos pendentes */}
              <div style={{ padding: "1.5rem", backgroundColor: "var(--neutral-light)", borderRadius: "var(--radius-sm)", border: "1px solid var(--neutral-border)" }}>
                <h4 style={{ margin: "0 0 0.5rem 0", color: "var(--primary-color)" }}>Documentação Requerida (Próxima etapa):</h4>
                <ul style={{ margin: 0, paddingLeft: "1.25rem", color: "var(--neutral-muted)", fontSize: "0.85rem", lineHeight: "1.6" }}>
                  <li>Relação de Faturamento recente (12 meses) assinada pelo Contador.</li>
                  <li>Declaração PGDAS e extrato do Simples Nacional via e-CAC.</li>
                  <li>Contrato Social Consolidado da empresa.</li>
                  <li>Declaração completa de IRPF dos sócios acompanhada dos recibos de entrega.</li>
                </ul>
              </div>

              <div style={{ display: "flex", gap: "0.75rem", alignItems: "start", marginTop: "1rem" }}>
                <input type="checkbox" id="aceite_lgpd" required checked={observacoes.aceite_lgpd} onChange={(e) => setObservacoes({ ...observacoes, aceite_lgpd: e.target.checked })} style={{ width: "auto", marginTop: "0.25rem", transform: "scale(1.2)" }} />
                <label htmlFor="aceite_lgpd" style={{ fontSize: "0.85rem", color: "var(--neutral-muted)", cursor: "pointer", fontWeight: "normal" }}>
                  Declaro que as informações financeiras e societárias fornecidas acima são verdadeiras. Dou consentimento de forma livre para o tratamento e trânsito seguro destes dados exclusivamente para fins de análise cadastral e aprovação de crédito corporativo junto ao BDMG, de acordo com as regras da <strong>LGPD (Lei 13.709/2018)</strong>. *
                </label>
              </div>
            </div>
          )}

          {/* Rodapé de Navegação */}
          <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", marginTop: "2.5rem", paddingTop: "1.5rem", borderTop: "1px solid var(--neutral-border)" }}>
            {step > 1 ? (
              <button type="button" onClick={() => setStep((prev) => prev - 1)} className="btn btn-ghost" style={{ padding: "0.75rem 1.5rem" }}>
                &larr; Voltar
              </button>
            ) : (
              <div />
            )}

            {step < 4 ? (
              <button type="button" onClick={handleNext} className="btn btn-primary" style={{ padding: "0.75rem 1.5rem" }}>
                Avançar &rarr;
              </button>
            ) : (
              <button type="submit" disabled={loading} className="btn btn-accent" style={{ padding: "0.85rem 2rem", fontSize: "0.95rem" }}>
                {loading ? "Processando e Enviando..." : "Submeter Proposta ao BDMG 🚀"}
              </button>
            )}
          </div>

        </form>

      </div>
    </div>
  );
}
