"use client";

import { useState } from "react";
import Link from "next/link";
import { ShieldCheck, ArrowRight, ArrowLeft, Plus, Trash2, CheckCircle2, User, Landmark, Building2, Eye, ShieldAlert } from "lucide-react";

interface Socio {
  dados: {
    nome: string;
    cpf: string;
    rg: string;
    rg_data_emissao: string;
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
    rg_data_emissao: string;
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

  // Validation States for immediate inline feedback
  const [cnpjError, setCnpjError] = useState("");
  const [reprCpfError, setReprCpfError] = useState("");
  const [socioCpfErrors, setSocioCpfErrors] = useState<string[]>([""]);
  const [conjugeCpfErrors, setConjugeCpfErrors] = useState<string[]>([""]);

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
        rg_data_emissao: "",
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
    banco_agencia: "",
    banco_conta: "",
  });

  // Observações
  const [observacoes, setObservacoes] = useState({
    obs_finais: "",
    aceite_lgpd: false,
  });

  // Currency input helper (1 -> 0,01 | 100 -> R$ 1,00)
  const handleCurrencyInput = (value: string) => {
    const clean = value.replace(/\D/g, "");
    if (!clean) return "";
    const cents = parseInt(clean, 10);
    const num = cents / 100;
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(num);
  };

  // Inline CNPJ validator
  const handleCnpjChange = (v: string) => {
    const masked = maskCNPJ(v);
    setEmpresa((prev) => ({ ...prev, emp_cnpj: masked }));
    
    if (masked.length === 18) {
      if (!validarCNPJ(masked)) {
        setCnpjError("CNPJ inválido. Verifique os dígitos.");
      } else {
        setCnpjError("");
      }
    } else {
      setCnpjError("");
    }
  };

  // Inline Representative CPF validator
  const handleReprCpfChange = (v: string) => {
    const masked = maskCPF(v);
    setEmpresa((prev) => ({ ...prev, emp_repr_cpf: masked }));
    
    if (masked.length === 14) {
      if (!validarCPF(masked)) {
        setReprCpfError("CPF inválido.");
      } else {
        setReprCpfError("");
      }
    } else {
      setReprCpfError("");
    }
  };

  // Inline Partner CPF validator
  const handleSocioCpfChange = (idx: number, v: string) => {
    const masked = maskCPF(v);
    handleSocioChange(idx, "cpf", masked);

    const updatedErrors = [...socioCpfErrors];
    if (masked.length === 14) {
      if (!validarCPF(masked)) {
        updatedErrors[idx] = "CPF inválido.";
      } else {
        updatedErrors[idx] = "";
      }
    } else {
      updatedErrors[idx] = "";
    }
    setSocioCpfErrors(updatedErrors);
  };

  // Inline Spouse CPF validator
  const handleConjugeCpfChange = (idx: number, v: string) => {
    const masked = maskCPF(v);
    handleConjugeChange(idx, "cpf", masked);

    const updatedErrors = [...conjugeCpfErrors];
    if (masked.length === 14) {
      if (!validarCPF(masked)) {
        updatedErrors[idx] = "CPF inválido.";
      } else {
        updatedErrors[idx] = "";
      }
    } else {
      updatedErrors[idx] = "";
    }
    setConjugeCpfErrors(updatedErrors);
  };

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
          rg_data_emissao: "",
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
          rg_data_emissao: "",
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
    setSocioCpfErrors([...socioCpfErrors, ""]);
    setConjugeCpfErrors([...conjugeCpfErrors, ""]);
  };

  const removeSocio = (index: number) => {
    if (socios.length === 1) return alert("A proposta deve possuir ao menos 1 sócio.");
    setSocios(socios.filter((_, i) => i !== index));
    setSocioCpfErrors(socioCpfErrors.filter((_, i) => i !== index));
    setConjugeCpfErrors(conjugeCpfErrors.filter((_, i) => i !== index));
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
        if (!s.dados.nome || !s.dados.cpf || !s.dados.rg || !s.dados.rg_data_emissao || !s.dados.participacao || !s.dados.renda) {
          setError(`Preencha todos os campos obrigatórios do Sócio ${i + 1} (incluindo RG e Data de Emissão).`);
          return false;
        }
        if (!validarCPF(s.dados.cpf)) {
          setError(`CPF do Sócio ${i + 1} é inválido.`);
          return false;
        }
        totalPart += parseFloat(s.dados.participacao.replace(",", ".")) || 0;

        if (s.conjuge) {
          if (!s.conjuge.nome || !s.conjuge.cpf || !s.conjuge.rg || !s.conjuge.rg_data_emissao || !s.conjuge.email) {
            setError(`Preencha todos os campos obrigatórios do cônjuge do Sócio ${i + 1} (incluindo RG, Emissão e E-mail).`);
            return false;
          }
          if (!validarCPF(s.conjuge.cpf)) {
            setError(`CPF do cônjuge do Sócio ${i + 1} é inválido.`);
            return false;
          }
          if (s.dados.email.toLowerCase().trim() === s.conjuge.email.toLowerCase().trim()) {
            setError(`O e-mail do cônjuge do Sócio ${i + 1} deve ser diferente do e-mail do próprio sócio.`);
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
        setError("Preencha as informações bancárias completas (Banco, Agência e Conta).");
        return false;
      }
    }

    return true;
  };

  const handleNext = () => {
    if (validateStep()) {
      setStep((prev) => prev + 1);
      window.scrollTo(0, 0);
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
        <div style={{ maxWidth: "600px", padding: "3rem", borderRadius: "20px", textAlign: "center", backgroundColor: "#ffffff", boxShadow: "0 10px 40px rgba(0, 0, 0, 0.05)" }}>
          <div style={{ color: "var(--primary-color)", display: "flex", justifyContent: "center", marginBottom: "1.5rem" }}>
            <CheckCircle2 size={64} style={{ color: "#34c759" }} />
          </div>
          <h2 style={{ color: "var(--primary-dark)", marginBottom: "1rem", fontSize: "1.75rem", fontWeight: 800 }}>Ficha Cadastral Submetida!</h2>
          <p style={{ color: "var(--neutral-muted)", lineHeight: "1.7", marginBottom: "2rem", fontSize: "0.95rem" }}>
            Seus dados fiscais e cadastrais foram registrados com sucesso em nossa central segura. Nosso time técnico da <strong>RMJ Soluções de Crédito</strong> iniciará a estruturação do seu limite junto ao BDMG imediatamente.
          </p>
          <p style={{ color: "var(--neutral-muted)", fontSize: "0.85rem" }}>
            Entraremos em contato em breve via WhatsApp ou e-mail para confirmação e combinação dos documentos fiscais extras.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: "#f5f5f7", minHeight: "90vh", padding: "3rem 0", fontFamily: "var(--font-montserrat), -apple-system, sans-serif" }}>
      <div className="container" style={{ maxWidth: "800px" }}>
        
        {/* Topo do Cadastro - Apple Style Minimal */}
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <Link href="/" style={{ fontSize: "0.9rem", color: "#0071e3", display: "inline-flex", alignItems: "center", gap: "0.25rem", marginBottom: "1rem", fontWeight: "600" }}>
            <ArrowLeft size={14} /> Voltar para a Home
          </Link>
          <h1 style={{ fontSize: "2.5rem", color: "#1d1d1f", fontWeight: 800, letterSpacing: "-0.05em", margin: 0 }}>
            Ficha de Crédito <span style={{ color: "#0071e3", fontWeight: "normal", fontStyle: "italic" }}>PJ BDMG</span>
          </h1>
          <p style={{ color: "#86868b", marginTop: "0.5rem", fontSize: "1.05rem", fontWeight: 500 }}>
            Preencha seus dados corporativos de forma segura e rápida.
          </p>
        </div>

        {/* Stepper Progress Bar Style */}
        <div style={{ display: "flex", gap: "0.5rem", marginBottom: "2.5rem", height: "4px", backgroundColor: "#e8e8ed", borderRadius: "2px", overflow: "hidden" }}>
          {[1, 2, 3, 4].map((stepNum) => (
            <div
              key={stepNum}
              style={{
                flex: 1,
                height: "100%",
                backgroundColor: step >= stepNum ? "#0071e3" : "transparent",
                transition: "background-color 0.4s ease",
              }}
            />
          ))}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "2rem", padding: "0 0.5rem", fontSize: "0.8rem", color: "#86868b", fontWeight: "700", textTransform: "uppercase" }}>
          <span>1. Empresa</span>
          <span>2. Sócios</span>
          <span>3. Dados Bancários</span>
          <span>4. Finalizar</span>
        </div>

        {error && (
          <div style={{ backgroundColor: "#ffeff2", color: "#ff3b30", border: "1px solid #ffccd4", padding: "1rem 1.25rem", borderRadius: "12px", marginBottom: "1.5rem", fontSize: "0.9rem", display: "flex", alignItems: "center", gap: "0.5rem", fontWeight: "600" }}>
            <ShieldAlert size={18} /> {error}
          </div>
        )}

        <form 
          onSubmit={handleSubmit} 
          style={{ 
            padding: "2.5rem", 
            borderRadius: "20px", 
            backgroundColor: "#ffffff", 
            boxShadow: "0 4px 30px rgba(0, 0, 0, 0.02)",
            border: "1px solid #e8e8ed"
          }}
        >
          
          {/* ETAPA 1: DADOS DA EMPRESA */}
          {step === 1 && (
            <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", borderBottom: "1px solid #f5f5f7", paddingBottom: "1rem" }}>
                <Building2 size={24} style={{ color: "#0071e3" }} />
                <h2 style={{ fontSize: "1.5rem", color: "#1d1d1f", fontWeight: "700", margin: 0 }}>Cadastro da Empresa</h2>
              </div>
              
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  <label style={{ fontSize: "0.85rem", fontWeight: "700", color: "#1d1d1f" }}>Razão Social *</label>
                  <input type="text" required className="apple-input" value={empresa.emp_razao} onChange={(e) => setEmpresa({ ...empresa, emp_razao: e.target.value })} placeholder="Ex: Nome Oficial da Empresa Ltda" />
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  <label style={{ fontSize: "0.85rem", fontWeight: "700", color: "#1d1d1f" }}>Nome Fantasia</label>
                  <input type="text" className="apple-input" value={empresa.emp_fantasia} onChange={(e) => setEmpresa({ ...empresa, emp_fantasia: e.target.value })} placeholder="Ex: Nome Comercial" />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  <label style={{ fontSize: "0.85rem", fontWeight: "700", color: "#1d1d1f" }}>CNPJ *</label>
                  <input type="text" required className={`apple-input ${cnpjError ? "input-error" : ""}`} value={empresa.emp_cnpj} onChange={(e) => handleCnpjChange(e.target.value)} placeholder="00.000.000/0000-00" />
                  {cnpjError && <span style={{ color: "#ff3b30", fontSize: "0.75rem", fontWeight: "600" }}>{cnpjError}</span>}
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1.25fr", gap: "1rem" }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                    <label style={{ fontSize: "0.85rem", fontWeight: "700", color: "#1d1d1f" }}>Nº Funcionários *</label>
                    <input type="number" required className="apple-input" value={empresa.emp_funcionarios} onChange={(e) => setEmpresa({ ...empresa, emp_funcionarios: e.target.value })} placeholder="Ex: 5" />
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                    <label style={{ fontSize: "0.85rem", fontWeight: "700", color: "#1d1d1f" }}>Faturamento Médio (R$) *</label>
                    <input type="text" required className="apple-input" value={empresa.emp_faturamento} onChange={(e) => setEmpresa({ ...empresa, emp_faturamento: handleCurrencyInput(e.target.value) })} placeholder="R$ 0,00" />
                  </div>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  <label style={{ fontSize: "0.85rem", fontWeight: "700", color: "#1d1d1f" }}>Representante Legal *</label>
                  <input type="text" required className="apple-input" value={empresa.emp_repr_nome} onChange={(e) => setEmpresa({ ...empresa, emp_repr_nome: e.target.value })} placeholder="Nome do titular ou procurador" />
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  <label style={{ fontSize: "0.85rem", fontWeight: "700", color: "#1d1d1f" }}>CPF do Representante *</label>
                  <input type="text" required className={`apple-input ${reprCpfError ? "input-error" : ""}`} value={empresa.emp_repr_cpf} onChange={(e) => handleReprCpfChange(e.target.value)} placeholder="000.000.000-00" />
                  {reprCpfError && <span style={{ color: "#ff3b30", fontSize: "0.75rem", fontWeight: "600" }}>{reprCpfError}</span>}
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  <label style={{ fontSize: "0.85rem", fontWeight: "700", color: "#1d1d1f" }}>E-mail da Empresa *</label>
                  <input type="email" required className="apple-input" value={empresa.emp_email} onChange={(e) => setEmpresa({ ...empresa, emp_email: e.target.value })} placeholder="financeiro@empresa.com" />
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  <label style={{ fontSize: "0.85rem", fontWeight: "700", color: "#1d1d1f" }}>Telefone / WhatsApp *</label>
                  <input type="text" required className="apple-input" value={empresa.emp_telefone} onChange={(e) => setEmpresa({ ...empresa, emp_telefone: maskPhone(e.target.value) })} placeholder="(35) 99999-9999" />
                </div>
              </div>

              {/* Endereço por CEP */}
              <div style={{ display: "grid", gridTemplateColumns: "130px 1fr 120px", gap: "1rem" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  <label style={{ fontSize: "0.85rem", fontWeight: "700", color: "#1d1d1f" }}>CEP *</label>
                  <input type="text" required className="apple-input" value={empresa.emp_cep} onChange={(e) => {
                    const v = maskCEP(e.target.value);
                    setEmpresa({ ...empresa, emp_cep: v });
                    if (v.length === 9) buscarCEP(v, true);
                  }} placeholder="37500-000" />
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  <label style={{ fontSize: "0.85rem", fontWeight: "700", color: "#1d1d1f" }}>Rua / Logradouro *</label>
                  <input type="text" required className="apple-input" value={empresa.emp_logradouro} onChange={(e) => setEmpresa({ ...empresa, emp_logradouro: e.target.value })} placeholder="Logradouro" />
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  <label style={{ fontSize: "0.85rem", fontWeight: "700", color: "#1d1d1f" }}>Número *</label>
                  <input type="text" required className="apple-input" value={empresa.emp_numero} onChange={(e) => setEmpresa({ ...empresa, emp_numero: e.target.value })} placeholder="Ex: 193" />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 90px", gap: "1rem" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  <label style={{ fontSize: "0.85rem", fontWeight: "700", color: "#1d1d1f" }}>Bairro *</label>
                  <input type="text" required className="apple-input" value={empresa.emp_bairro} onChange={(e) => setEmpresa({ ...empresa, emp_bairro: e.target.value })} placeholder="Bairro" />
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  <label style={{ fontSize: "0.85rem", fontWeight: "700", color: "#1d1d1f" }}>Cidade *</label>
                  <input type="text" required className="apple-input" value={empresa.emp_cidade} onChange={(e) => setEmpresa({ ...empresa, emp_cidade: e.target.value })} placeholder="Cidade" />
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  <label style={{ fontSize: "0.85rem", fontWeight: "700", color: "#1d1d1f" }}>UF *</label>
                  <input type="text" required maxLength={2} className="apple-input" style={{ textAlign: "center" }} value={empresa.emp_uf} onChange={(e) => setEmpresa({ ...empresa, emp_uf: e.target.value.toUpperCase() })} placeholder="MG" />
                </div>
              </div>

              {/* Bens da Empresa */}
              <div style={{ display: "grid", gridTemplateColumns: "1.25fr 1.5fr 1fr", gap: "1.25rem", alignItems: "end" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  <label style={{ fontSize: "0.85rem", fontWeight: "700", color: "#1d1d1f" }}>Possui Imóvel no CNPJ? *</label>
                  <select className="apple-select" value={empresa.emp_imovel} onChange={(e) => setEmpresa({ ...empresa, emp_imovel: e.target.value })}>
                    <option value="Não">Não</option>
                    <option value="Sim">Sim</option>
                  </select>
                </div>
                {empresa.emp_imovel === "Sim" && (
                  <>
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                      <label style={{ fontSize: "0.85rem", fontWeight: "700", color: "#1d1d1f" }}>Tipo de Matrícula</label>
                      <select className="apple-select" value={empresa.emp_imovel_tipo} onChange={(e) => setEmpresa({ ...empresa, emp_imovel_tipo: e.target.value })}>
                        <option value="Escritura/Matrícula">Matrícula Registrada</option>
                        <option value="Contrato de Compra/Venda">Contrato Particular</option>
                        <option value="IPTU">IPTU no CNPJ</option>
                      </select>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                      <label style={{ fontSize: "0.85rem", fontWeight: "700", color: "#1d1d1f" }}>Valor Estimado (R$)</label>
                      <input type="text" className="apple-input" value={empresa.emp_imovel_valor} onChange={(e) => setEmpresa({ ...empresa, emp_imovel_valor: handleCurrencyInput(e.target.value) })} placeholder="R$ 0,00" />
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {/* ETAPA 2: DADOS DOS SÓCIOS */}
          {step === 2 && (
            <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #f5f5f7", paddingBottom: "1rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  <User size={24} style={{ color: "#0071e3" }} />
                  <h2 style={{ fontSize: "1.5rem", color: "#1d1d1f", fontWeight: "700", margin: 0 }}>Sócios / Proprietários</h2>
                </div>
                <button type="button" onClick={addSocio} className="crm-btn crm-btn-secondary" style={{ padding: "0.4rem 1rem", fontSize: "0.85rem" }}>
                  + Adicionar Sócio
                </button>
              </div>

              {socios.map((socio, idx) => (
                <div key={idx} style={{ padding: "2rem", backgroundColor: "#f5f5f7", borderRadius: "16px", border: "1px solid #e8e8ed", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <h3 style={{ margin: 0, color: "#1d1d1f", fontSize: "1.1rem", fontWeight: "700" }}>Sócio #{idx + 1}</h3>
                    {socios.length > 1 && (
                      <button type="button" onClick={() => removeSocio(idx)} style={{ color: "#ff3b30", background: "none", border: "none", cursor: "pointer", fontSize: "0.85rem", display: "flex", alignItems: "center", gap: "0.25rem", fontWeight: "600" }}>
                        <Trash2 size={14} /> Excluir Sócio
                      </button>
                    )}
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr 1fr", gap: "1rem" }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                      <label style={{ fontSize: "0.85rem", fontWeight: "700", color: "#1d1d1f" }}>Nome Completo *</label>
                      <input type="text" required className="apple-input" value={socio.dados.nome} onChange={(e) => handleSocioChange(idx, "nome", e.target.value)} placeholder="Como no CPF" />
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                      <label style={{ fontSize: "0.85rem", fontWeight: "700", color: "#1d1d1f" }}>CPF *</label>
                      <input type="text" required className={`apple-input ${socioCpfErrors[idx] ? "input-error" : ""}`} value={socio.dados.cpf} onChange={(e) => handleSocioCpfChange(idx, e.target.value)} placeholder="000.000.000-00" />
                      {socioCpfErrors[idx] && <span style={{ color: "#ff3b30", fontSize: "0.75rem", fontWeight: "600" }}>{socioCpfErrors[idx]}</span>}
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                      <label style={{ fontSize: "0.85rem", fontWeight: "700", color: "#1d1d1f" }}>% Sociedade *</label>
                      <input type="text" required className="apple-input" value={socio.dados.participacao} onChange={(e) => handleSocioChange(idx, "participacao", e.target.value)} placeholder="Ex: 50" />
                    </div>
                  </div>

                  {/* RG e Data de Emissão (Obrigatórios por lei Corban/BDMG) */}
                  <div style={{ display: "grid", gridTemplateColumns: "1.25fr 1fr 1fr", gap: "1rem" }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                      <label style={{ fontSize: "0.85rem", fontWeight: "700", color: "#1d1d1f" }}>Nº Registro Geral (RG) *</label>
                      <input type="text" required className="apple-input" value={socio.dados.rg} onChange={(e) => handleSocioChange(idx, "rg", e.target.value)} placeholder="Registro Geral" />
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                      <label style={{ fontSize: "0.85rem", fontWeight: "700", color: "#1d1d1f" }}>Data de Emissão (RG) *</label>
                      <input type="date" required className="apple-input" value={socio.dados.rg_data_emissao} onChange={(e) => handleSocioChange(idx, "rg_data_emissao", e.target.value)} />
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                      <label style={{ fontSize: "0.85rem", fontWeight: "700", color: "#1d1d1f" }}>Data Nascimento *</label>
                      <input type="date" required className="apple-input" value={socio.dados.nascimento} onChange={(e) => handleSocioChange(idx, "nascimento", e.target.value)} />
                    </div>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1.25fr 1.5fr 1.5fr", gap: "1rem" }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                      <label style={{ fontSize: "0.85rem", fontWeight: "700", color: "#1d1d1f" }}>Nacionalidade *</label>
                      <input type="text" required className="apple-input" value={socio.dados.nacionalidade} onChange={(e) => handleSocioChange(idx, "nacionalidade", e.target.value)} placeholder="Brasileiro(a)" />
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                      <label style={{ fontSize: "0.85rem", fontWeight: "700", color: "#1d1d1f" }}>Estado Civil *</label>
                      <select className="apple-select" value={socio.dados.estado_civil} onChange={(e) => handleSocioChange(idx, "estado_civil", e.target.value)}>
                        <option value="Solteiro(a)">Solteiro(a)</option>
                        <option value="Casado(a)">Casado(a)</option>
                        <option value="União estável">União estável</option>
                        <option value="Divorciado(a)">Divorciado(a)</option>
                        <option value="Viúvo(a)">Viúvo(a)</option>
                      </select>
                    </div>
                    {socio.conjuge && (
                      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                        <label style={{ fontSize: "0.85rem", fontWeight: "700", color: "#1d1d1f" }}>Regime de Casamento</label>
                        <select className="apple-select" value={socio.dados.regime} onChange={(e) => handleSocioChange(idx, "regime", e.target.value)}>
                          <option value="Comunhão parcial de bens">Comunhão parcial de bens</option>
                          <option value="Comunhão universal de bens">Comunhão universal de bens</option>
                          <option value="Separação total de bens">Separação total de bens</option>
                        </select>
                      </div>
                    )}
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                      <label style={{ fontSize: "0.85rem", fontWeight: "700", color: "#1d1d1f" }}>E-mail *</label>
                      <input type="email" required className="apple-input" value={socio.dados.email} onChange={(e) => handleSocioChange(idx, "email", e.target.value)} placeholder="email@socio.com" />
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                      <label style={{ fontSize: "0.85rem", fontWeight: "700", color: "#1d1d1f" }}>Telefone *</label>
                      <input type="text" required className="apple-input" value={socio.dados.telefone} onChange={(e) => handleSocioChange(idx, "telefone", maskPhone(e.target.value))} placeholder="(35) 99999-9999" />
                    </div>
                  </div>

                  {/* Campo de Renda do Sócio */}
                  <div style={{ display: "grid", gridTemplateColumns: "1.25fr 2fr", gap: "1.5rem", alignItems: "start" }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                      <label style={{ fontSize: "0.85rem", fontWeight: "700", color: "#1d1d1f" }}>Renda Mensal Comprovada (IRPF) *</label>
                      <input type="text" required className="apple-input" value={socio.dados.renda} onChange={(e) => handleSocioChange(idx, "renda", handleCurrencyInput(e.target.value))} placeholder="R$ 0,00" />
                    </div>
                    <div style={{ fontSize: "0.8rem", color: "#0071e3", backgroundColor: "rgba(0, 113, 227, 0.05)", border: "1px solid rgba(0, 113, 227, 0.1)", borderRadius: "10px", padding: "0.75rem 1rem", lineHeight: "1.4" }}>
                      <strong>Dica RMJ:</strong> Declare o valor exatamente em conformidade com o seu IRPF mais recente para encurtar o tempo de análise do BDMG.
                    </div>
                  </div>

                  {/* Campo de Bens do Sócio */}
                  <div style={{ display: "grid", gridTemplateColumns: "1.25fr 1.25fr 1fr", gap: "1rem" }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                      <label style={{ fontSize: "0.85rem", fontWeight: "700", color: "#1d1d1f" }}>Possui Imóvel Próprio? *</label>
                      <select className="apple-select" value={socio.dados.imovel_tipo || "Não possui"} onChange={(e) => handleSocioChange(idx, "imovel_tipo", e.target.value)}>
                        <option value="Não possui">Não possui</option>
                        <option value="Escritura/Matrícula">Matrícula no IRPF</option>
                        <option value="Contrato de Compra">Contrato de Compra</option>
                        <option value="IPTU">IPTU em seu nome</option>
                      </select>
                    </div>
                    {socio.dados.imovel_tipo && socio.dados.imovel_tipo !== "Não possui" && (
                      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                        <label style={{ fontSize: "0.85rem", fontWeight: "700", color: "#1d1d1f" }}>Valor Estimado (R$)</label>
                        <input type="text" className="apple-input" value={socio.dados.imovel_valor || ""} onChange={(e) => handleSocioChange(idx, "imovel_valor", handleCurrencyInput(e.target.value))} placeholder="R$ 0,00" />
                      </div>
                    )}
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                      <label style={{ fontSize: "0.85rem", fontWeight: "700", color: "#1d1d1f" }}>Placa de Veículos (IRPF)</label>
                      <input type="text" className="apple-input" value={socio.dados.veiculo_placas || ""} onChange={(e) => handleSocioChange(idx, "veiculo_placas", e.target.value.toUpperCase())} placeholder="Ex: ABC1D23, XYZ9A87" />
                    </div>
                  </div>

                  {/* Endereço do Sócio */}
                  <div style={{ display: "grid", gridTemplateColumns: "130px 1.5fr 1fr 100px", gap: "1rem" }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                      <label style={{ fontSize: "0.85rem", fontWeight: "700", color: "#1d1d1f" }}>CEP Residencial *</label>
                      <input type="text" required className="apple-input" value={socio.dados.cep} onChange={(e) => {
                        const v = maskCEP(e.target.value);
                        handleSocioChange(idx, "cep", v);
                        if (v.length === 9) buscarCEP(v, false, idx);
                      }} placeholder="37500-000" />
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                      <label style={{ fontSize: "0.85rem", fontWeight: "700", color: "#1d1d1f" }}>Logradouro *</label>
                      <input type="text" required className="apple-input" value={socio.dados.logradouro} onChange={(e) => handleSocioChange(idx, "logradouro", e.target.value)} placeholder="Logradouro" />
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                      <label style={{ fontSize: "0.85rem", fontWeight: "700", color: "#1d1d1f" }}>Complemento</label>
                      <input type="text" className="apple-input" value={socio.dados.complemento} onChange={(e) => handleSocioChange(idx, "complemento", e.target.value)} placeholder="Apto, Bloco, etc." />
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                      <label style={{ fontSize: "0.85rem", fontWeight: "700", color: "#1d1d1f" }}>Número *</label>
                      <input type="text" required className="apple-input" value={socio.dados.numero} onChange={(e) => handleSocioChange(idx, "numero", e.target.value)} placeholder="Ex: 50" />
                    </div>
                  </div>

                  {/* Bloco Dinâmico do Cônjuge se Casado */}
                  {socio.conjuge && (
                    <div style={{ marginTop: "1rem", padding: "1.5rem", border: "1px dashed #0071e3", borderRadius: "12px", backgroundColor: "#ffffff", display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                      <h4 style={{ margin: 0, color: "#0071e3", fontSize: "0.95rem", fontWeight: "700" }}>Dados do Cônjuge (Sócio #{idx + 1})</h4>
                      
                      <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr 1fr", gap: "1rem" }}>
                        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                          <label style={{ fontSize: "0.85rem", fontWeight: "700", color: "#1d1d1f" }}>Nome Completo Cônjuge *</label>
                          <input type="text" required className="apple-input" value={socio.conjuge.nome} onChange={(e) => handleConjugeChange(idx, "nome", e.target.value)} placeholder="Nome completo" />
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                          <label style={{ fontSize: "0.85rem", fontWeight: "700", color: "#1d1d1f" }}>CPF Cônjuge *</label>
                          <input type="text" required className={`apple-input ${conjugeCpfErrors[idx] ? "input-error" : ""}`} value={socio.conjuge.cpf} onChange={(e) => handleConjugeCpfChange(idx, e.target.value)} placeholder="000.000.000-00" />
                          {conjugeCpfErrors[idx] && <span style={{ color: "#ff3b30", fontSize: "0.75rem", fontWeight: "600" }}>{conjugeCpfErrors[idx]}</span>}
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                          <label style={{ fontSize: "0.85rem", fontWeight: "700", color: "#1d1d1f" }}>Data Nascimento *</label>
                          <input type="date" required className="apple-input" value={socio.conjuge.nascimento} onChange={(e) => handleConjugeChange(idx, "nascimento", e.target.value)} />
                        </div>
                      </div>

                      {/* RG e Data Emissão do Cônjuge (Obrigatórios por lei BDMG) */}
                      <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: "1rem" }}>
                        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                          <label style={{ fontSize: "0.85rem", fontWeight: "700", color: "#1d1d1f" }}>Nº Registro Geral (RG) *</label>
                          <input type="text" required className="apple-input" value={socio.conjuge.rg} onChange={(e) => handleConjugeChange(idx, "rg", e.target.value)} placeholder="RG do Cônjuge" />
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                          <label style={{ fontSize: "0.85rem", fontWeight: "700", color: "#1d1d1f" }}>Data de Emissão (RG) *</label>
                          <input type="date" required className="apple-input" value={socio.conjuge.rg_data_emissao} onChange={(e) => handleConjugeChange(idx, "rg_data_emissao", e.target.value)} />
                        </div>
                      </div>

                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                          <label style={{ fontSize: "0.85rem", fontWeight: "700", color: "#1d1d1f" }}>WhatsApp Cônjuge *</label>
                          <input type="text" required className="apple-input" value={socio.conjuge.telefone} onChange={(e) => handleConjugeChange(idx, "telefone", maskPhone(e.target.value))} placeholder="(35) 99999-9999" />
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                          <label style={{ fontSize: "0.85rem", fontWeight: "700", color: "#1d1d1f" }}>E-mail Cônjuge *</label>
                          <input type="email" required className="apple-input" value={socio.conjuge.email} onChange={(e) => handleConjugeChange(idx, "email", e.target.value)} placeholder="email@conjuge.com" />
                          <span style={{ fontSize: "0.75rem", color: "#86868b" }}>Deve ser diferente do e-mail do sócio.</span>
                        </div>
                      </div>

                      {/* Renda do Cônjuge */}
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem", alignItems: "end" }}>
                        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                          <label style={{ fontSize: "0.85rem", fontWeight: "700", color: "#1d1d1f" }}>Incluir Renda do Cônjuge? *</label>
                          <select className="apple-select" value={socio.conjuge.incluir_renda} onChange={(e) => handleConjugeChange(idx, "incluir_renda", e.target.value)}>
                            <option value="Não">Não</option>
                            <option value="Sim">Sim</option>
                          </select>
                        </div>
                        {socio.conjuge.incluir_renda === "Sim" && (
                          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                            <label style={{ fontSize: "0.85rem", fontWeight: "700", color: "#1d1d1f" }}>Renda Mensal Cônjuge (R$)</label>
                            <input type="text" required className="apple-input" value={socio.conjuge.renda} onChange={(e) => handleConjugeChange(idx, "renda", handleCurrencyInput(e.target.value))} placeholder="R$ 0,00" />
                          </div>
                        )}
                      </div>

                      {/* Bens do Cônjuge: Imóveis e Veículos */}
                      <div style={{ display: "grid", gridTemplateColumns: "1.25fr 1.25fr 1fr", gap: "1rem" }}>
                        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                          <label style={{ fontSize: "0.85rem", fontWeight: "700", color: "#1d1d1f" }}>Possui Imóvel Próprio? (Cônjuge)</label>
                          <select className="apple-select" value={socio.conjuge.imovel_tipo || "Não possui"} onChange={(e) => handleConjugeChange(idx, "imovel_tipo", e.target.value)}>
                            <option value="Não possui">Não possui</option>
                            <option value="Escritura/Matrícula">Matrícula no IRPF</option>
                            <option value="Contrato de Compra">Contrato de Compra</option>
                            <option value="IPTU">IPTU em nome do cônjuge</option>
                          </select>
                        </div>
                        {socio.conjuge.imovel_tipo && socio.conjuge.imovel_tipo !== "Não possui" && (
                          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                            <label style={{ fontSize: "0.85rem", fontWeight: "700", color: "#1d1d1f" }}>Valor Estimado (R$)</label>
                            <input type="text" className="apple-input" value={socio.conjuge.imovel_valor || ""} onChange={(e) => handleConjugeChange(idx, "imovel_valor", handleCurrencyInput(e.target.value))} placeholder="R$ 0,00" />
                          </div>
                        )}
                        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                          <label style={{ fontSize: "0.85rem", fontWeight: "700", color: "#1d1d1f" }}>Placa de Veículos (Cônjuge)</label>
                          <input type="text" className="apple-input" value={socio.conjuge.veiculo_placas || ""} onChange={(e) => handleConjugeChange(idx, "veiculo_placas", e.target.value.toUpperCase())} placeholder="Ex: ABC1D23, XYZ9A87" />
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
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", borderBottom: "1px solid #f5f5f7", paddingBottom: "1rem" }}>
                <Landmark size={24} style={{ color: "#0071e3" }} />
                <h2 style={{ fontSize: "1.5rem", color: "#1d1d1f", fontWeight: "700", margin: 0 }}>Dados Bancários</h2>
              </div>
              
              <p style={{ color: "#86868b", fontSize: "0.95rem", lineHeight: "1.5", margin: 0 }}>
                Indique a conta bancária da empresa cadastrada para a transferência da liberação do crédito.
              </p>

              <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr 1fr", gap: "1.25rem" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  <label style={{ fontSize: "0.85rem", fontWeight: "700", color: "#1d1d1f" }}>Nome do Banco *</label>
                  <input type="text" required className="apple-input" value={bancario.banco_nome} onChange={(e) => setBancario({ ...bancario, banco_nome: e.target.value })} placeholder="Ex: Itaú, Bradesco, C6..." />
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  <label style={{ fontSize: "0.85rem", fontWeight: "700", color: "#1d1d1f" }}>Agência *</label>
                  <input type="text" required className="apple-input" value={bancario.banco_agencia} onChange={(e) => setBancario({ ...bancario, banco_agencia: e.target.value })} placeholder="Ex: 0123" />
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  <label style={{ fontSize: "0.85rem", fontWeight: "700", color: "#1d1d1f" }}>Conta Corrente (com dígito) *</label>
                  <input type="text" required className="apple-input" value={bancario.banco_conta} onChange={(e) => setBancario({ ...bancario, banco_conta: e.target.value })} placeholder="Ex: 12345-6" />
                </div>
              </div>
            </div>
          )}

          {/* ETAPA 4: OBSERVACÕES E LGPD */}
          {step === 4 && (
            <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", borderBottom: "1px solid #f5f5f7", paddingBottom: "1rem" }}>
                <ShieldCheck size={24} style={{ color: "#34c759" }} />
                <h2 style={{ fontSize: "1.5rem", color: "#1d1d1f", fontWeight: "700", margin: 0 }}>Finalizar & Termos</h2>
              </div>
              
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                <label style={{ fontSize: "0.85rem", fontWeight: "700", color: "#1d1d1f" }}>Observações ou Solicitações Especiais</label>
                <textarea className="apple-textarea" rows={4} value={observacoes.obs_finais} onChange={(e) => setObservacoes({ ...observacoes, obs_finais: e.target.value })} placeholder="Informe aqui qualquer informação complementar relevante..." />
              </div>

              {/* Documentos pendentes */}
              <div style={{ padding: "1.5rem", backgroundColor: "#f5f5f7", borderRadius: "12px", border: "1px solid #e8e8ed" }}>
                <h4 style={{ margin: "0 0 0.75rem 0", color: "#1d1d1f", fontWeight: "700", fontSize: "0.95rem" }}>Documentos Necessários (Fase de Upload):</h4>
                <ul style={{ margin: 0, paddingLeft: "1.25rem", color: "#86868b", fontSize: "0.85rem", lineHeight: "1.6" }}>
                  <li>Faturamento contábil recente (últimos 12 meses) assinado pelo Contador.</li>
                  <li>Extrato Completo do Simples Nacional / Declarações PGDAS.</li>
                  <li>Contrato Social Consolidado da empresa PJ.</li>
                  <li>IRPF completo de todos os sócios com recibo de entrega.</li>
                </ul>
              </div>

              <div style={{ display: "flex", gap: "0.75rem", alignItems: "start", marginTop: "1rem" }}>
                <input type="checkbox" id="aceite_lgpd" required checked={observacoes.aceite_lgpd} onChange={(e) => setObservacoes({ ...observacoes, aceite_lgpd: e.target.checked })} style={{ width: "16px", height: "16px", marginTop: "0.2rem", cursor: "pointer" }} />
                <label htmlFor="aceite_lgpd" style={{ fontSize: "0.85rem", color: "#86868b", cursor: "pointer", fontWeight: "500", lineHeight: "1.5" }}>
                  Declaro que as informações societárias e financeiras declaradas são autênticas. Dou consentimento inequívoco para o tratamento e análise de crédito destes dados para fins de viabilização do limite junto ao BDMG, nos termos da <strong>Lei Geral de Proteção de Dados (LGPD - Lei 13.709/2018)</strong>. *
                </label>
              </div>
            </div>
          )}

          {/* Rodapé de Navegação */}
          <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", marginTop: "3rem", paddingTop: "1.5rem", borderTop: "1px solid #f5f5f7" }}>
            {step > 1 ? (
              <button type="button" onClick={() => setStep((prev) => prev - 1)} className="crm-btn crm-btn-secondary" style={{ padding: "0.75rem 1.5rem" }}>
                <ArrowLeft size={16} /> Voltar
              </button>
            ) : (
              <div />
            )}

            {step < 4 ? (
              <button type="button" onClick={handleNext} className="crm-btn crm-btn-primary" style={{ padding: "0.75rem 1.5rem" }}>
                Avançar <ArrowRight size={16} />
              </button>
            ) : (
              <button type="submit" disabled={loading} className="crm-btn crm-btn-primary" style={{ padding: "0.85rem 2rem", fontSize: "0.95rem", backgroundColor: "#30d158", borderColor: "#30d158" }}>
                {loading ? "Enviando dados..." : "Submeter ao BDMG 🚀"}
              </button>
            )}
          </div>

        </form>

      </div>
      
      {/* Dynamic Style Injection for Apple UI Aesthetics */}
      <style jsx global>{`
        .apple-input, .apple-select, .apple-textarea {
          width: 100%;
          background-color: #f5f5f7;
          border: 1px solid #d2d2d7;
          border-radius: 12px;
          padding: 0.85rem 1rem;
          color: #1d1d1f;
          font-family: inherit;
          font-size: 0.95rem;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          outline: none;
        }
        .apple-input:focus, .apple-select:focus, .apple-textarea:focus {
          background-color: #ffffff;
          border-color: #0071e3;
          box-shadow: 0 0 0 4px rgba(0, 113, 227, 0.15);
        }
        .apple-input::placeholder, .apple-textarea::placeholder {
          color: #86868b;
          opacity: 0.7;
        }
        .input-error {
          border-color: #ff3b30 !important;
          background-color: #fff8f8 !important;
        }
        .input-error:focus {
          box-shadow: 0 0 0 4px rgba(255, 59, 48, 0.15) !important;
        }
        .apple-select {
          appearance: none;
          background-image: url("data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%2386868b' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 1rem center;
          background-size: 1.2rem;
          padding-right: 2.5rem;
        }
      `}</style>
    </div>
  );
}
