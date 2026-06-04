"use client";

import { useState } from "react";
import Link from "next/link";
import { ShieldCheck, ArrowRight, ArrowLeft, CheckCircle2, User, Building2, MapPin, Wallet, Home } from "lucide-react";

const ESTADOS_BR = [
  "AC","AL","AM","AP","BA","CE","DF","ES","GO","MA","MG","MS","MT",
  "PA","PB","PE","PI","PR","RJ","RN","RO","RR","RS","SC","SE","SP","TO"
];

export default function CadastroFinanciamentoImobiliario() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  // ── Step 1: Simulação ──
  const [simulacao, setSimulacao] = useState({
    valor_imovel: "",
    valor_financiamento: "",
    prazo: "",
    estado_imovel: "",
    utilizar_fgts: "Não",
    valor_fgts: "",
  });

  // ── Step 2: Proponente ──
  const [proponente, setProponente] = useState({
    nome: "",
    cpf: "",
    email: "",
    celular: "",
    nascimento: "",
    sexo: "",
    nome_mae: "",
    rg: "",
    estado_emissao: "",
    orgao_emissor: "",
    estado_civil: "",
  });
  const [cpfError, setCpfError] = useState("");

  const [adicionarSegundo, setAdicionarSegundo] = useState("Não");
  const [segundoProponente, setSegundoProponente] = useState({
    nome: "",
    cpf: "",
    email: "",
    celular: "",
    nascimento: "",
    sexo: "",
    nome_mae: "",
    rg: "",
    estado_emissao: "",
    orgao_emissor: "",
    estado_civil: "",
  });
  const [cpf2Error, setCpf2Error] = useState("");

  // ── Step 3: Endereços ──
  const [enderecoProponente, setEnderecoProponente] = useState({
    cep: "",
    estado: "",
    cidade: "",
    bairro: "",
    logradouro: "",
    numero: "",
    complemento: "",
  });

  const [dadosImovel, setDadosImovel] = useState({
    tipo_imovel: "",
    imovel_escolhido: "",
    situacao_imovel: "",
  });

  const [enderecoImovel, setEnderecoImovel] = useState({
    cep: "",
    estado: "",
    cidade: "",
    bairro: "",
    logradouro: "",
    numero: "",
    complemento: "",
    valor_imovel: "",
    valor_financiamento: "",
    prazo: "",
  });

  // ── Step 4: Financeiro ──
  const [financeiro, setFinanceiro] = useState({
    fonte_renda: "",
    renda_mensal: "",
    profissao: "",
  });

  const [contas, setContas] = useState({
    ag_santander: "",
    cc_santander: "",
    ag_itau: "",
    cc_itau: "",
    ag_bradesco: "",
    cc_bradesco: "",
  });

  const [infoAdicional, setInfoAdicional] = useState("");

  // ── Step 5: Termos ──
  const [aceiteLgpd, setAceiteLgpd] = useState(false);

  // ════════════════════════════════════════════════════════════════
  //  HELPERS: masks, validators, CEP lookup
  // ════════════════════════════════════════════════════════════════

  const handleCurrencyInput = (value: string) => {
    const clean = value.replace(/\D/g, "");
    if (!clean) return "";
    const cents = parseInt(clean, 10);
    const num = cents / 100;
    return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(num);
  };

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

  const handleCpfChange = (v: string) => {
    const masked = maskCPF(v);
    setProponente((prev) => ({ ...prev, cpf: masked }));
    if (masked.length === 14) {
      setCpfError(validarCPF(masked) ? "" : "CPF inválido.");
    } else {
      setCpfError("");
    }
  };

  const handleCpf2Change = (v: string) => {
    const masked = maskCPF(v);
    setSegundoProponente((prev) => ({ ...prev, cpf: masked }));
    if (masked.length === 14) {
      setCpf2Error(validarCPF(masked) ? "" : "CPF inválido.");
    } else {
      setCpf2Error("");
    }
  };

  const buscarCEP = async (cep: string, tipo: "proponente" | "imovel") => {
    const clean = cep.replace(/\D/g, "");
    if (clean.length !== 8) return;
    try {
      const res = await fetch(`https://viacep.com.br/ws/${clean}/json/`);
      const data = await res.json();
      if (!data.erro) {
        if (tipo === "proponente") {
          setEnderecoProponente((prev) => ({
            ...prev,
            logradouro: data.logradouro || "",
            bairro: data.bairro || "",
            cidade: data.localidade || "",
            estado: data.uf || "",
          }));
        } else {
          setEnderecoImovel((prev) => ({
            ...prev,
            logradouro: data.logradouro || "",
            bairro: data.bairro || "",
            cidade: data.localidade || "",
            estado: data.uf || "",
          }));
        }
      }
    } catch (e) {
      console.error("Erro ao buscar CEP", e);
    }
  };

  // ════════════════════════════════════════════════════════════════
  //  VALIDATION
  // ════════════════════════════════════════════════════════════════

  const validateStep = () => {
    setError("");

    if (step === 1) {
      if (!simulacao.valor_imovel || !simulacao.valor_financiamento || !simulacao.prazo || !simulacao.estado_imovel) {
        setError("Preencha todos os campos da simulação.");
        return false;
      }
      if (simulacao.utilizar_fgts === "Sim" && !simulacao.valor_fgts) {
        setError("Informe o valor do FGTS a ser utilizado.");
        return false;
      }
      const prazoNum = parseInt(simulacao.prazo, 10);
      if (isNaN(prazoNum) || prazoNum < 1 || prazoNum > 420) {
        setError("O prazo deve ser entre 1 e 420 meses.");
        return false;
      }
    }

    if (step === 2) {
      const p = proponente;
      if (!p.nome || !p.cpf || !p.email || !p.celular || !p.nascimento || !p.sexo || !p.nome_mae || !p.rg || !p.estado_emissao || !p.orgao_emissor || !p.estado_civil) {
        setError("Preencha todos os campos obrigatórios do proponente.");
        return false;
      }
      if (!validarCPF(p.cpf)) {
        setError("CPF do proponente é inválido.");
        return false;
      }
      if (adicionarSegundo === "Sim") {
        const s = segundoProponente;
        if (!s.nome || !s.cpf || !s.email || !s.celular || !s.nascimento || !s.sexo || !s.nome_mae || !s.rg || !s.estado_emissao || !s.orgao_emissor || !s.estado_civil) {
          setError("Preencha todos os campos obrigatórios do segundo proponente.");
          return false;
        }
        if (!validarCPF(s.cpf)) {
          setError("CPF do segundo proponente é inválido.");
          return false;
        }
      }
    }

    if (step === 3) {
      const e = enderecoProponente;
      if (!e.cep || !e.estado || !e.cidade || !e.bairro || !e.logradouro || !e.numero) {
        setError("Preencha todos os campos obrigatórios do endereço do proponente.");
        return false;
      }
      if (!dadosImovel.tipo_imovel || !dadosImovel.imovel_escolhido) {
        setError("Preencha o tipo do imóvel e se ele já foi escolhido.");
        return false;
      }
      if (dadosImovel.imovel_escolhido === "Sim") {
        if (!dadosImovel.situacao_imovel) {
          setError("Informe a situação do imóvel (Novo ou Usado).");
          return false;
        }
        const ei = enderecoImovel;
        if (!ei.cep || !ei.estado || !ei.cidade || !ei.bairro || !ei.logradouro || !ei.numero) {
          setError("Preencha todos os campos obrigatórios do endereço do imóvel.");
          return false;
        }
      }
    }

    if (step === 4) {
      if (!financeiro.fonte_renda || !financeiro.renda_mensal || !financeiro.profissao) {
        setError("Preencha todos os campos obrigatórios de dados financeiros.");
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

  // ════════════════════════════════════════════════════════════════
  //  SUBMIT
  // ════════════════════════════════════════════════════════════════

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep()) return;
    if (!aceiteLgpd) {
      setError("Você deve aceitar os termos da LGPD para enviar a proposta.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/cadastro/financiamento-imobiliario", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          simulacao,
          proponente,
          segundo_proponente: adicionarSegundo === "Sim" ? segundoProponente : null,
          endereco_proponente: enderecoProponente,
          dados_imovel: dadosImovel,
          endereco_imovel: dadosImovel.imovel_escolhido === "Sim" ? enderecoImovel : null,
          financeiro,
          contas,
          info_adicional: infoAdicional,
          aceite_lgpd: aceiteLgpd,
        }),
      });

      const result = await res.json();
      if (result.success) {
        setSuccess(true);
      } else {
        setError(result.error || "Ocorreu um erro ao enviar sua proposta.");
      }
    } catch {
      setError("Erro interno de comunicação com a API.");
    } finally {
      setLoading(false);
    }
  };

  // ════════════════════════════════════════════════════════════════
  //  SUCCESS SCREEN
  // ════════════════════════════════════════════════════════════════

  if (success) {
    return (
      <div className="container" style={{ minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ maxWidth: "600px", padding: "3rem", borderRadius: "20px", textAlign: "center", backgroundColor: "#ffffff", boxShadow: "0 10px 40px rgba(0, 0, 0, 0.05)" }}>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: "1.5rem" }}>
            <CheckCircle2 size={64} style={{ color: "#34c759" }} />
          </div>
          <h2 style={{ color: "#1d1d1f", marginBottom: "1rem", fontSize: "1.75rem", fontWeight: 800 }}>Proposta Enviada com Sucesso!</h2>
          <p style={{ color: "#86868b", lineHeight: "1.7", marginBottom: "2rem", fontSize: "0.95rem" }}>
            Seus dados foram registrados em nossa central segura. A equipe da <strong>RMJ Soluções de Crédito</strong> iniciará a análise e estruturação do seu financiamento imobiliário imediatamente.
          </p>
          <p style={{ color: "#86868b", fontSize: "0.85rem" }}>
            Entraremos em contato em breve via WhatsApp ou e-mail para próximos passos e envio de documentação complementar.
          </p>
          <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", marginTop: "2rem", color: "#0071e3", fontWeight: "600", fontSize: "0.95rem" }}>
            <Home size={16} /> Voltar para a Home
          </Link>
        </div>
      </div>
    );
  }

  // ════════════════════════════════════════════════════════════════
  //  SHARED STYLES
  // ════════════════════════════════════════════════════════════════

  const labelStyle: React.CSSProperties = { fontSize: "0.85rem", fontWeight: "700", color: "#1d1d1f" };
  const fieldWrap: React.CSSProperties = { display: "flex", flexDirection: "column", gap: "0.5rem" };
  const grid2: React.CSSProperties = { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" };
  const grid3: React.CSSProperties = { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1.5rem" };
  const sectionHeader = (icon: React.ReactNode, title: string) => (
    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", borderBottom: "1px solid #f5f5f7", paddingBottom: "1rem" }}>
      {icon}
      <h2 style={{ fontSize: "1.5rem", color: "#1d1d1f", fontWeight: "700", margin: 0 }}>{title}</h2>
    </div>
  );

  // ════════════════════════════════════════════════════════════════
  //  REUSABLE: Proponente fields block
  // ════════════════════════════════════════════════════════════════

  const renderProponenteFields = (
    data: typeof proponente,
    setData: React.Dispatch<React.SetStateAction<typeof proponente>>,
    cpfErr: string,
    handleCpf: (v: string) => void,
    labelPrefix: string
  ) => (
    <>
      {/* Row: Nome, CPF */}
      <div style={grid2}>
        <div style={fieldWrap}>
          <label style={labelStyle}>Nome completo *</label>
          <input type="text" className="apple-input" value={data.nome} onChange={(e) => setData({ ...data, nome: e.target.value })} placeholder="Nome conforme documento" />
        </div>
        <div style={fieldWrap}>
          <label style={labelStyle}>CPF *</label>
          <input type="text" className={`apple-input ${cpfErr ? "input-error" : ""}`} value={data.cpf} onChange={(e) => handleCpf(e.target.value)} placeholder="000.000.000-00" />
          {cpfErr && <span style={{ color: "#ff3b30", fontSize: "0.75rem", fontWeight: "600" }}>{cpfErr}</span>}
        </div>
      </div>

      {/* Row: Email, Celular */}
      <div style={grid2}>
        <div style={fieldWrap}>
          <label style={labelStyle}>E-mail *</label>
          <input type="email" className="apple-input" value={data.email} onChange={(e) => setData({ ...data, email: e.target.value })} placeholder="email@exemplo.com" />
        </div>
        <div style={fieldWrap}>
          <label style={labelStyle}>Número de celular *</label>
          <input type="text" className="apple-input" value={data.celular} onChange={(e) => setData({ ...data, celular: maskPhone(e.target.value) })} placeholder="(35) 99999-9999" />
        </div>
      </div>

      {/* Row: Nascimento, Sexo */}
      <div style={grid2}>
        <div style={fieldWrap}>
          <label style={labelStyle}>Data de nascimento *</label>
          <input type="date" className="apple-input" value={data.nascimento} onChange={(e) => setData({ ...data, nascimento: e.target.value })} />
        </div>
        <div style={fieldWrap}>
          <label style={labelStyle}>Sexo *</label>
          <select className="apple-select" value={data.sexo} onChange={(e) => setData({ ...data, sexo: e.target.value })}>
            <option value="">Selecione</option>
            <option value="Masculino">Masculino</option>
            <option value="Feminino">Feminino</option>
          </select>
        </div>
      </div>

      {/* Row: Nome da mãe */}
      <div style={fieldWrap}>
        <label style={labelStyle}>Nome da mãe *</label>
        <input type="text" className="apple-input" value={data.nome_mae} onChange={(e) => setData({ ...data, nome_mae: e.target.value })} placeholder="Nome completo da mãe" />
      </div>

      {/* Row: RG, Estado emissão, Órgão emissor */}
      <div style={grid3}>
        <div style={fieldWrap}>
          <label style={labelStyle}>Número do documento (RG) *</label>
          <input type="text" className="apple-input" value={data.rg} onChange={(e) => setData({ ...data, rg: e.target.value })} placeholder="Registro Geral" />
        </div>
        <div style={fieldWrap}>
          <label style={labelStyle}>Estado de emissão *</label>
          <select className="apple-select" value={data.estado_emissao} onChange={(e) => setData({ ...data, estado_emissao: e.target.value })}>
            <option value="">Selecione o estado</option>
            {ESTADOS_BR.map((uf) => (
              <option key={uf} value={uf}>{uf}</option>
            ))}
          </select>
        </div>
        <div style={fieldWrap}>
          <label style={labelStyle}>Órgão emissor *</label>
          <input type="text" className="apple-input" value={data.orgao_emissor} onChange={(e) => setData({ ...data, orgao_emissor: e.target.value })} placeholder="Ex: SSP, DETRAN, IFP" />
        </div>
      </div>

      {/* Row: Estado civil */}
      <div style={{ ...grid2, gridTemplateColumns: "1fr" }}>
        <div style={fieldWrap}>
          <label style={labelStyle}>Estado civil *</label>
          <select className="apple-select" value={data.estado_civil} onChange={(e) => setData({ ...data, estado_civil: e.target.value })}>
            <option value="">Selecione</option>
            <option value="Solteiro(a)">Solteiro(a)</option>
            <option value="Casado(a)">Casado(a)</option>
            <option value="Divorciado(a)">Divorciado(a)</option>
            <option value="Viúvo(a)">Viúvo(a)</option>
            <option value="União Estável">União Estável</option>
            <option value="Separado(a)">Separado(a)</option>
          </select>
        </div>
      </div>
    </>
  );

  // ════════════════════════════════════════════════════════════════
  //  RENDER
  // ════════════════════════════════════════════════════════════════

  return (
    <div style={{ backgroundColor: "#f5f5f7", minHeight: "90vh", padding: "3rem 0", fontFamily: "var(--font-montserrat), -apple-system, sans-serif" }}>
      <div className="container" style={{ maxWidth: "800px" }}>

        {/* ─── Header ─── */}
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <Link href="/" style={{ fontSize: "0.9rem", color: "#0071e3", display: "inline-flex", alignItems: "center", gap: "0.25rem", marginBottom: "1rem", fontWeight: "600" }}>
            <ArrowLeft size={14} /> Voltar para a Home
          </Link>
          <h1 style={{ fontSize: "2.5rem", color: "#1d1d1f", fontWeight: 800, letterSpacing: "-0.05em", margin: 0 }}>
            Ficha de Financiamento <span style={{ color: "#0071e3", fontWeight: "normal", fontStyle: "italic" }}>Imobiliário</span>
          </h1>
          <p style={{ color: "#86868b", marginTop: "0.5rem", fontSize: "1.05rem", fontWeight: 500 }}>
            Preencha seus dados para simular e solicitar seu financiamento imobiliário.
          </p>
        </div>

        {/* ─── Progress Bar ─── */}
        <div style={{ display: "flex", gap: "0.5rem", marginBottom: "2.5rem", height: "4px", backgroundColor: "#e8e8ed", borderRadius: "2px", overflow: "hidden" }}>
          {[1, 2, 3, 4, 5].map((stepNum) => (
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
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "2rem", padding: "0 0.25rem", fontSize: "0.75rem", color: "#86868b", fontWeight: "700", textTransform: "uppercase" }}>
          <span>1. Simulação</span>
          <span>2. Proponente</span>
          <span>3. Endereços</span>
          <span>4. Financeiro</span>
          <span>5. Termos</span>
        </div>

        {/* ─── Error banner ─── */}
        {error && (
          <div style={{ backgroundColor: "#ffeff2", color: "#ff3b30", border: "1px solid #ffccd4", padding: "1rem 1.25rem", borderRadius: "12px", marginBottom: "1.5rem", fontSize: "0.9rem", display: "flex", alignItems: "center", gap: "0.5rem", fontWeight: "600" }}>
            ⚠ {error}
          </div>
        )}

        {/* ─── Form Card ─── */}
        <form
          onSubmit={handleSubmit}
          style={{
            padding: "2.5rem",
            borderRadius: "20px",
            backgroundColor: "#ffffff",
            boxShadow: "0 4px 30px rgba(0, 0, 0, 0.02)",
            border: "1px solid #e8e8ed",
          }}
        >

          {/* ═══════════════════════════════════════════════════════ */}
          {/*  STEP 1 — Simulação do Financiamento                  */}
          {/* ═══════════════════════════════════════════════════════ */}
          {step === 1 && (
            <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
              {sectionHeader(<Building2 size={24} style={{ color: "#0071e3" }} />, "Simulação do Financiamento")}

              <div style={grid2}>
                <div style={fieldWrap}>
                  <label style={labelStyle}>Valor do Imóvel (R$) *</label>
                  <input type="text" className="apple-input" value={simulacao.valor_imovel} onChange={(e) => setSimulacao({ ...simulacao, valor_imovel: handleCurrencyInput(e.target.value) })} placeholder="R$ 0,00" />
                </div>
                <div style={fieldWrap}>
                  <label style={labelStyle}>Valor do Financiamento (R$) *</label>
                  <input type="text" className="apple-input" value={simulacao.valor_financiamento} onChange={(e) => setSimulacao({ ...simulacao, valor_financiamento: handleCurrencyInput(e.target.value) })} placeholder="R$ 0,00" />
                </div>
              </div>

              <div style={grid2}>
                <div style={fieldWrap}>
                  <label style={labelStyle}>Prazo (meses) *</label>
                  <input type="number" className="apple-input" max={420} min={1} value={simulacao.prazo} onChange={(e) => setSimulacao({ ...simulacao, prazo: e.target.value })} placeholder="Ex: 360" />
                  <span style={{ fontSize: "0.75rem", color: "#86868b" }}>Até 420 meses (35 anos)</span>
                </div>
                <div style={fieldWrap}>
                  <label style={labelStyle}>Estado do Imóvel *</label>
                  <select className="apple-select" value={simulacao.estado_imovel} onChange={(e) => setSimulacao({ ...simulacao, estado_imovel: e.target.value })}>
                    <option value="">Selecione o estado</option>
                    {ESTADOS_BR.map((uf) => (
                      <option key={uf} value={uf}>{uf}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={grid2}>
                <div style={fieldWrap}>
                  <label style={labelStyle}>Utilizar FGTS? *</label>
                  <select className="apple-select" value={simulacao.utilizar_fgts} onChange={(e) => setSimulacao({ ...simulacao, utilizar_fgts: e.target.value })}>
                    <option value="Não">Não</option>
                    <option value="Sim">Sim</option>
                  </select>
                </div>
                {simulacao.utilizar_fgts === "Sim" && (
                  <div style={fieldWrap}>
                    <label style={labelStyle}>Valor do FGTS (R$) *</label>
                    <input type="text" className="apple-input" value={simulacao.valor_fgts} onChange={(e) => setSimulacao({ ...simulacao, valor_fgts: handleCurrencyInput(e.target.value) })} placeholder="R$ 0,00" />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ═══════════════════════════════════════════════════════ */}
          {/*  STEP 2 — Dados do Proponente                         */}
          {/* ═══════════════════════════════════════════════════════ */}
          {step === 2 && (
            <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
              {sectionHeader(<User size={24} style={{ color: "#0071e3" }} />, "Dados do Proponente")}

              {renderProponenteFields(proponente, setProponente, cpfError, handleCpfChange, "Proponente")}

              {/* Segundo proponente toggle */}
              <div style={{ borderTop: "1px solid #f5f5f7", paddingTop: "1.5rem" }}>
                <div style={fieldWrap}>
                  <label style={labelStyle}>Gostaria de adicionar um segundo proponente?</label>
                  <select className="apple-select" value={adicionarSegundo} onChange={(e) => setAdicionarSegundo(e.target.value)}>
                    <option value="Não">Não</option>
                    <option value="Sim">Sim</option>
                  </select>
                </div>
              </div>

              {/* Segundo Proponente fields */}
              {adicionarSegundo === "Sim" && (
                <div style={{ padding: "2rem", backgroundColor: "#f5f5f7", borderRadius: "16px", border: "1px solid #e8e8ed", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                  <h3 style={{ margin: 0, color: "#0071e3", fontSize: "1.1rem", fontWeight: "700" }}>Dados do Segundo Proponente</h3>
                  {renderProponenteFields(segundoProponente, setSegundoProponente, cpf2Error, handleCpf2Change, "Segundo Proponente")}
                </div>
              )}
            </div>
          )}

          {/* ═══════════════════════════════════════════════════════ */}
          {/*  STEP 3 — Endereços                                   */}
          {/* ═══════════════════════════════════════════════════════ */}
          {step === 3 && (
            <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
              {sectionHeader(<MapPin size={24} style={{ color: "#0071e3" }} />, "Endereços")}

              {/* ── Endereço do Proponente ── */}
              <h3 style={{ margin: 0, color: "#1d1d1f", fontSize: "1.1rem", fontWeight: "700" }}>Endereço do Proponente</h3>

              <div style={{ display: "grid", gridTemplateColumns: "140px 1fr 100px", gap: "1rem" }}>
                <div style={fieldWrap}>
                  <label style={labelStyle}>CEP *</label>
                  <input type="text" className="apple-input" value={enderecoProponente.cep} onChange={(e) => {
                    const v = maskCEP(e.target.value);
                    setEnderecoProponente({ ...enderecoProponente, cep: v });
                    if (v.length === 9) buscarCEP(v, "proponente");
                  }} placeholder="00000-000" />
                </div>
                <div style={fieldWrap}>
                  <label style={labelStyle}>Logradouro *</label>
                  <input type="text" className="apple-input" value={enderecoProponente.logradouro} onChange={(e) => setEnderecoProponente({ ...enderecoProponente, logradouro: e.target.value })} placeholder="Rua, Avenida, etc." />
                </div>
                <div style={fieldWrap}>
                  <label style={labelStyle}>Número *</label>
                  <input type="text" className="apple-input" value={enderecoProponente.numero} onChange={(e) => setEnderecoProponente({ ...enderecoProponente, numero: e.target.value })} placeholder="Nº" />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 80px 1fr", gap: "1rem" }}>
                <div style={fieldWrap}>
                  <label style={labelStyle}>Bairro *</label>
                  <input type="text" className="apple-input" value={enderecoProponente.bairro} onChange={(e) => setEnderecoProponente({ ...enderecoProponente, bairro: e.target.value })} placeholder="Bairro" />
                </div>
                <div style={fieldWrap}>
                  <label style={labelStyle}>Cidade *</label>
                  <input type="text" className="apple-input" value={enderecoProponente.cidade} onChange={(e) => setEnderecoProponente({ ...enderecoProponente, cidade: e.target.value })} placeholder="Cidade" />
                </div>
                <div style={fieldWrap}>
                  <label style={labelStyle}>Estado *</label>
                  <input type="text" className="apple-input" style={{ textAlign: "center" }} maxLength={2} value={enderecoProponente.estado} onChange={(e) => setEnderecoProponente({ ...enderecoProponente, estado: e.target.value.toUpperCase() })} placeholder="UF" />
                </div>
                <div style={fieldWrap}>
                  <label style={labelStyle}>Complemento</label>
                  <input type="text" className="apple-input" value={enderecoProponente.complemento} onChange={(e) => setEnderecoProponente({ ...enderecoProponente, complemento: e.target.value })} placeholder="Apto, Bloco, etc." />
                </div>
              </div>

              {/* ── Divider ── */}
              <div style={{ borderTop: "2px solid #e8e8ed", margin: "0.5rem 0" }} />

              {/* ── Dados do Imóvel ── */}
              <h3 style={{ margin: 0, color: "#1d1d1f", fontSize: "1.1rem", fontWeight: "700" }}>Dados do Imóvel</h3>

              <div style={grid2}>
                <div style={fieldWrap}>
                  <label style={labelStyle}>Tipo do imóvel *</label>
                  <select className="apple-select" value={dadosImovel.tipo_imovel} onChange={(e) => setDadosImovel({ ...dadosImovel, tipo_imovel: e.target.value })}>
                    <option value="">Selecione</option>
                    <option value="Casa">Casa</option>
                    <option value="Apartamento">Apartamento</option>
                    <option value="Terreno">Terreno</option>
                    <option value="Comercial">Comercial</option>
                    <option value="Outro">Outro</option>
                  </select>
                </div>
                <div style={fieldWrap}>
                  <label style={labelStyle}>O imóvel já foi escolhido? *</label>
                  <select className="apple-select" value={dadosImovel.imovel_escolhido} onChange={(e) => setDadosImovel({ ...dadosImovel, imovel_escolhido: e.target.value })}>
                    <option value="">Selecione</option>
                    <option value="Sim">Sim</option>
                    <option value="Não">Não</option>
                  </select>
                </div>
              </div>

              {/* Situação (só se já escolhido = Sim) */}
              {dadosImovel.imovel_escolhido === "Sim" && (
                <div style={{ ...grid2, gridTemplateColumns: "1fr" }}>
                  <div style={fieldWrap}>
                    <label style={labelStyle}>Situação do imóvel *</label>
                    <select className="apple-select" value={dadosImovel.situacao_imovel} onChange={(e) => setDadosImovel({ ...dadosImovel, situacao_imovel: e.target.value })}>
                      <option value="">Selecione</option>
                      <option value="Novo">Novo</option>
                      <option value="Usado">Usado</option>
                    </select>
                  </div>
                </div>
              )}

              {/* ── Endereço do Imóvel (só se já escolhido = Sim) ── */}
              {dadosImovel.imovel_escolhido === "Sim" && (
                <>
                  <div style={{ borderTop: "1px dashed #0071e3", margin: "0.5rem 0" }} />
                  <h3 style={{ margin: 0, color: "#0071e3", fontSize: "1.1rem", fontWeight: "700" }}>Endereço do Imóvel</h3>

                  <div style={{ display: "grid", gridTemplateColumns: "140px 1fr 100px", gap: "1rem" }}>
                    <div style={fieldWrap}>
                      <label style={labelStyle}>CEP *</label>
                      <input type="text" className="apple-input" value={enderecoImovel.cep} onChange={(e) => {
                        const v = maskCEP(e.target.value);
                        setEnderecoImovel({ ...enderecoImovel, cep: v });
                        if (v.length === 9) buscarCEP(v, "imovel");
                      }} placeholder="00000-000" />
                    </div>
                    <div style={fieldWrap}>
                      <label style={labelStyle}>Logradouro *</label>
                      <input type="text" className="apple-input" value={enderecoImovel.logradouro} onChange={(e) => setEnderecoImovel({ ...enderecoImovel, logradouro: e.target.value })} placeholder="Rua, Avenida, etc." />
                    </div>
                    <div style={fieldWrap}>
                      <label style={labelStyle}>Número *</label>
                      <input type="text" className="apple-input" value={enderecoImovel.numero} onChange={(e) => setEnderecoImovel({ ...enderecoImovel, numero: e.target.value })} placeholder="Nº" />
                    </div>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 80px 1fr", gap: "1rem" }}>
                    <div style={fieldWrap}>
                      <label style={labelStyle}>Bairro *</label>
                      <input type="text" className="apple-input" value={enderecoImovel.bairro} onChange={(e) => setEnderecoImovel({ ...enderecoImovel, bairro: e.target.value })} placeholder="Bairro" />
                    </div>
                    <div style={fieldWrap}>
                      <label style={labelStyle}>Cidade *</label>
                      <input type="text" className="apple-input" value={enderecoImovel.cidade} onChange={(e) => setEnderecoImovel({ ...enderecoImovel, cidade: e.target.value })} placeholder="Cidade" />
                    </div>
                    <div style={fieldWrap}>
                      <label style={labelStyle}>Estado *</label>
                      <input type="text" className="apple-input" style={{ textAlign: "center" }} maxLength={2} value={enderecoImovel.estado} onChange={(e) => setEnderecoImovel({ ...enderecoImovel, estado: e.target.value.toUpperCase() })} placeholder="UF" />
                    </div>
                    <div style={fieldWrap}>
                      <label style={labelStyle}>Complemento</label>
                      <input type="text" className="apple-input" value={enderecoImovel.complemento} onChange={(e) => setEnderecoImovel({ ...enderecoImovel, complemento: e.target.value })} placeholder="Apto, Bloco, etc." />
                    </div>
                  </div>

                  {/* Valores do imóvel na seção de endereço */}
                  <div style={grid3}>
                    <div style={fieldWrap}>
                      <label style={labelStyle}>Valor do imóvel (R$)</label>
                      <input type="text" className="apple-input" value={enderecoImovel.valor_imovel} onChange={(e) => setEnderecoImovel({ ...enderecoImovel, valor_imovel: handleCurrencyInput(e.target.value) })} placeholder="R$ 0,00" />
                    </div>
                    <div style={fieldWrap}>
                      <label style={labelStyle}>Valor do financiamento (R$)</label>
                      <input type="text" className="apple-input" value={enderecoImovel.valor_financiamento} onChange={(e) => setEnderecoImovel({ ...enderecoImovel, valor_financiamento: handleCurrencyInput(e.target.value) })} placeholder="R$ 0,00" />
                    </div>
                    <div style={fieldWrap}>
                      <label style={labelStyle}>Prazo (meses)</label>
                      <input type="number" className="apple-input" value={enderecoImovel.prazo} onChange={(e) => setEnderecoImovel({ ...enderecoImovel, prazo: e.target.value })} placeholder="Ex: 360" />
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {/* ═══════════════════════════════════════════════════════ */}
          {/*  STEP 4 — Dados Financeiros                           */}
          {/* ═══════════════════════════════════════════════════════ */}
          {step === 4 && (
            <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
              {sectionHeader(<Wallet size={24} style={{ color: "#0071e3" }} />, "Dados Financeiros")}

              <div style={grid3}>
                <div style={fieldWrap}>
                  <label style={labelStyle}>Fonte de renda *</label>
                  <select className="apple-select" value={financeiro.fonte_renda} onChange={(e) => setFinanceiro({ ...financeiro, fonte_renda: e.target.value })}>
                    <option value="">Selecione</option>
                    <option value="CLT">CLT</option>
                    <option value="Autônomo">Autônomo</option>
                    <option value="Empresário">Empresário</option>
                    <option value="Funcionário Público">Funcionário Público</option>
                    <option value="Aposentado">Aposentado</option>
                    <option value="Outro">Outro</option>
                  </select>
                </div>
                <div style={fieldWrap}>
                  <label style={labelStyle}>Renda mensal (R$) *</label>
                  <input type="text" className="apple-input" value={financeiro.renda_mensal} onChange={(e) => setFinanceiro({ ...financeiro, renda_mensal: handleCurrencyInput(e.target.value) })} placeholder="R$ 0,00" />
                </div>
                <div style={fieldWrap}>
                  <label style={labelStyle}>Profissão *</label>
                  <input type="text" className="apple-input" value={financeiro.profissao} onChange={(e) => setFinanceiro({ ...financeiro, profissao: e.target.value })} placeholder="Ex: Engenheiro, Médico" />
                </div>
              </div>

              {/* ── Contas Bancárias (opcional) ── */}
              <div style={{ borderTop: "1px solid #f5f5f7", paddingTop: "1.5rem" }}>
                <h3 style={{ margin: "0 0 1.25rem 0", color: "#1d1d1f", fontSize: "1.1rem", fontWeight: "700" }}>Contas Bancárias (opcional)</h3>

                <div style={grid2}>
                  <div style={fieldWrap}>
                    <label style={labelStyle}>Agência Santander</label>
                    <input type="text" className="apple-input" value={contas.ag_santander} onChange={(e) => setContas({ ...contas, ag_santander: e.target.value })} placeholder="Nº da agência" />
                  </div>
                  <div style={fieldWrap}>
                    <label style={labelStyle}>Conta Santander</label>
                    <input type="text" className="apple-input" value={contas.cc_santander} onChange={(e) => setContas({ ...contas, cc_santander: e.target.value })} placeholder="Nº da conta" />
                  </div>
                </div>

                <div style={{ ...grid2, marginTop: "1.25rem" }}>
                  <div style={fieldWrap}>
                    <label style={labelStyle}>Agência Itaú</label>
                    <input type="text" className="apple-input" value={contas.ag_itau} onChange={(e) => setContas({ ...contas, ag_itau: e.target.value })} placeholder="Nº da agência" />
                  </div>
                  <div style={fieldWrap}>
                    <label style={labelStyle}>Conta Itaú</label>
                    <input type="text" className="apple-input" value={contas.cc_itau} onChange={(e) => setContas({ ...contas, cc_itau: e.target.value })} placeholder="Nº da conta" />
                  </div>
                </div>

                <div style={{ ...grid2, marginTop: "1.25rem" }}>
                  <div style={fieldWrap}>
                    <label style={labelStyle}>Agência Bradesco</label>
                    <input type="text" className="apple-input" value={contas.ag_bradesco} onChange={(e) => setContas({ ...contas, ag_bradesco: e.target.value })} placeholder="Nº da agência" />
                  </div>
                  <div style={fieldWrap}>
                    <label style={labelStyle}>Conta Bradesco</label>
                    <input type="text" className="apple-input" value={contas.cc_bradesco} onChange={(e) => setContas({ ...contas, cc_bradesco: e.target.value })} placeholder="Nº da conta" />
                  </div>
                </div>
              </div>

              {/* ── Informações Adicionais ── */}
              <div style={{ borderTop: "1px solid #f5f5f7", paddingTop: "1.5rem" }}>
                <h3 style={{ margin: "0 0 1rem 0", color: "#1d1d1f", fontSize: "1.1rem", fontWeight: "700" }}>Informações Adicionais</h3>
                <div style={fieldWrap}>
                  <textarea className="apple-textarea" rows={4} value={infoAdicional} onChange={(e) => setInfoAdicional(e.target.value)} placeholder="Informe aqui qualquer informação complementar relevante para a análise do seu financiamento..." />
                </div>
              </div>
            </div>
          )}

          {/* ═══════════════════════════════════════════════════════ */}
          {/*  STEP 5 — Finalizar & Termos                          */}
          {/* ═══════════════════════════════════════════════════════ */}
          {step === 5 && (
            <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
              {sectionHeader(<ShieldCheck size={24} style={{ color: "#34c759" }} />, "Finalizar & Termos")}

              <div style={{ fontSize: "0.95rem", color: "#86868b", lineHeight: "1.7" }}>
                <p style={{ margin: 0 }}>
                  Você está prestes a submeter sua proposta de <strong style={{ color: "#1d1d1f" }}>Financiamento Imobiliário</strong> para análise da equipe <strong style={{ color: "#1d1d1f" }}>RMJ Soluções de Crédito</strong>. Revise seus dados nas etapas anteriores antes de confirmar o envio.
                </p>
              </div>

              {/* Documentos necessários */}
              <div style={{ padding: "1.5rem", backgroundColor: "#f5f5f7", borderRadius: "12px", border: "1px solid #e8e8ed" }}>
                <h4 style={{ margin: "0 0 0.75rem 0", color: "#1d1d1f", fontWeight: "700", fontSize: "0.95rem" }}>Documentos Necessários:</h4>
                <ul style={{ margin: 0, paddingLeft: "1.25rem", color: "#86868b", fontSize: "0.85rem", lineHeight: "1.8" }}>
                  <li>Comprovante de renda atualizado (holerite, pró-labore ou declaração)</li>
                  <li>Documento de identificação (RG e CPF)</li>
                  <li>Comprovante de residência recente (últimos 90 dias)</li>
                  <li>Certidão de estado civil atualizada</li>
                  <li>Extrato do FGTS (se aplicável)</li>
                </ul>
              </div>

              {/* LGPD */}
              <div style={{ display: "flex", gap: "0.75rem", alignItems: "start", marginTop: "1rem" }}>
                <input
                  type="checkbox"
                  id="aceite_lgpd"
                  checked={aceiteLgpd}
                  onChange={(e) => setAceiteLgpd(e.target.checked)}
                  style={{ width: "18px", height: "18px", marginTop: "0.15rem", cursor: "pointer", accentColor: "#0071e3" }}
                />
                <label htmlFor="aceite_lgpd" style={{ fontSize: "0.85rem", color: "#86868b", cursor: "pointer", fontWeight: "500", lineHeight: "1.6" }}>
                  Declaro que as informações prestadas são verdadeiras e autorizo a <strong>RMJ Soluções de Crédito</strong> a consultar, coletar e tratar meus dados pessoais exclusivamente para fins de análise e viabilização do financiamento imobiliário solicitado, em conformidade com a <strong>Lei Geral de Proteção de Dados (LGPD — Lei 13.709/2018)</strong>. *
                </label>
              </div>
            </div>
          )}

          {/* ═══════════════════════════════════════════════════════ */}
          {/*  NAVIGATION FOOTER                                     */}
          {/* ═══════════════════════════════════════════════════════ */}
          <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", marginTop: "3rem", paddingTop: "1.5rem", borderTop: "1px solid #f5f5f7" }}>
            {step > 1 ? (
              <button
                type="button"
                onClick={() => { setError(""); setStep((prev) => prev - 1); window.scrollTo(0, 0); }}
                style={{
                  display: "inline-flex", alignItems: "center", gap: "0.5rem",
                  padding: "0.75rem 1.5rem", fontSize: "0.9rem", fontWeight: "600",
                  color: "#0071e3", backgroundColor: "transparent",
                  border: "1.5px solid #0071e3", borderRadius: "12px",
                  cursor: "pointer", transition: "all 0.2s ease",
                  fontFamily: "inherit",
                }}
              >
                <ArrowLeft size={16} /> Voltar
              </button>
            ) : (
              <div />
            )}

            {step < 5 ? (
              <button
                type="button"
                onClick={handleNext}
                style={{
                  display: "inline-flex", alignItems: "center", gap: "0.5rem",
                  padding: "0.75rem 1.5rem", fontSize: "0.9rem", fontWeight: "600",
                  color: "#ffffff", backgroundColor: "#0071e3",
                  border: "1.5px solid #0071e3", borderRadius: "12px",
                  cursor: "pointer", transition: "all 0.2s ease",
                  fontFamily: "inherit",
                }}
              >
                Avançar <ArrowRight size={16} />
              </button>
            ) : (
              <button
                type="submit"
                disabled={loading}
                style={{
                  display: "inline-flex", alignItems: "center", gap: "0.5rem",
                  padding: "0.85rem 2rem", fontSize: "0.95rem", fontWeight: "700",
                  color: "#ffffff", backgroundColor: "#30d158",
                  border: "1.5px solid #30d158", borderRadius: "12px",
                  cursor: loading ? "not-allowed" : "pointer",
                  opacity: loading ? 0.7 : 1,
                  transition: "all 0.2s ease",
                  fontFamily: "inherit",
                }}
              >
                {loading ? "Enviando dados..." : "Enviar Proposta 🚀"}
              </button>
            )}
          </div>

        </form>

      </div>

      {/* ═══════════════════════════════════════════════════════ */}
      {/*  Apple UI Global Styles                                */}
      {/* ═══════════════════════════════════════════════════════ */}
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
