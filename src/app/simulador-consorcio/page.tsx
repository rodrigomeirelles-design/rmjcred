"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, CheckCircle2, Home, Car, Bike, Truck } from "lucide-react";

const TOTAL_STEPS = 6;

const OBJETIVOS = [
  { label: "Imóvel", desc: "Casa, apartamento, terreno, construção ou reforma", icon: Home },
  { label: "Veículo", desc: "Carro zero-km, seminovo ou utilitário", icon: Car },
  { label: "Moto", desc: "Motocicleta urbana, trabalho ou alta cilindrada", icon: Bike },
  { label: "Máquinas ou frota da empresa", desc: "Caminhões, implementos agrícolas ou frota corporativa", icon: Truck },
];

const PREFERENCIAS = [
  "Valor do crédito",
  "Parcela que cabe no bolso",
];

const PRAZOS_CONTEMPLACAO = [
  "Imediato - carta contemplada",
  "Até 6 meses",
  "6 a 12 meses",
  "12 a 24 meses",
  "Sem pressa",
];

const OPCOES_LANCE = [
  "Sim",
  "Não",
  "Não sei",
];

function formatBRL(val: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  }).format(val);
}

export default function SimuladorConsorcioPage() {
  const [step, setStep] = useState(1);
  const [objetivo, setObjetivo] = useState("");
  const [valorCarta, setValorCarta] = useState<number>(150000);
  const [valorDigitado, setValorDigitado] = useState<string>("R$ 150.000");
  const [preferenciaSimulacao, setPreferenciaSimulacao] = useState("");
  const [prazoContemplacao, setPrazoContemplacao] = useState("");
  const [temLanceOuFgts, setTemLanceOuFgts] = useState("");

  const [nome, setNome] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [cidade, setCidade] = useState("");
  const [tipoPessoa, setTipoPessoa] = useState<"Pessoa Física" | "Empresa">("Pessoa Física");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const progressPercentage = Math.round((step / TOTAL_STEPS) * 100);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const num = Number(e.target.value);
    setValorCarta(num);
    setValorDigitado(formatBRL(num));
  };

  const handleValorInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digits = e.target.value.replace(/\D/g, "");
    if (!digits) {
      setValorDigitado("");
      return;
    }
    const num = parseInt(digits, 10);
    setValorCarta(Math.min(1000000, Math.max(30000, num)));
    setValorDigitado(formatBRL(num));
  };

  const handleWhatsappChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digits = e.target.value.replace(/\D/g, "").slice(0, 11);
    if (digits.length <= 2) {
      setWhatsapp(digits);
    } else if (digits.length <= 7) {
      setWhatsapp(`(${digits.slice(0, 2)}) ${digits.slice(2)}`);
    } else {
      setWhatsapp(`(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!nome.trim() || !whatsapp.trim() || !cidade.trim()) {
      setErrorMsg("Por favor, preencha seu nome, WhatsApp e cidade para concluir.");
      return;
    }

    setIsSubmitting(true);

    const payload = {
      origem: "simulador-consorcio",
      servico: `Consórcio — ${objetivo}`,
      objetivo,
      valor: valorCarta,
      valorFormatado: formatBRL(valorCarta),
      preferenciaSimulacao,
      prazoContemplacao,
      temLanceOuFgts,
      nome: nome.trim(),
      telefone: whatsapp.trim(),
      whatsapp: whatsapp.trim(),
      cidade: cidade.trim(),
      tipoPessoa,
      detalhes_simulacao: {
        objetivo,
        valor_carta: valorCarta,
        preferencia_simulacao: preferenciaSimulacao,
        prazo_contemplacao: prazoContemplacao,
        tem_lance_ou_fgts: temLanceOuFgts,
        cidade: cidade.trim(),
        tipo_pessoa: tipoPessoa,
      },
    };

    try {
      await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      // Dispara o evento "lead_consorcio" no dataLayer do Google Tag Manager
      if (typeof window !== "undefined") {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const w = window as any;
        w.dataLayer = w.dataLayer || [];
        w.dataLayer.push({
          event: "lead_consorcio",
          origem: "simulador-consorcio",
          objetivo,
          valor_carta: valorCarta,
          preferencia_simulacao: preferenciaSimulacao,
          prazo_contemplacao: prazoContemplacao,
          tem_lance_ou_fgts: temLanceOuFgts,
          cidade: cidade.trim(),
          tipo_pessoa: tipoPessoa,
        });
      }

      setSubmitted(true);
    } catch (err) {
      console.error("Erro ao enviar simulação de consórcio:", err);
      setErrorMsg("Não foi possível enviar no momento. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      style={{
        backgroundColor: "#F8FAFC",
        minHeight: "calc(100vh - 70px)",
        padding: "3.5rem 0 5rem 0",
      }}
    >
      <div className="container" style={{ maxWidth: "680px" }}>
        <div style={{ marginBottom: "1.5rem" }}>
          <Link
            href="/consorcios"
            style={{
              fontSize: "0.9rem",
              fontWeight: 600,
              color: "#475569",
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              gap: "0.35rem",
            }}
          >
            <ArrowLeft size={16} /> Voltar para Consórcios
          </Link>
        </div>

        <div
          style={{
            background: "#ffffff",
            borderRadius: "20px",
            border: "1px solid #E2E8F0",
            boxShadow: "0 16px 40px rgba(15, 23, 42, 0.07)",
            padding: "clamp(1.75rem, 4vw, 2.75rem)",
          }}
        >
          {submitted ? (
            <div style={{ textAlign: "center", padding: "2rem 0.5rem" }}>
              <div
                style={{
                  width: "68px",
                  height: "68px",
                  borderRadius: "50%",
                  background: "rgba(34, 197, 94, 0.12)",
                  color: "#16A34A",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 1.5rem auto",
                }}
              >
                <CheckCircle2 size={38} />
              </div>
              <h1
                style={{
                  fontSize: "clamp(1.5rem, 3vw, 2rem)",
                  color: "#162F4B",
                  fontWeight: 800,
                  lineHeight: 1.3,
                  marginBottom: "1rem",
                }}
              >
                Recebemos sua simulação. A RMJ vai te chamar no WhatsApp.
              </h1>
              <p style={{ color: "#475569", fontSize: "1rem", lineHeight: 1.7, marginBottom: "2rem" }}>
                Nossa equipe de especialistas em <strong>Itajubá e Sul de Minas</strong> já está analisando as opções de grupos compatíveis com o seu perfil ({objetivo} — {formatBRL(valorCarta)}).
              </p>
              <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
                <a
                  href={`https://wa.me/5535991084513?text=${encodeURIComponent(
                    `Olá! Acabei de preencher o Simulador de Consórcio no site da RMJ (${objetivo} - ${formatBRL(valorCarta)}) e gostaria de conversar.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary"
                >
                  Chamar no WhatsApp Agora
                </a>
                <Link href="/consorcios" className="btn btn-secondary">
                  Voltar para Consórcios
                </Link>
              </div>
            </div>
          ) : (
            <>
              {/* Cabeçalho e Barra de Progresso */}
              <div style={{ marginBottom: "2rem" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "0.6rem",
                  }}
                >
                  <span
                    style={{
                      fontSize: "0.78rem",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: "0.06em",
                      color: "#EE661C",
                    }}
                  >
                    Simulador de Consórcio RMJ — Etapa {step} de {TOTAL_STEPS}
                  </span>
                  <span style={{ fontSize: "0.82rem", fontWeight: 700, color: "#64748B" }}>
                    {progressPercentage}%
                  </span>
                </div>
                <div
                  style={{
                    width: "100%",
                    height: "8px",
                    backgroundColor: "#E2E8F0",
                    borderRadius: "999px",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      width: `${progressPercentage}%`,
                      height: "100%",
                      backgroundColor: "#EE661C",
                      transition: "width 0.3s ease",
                    }}
                  />
                </div>
              </div>

              {/* ETAPA 1: O que você quer conquistar? */}
              {step === 1 && (
                <div>
                  <h1
                    style={{
                      fontSize: "clamp(1.4rem, 3vw, 1.8rem)",
                      color: "#162F4B",
                      fontWeight: 800,
                      marginBottom: "0.5rem",
                    }}
                  >
                    1. O que você quer conquistar?
                  </h1>
                  <p style={{ color: "#64748B", fontSize: "0.95rem", marginBottom: "1.5rem" }}>
                    Selecione a categoria do bem que você planeja adquirir com o consórcio:
                  </p>

                  <div style={{ display: "grid", gap: "0.9rem" }}>
                    {OBJETIVOS.map((item) => {
                      const IconComponent = item.icon;
                      const selected = objetivo === item.label;
                      return (
                        <button
                          key={item.label}
                          type="button"
                          onClick={() => {
                            setObjetivo(item.label);
                            setStep(2);
                          }}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "1rem",
                            width: "100%",
                            textAlign: "left",
                            padding: "1.15rem 1.25rem",
                            borderRadius: "12px",
                            border: selected ? "2px solid #EE661C" : "1px solid #CBD5E1",
                            background: selected ? "rgba(238, 102, 28, 0.06)" : "#F8FAFC",
                            cursor: "pointer",
                            fontFamily: "inherit",
                            transition: "all 0.2s ease",
                          }}
                        >
                          <div
                            style={{
                              width: "44px",
                              height: "44px",
                              borderRadius: "10px",
                              background: selected ? "#EE661C" : "#162F4B",
                              color: "#ffffff",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              flexShrink: 0,
                            }}
                          >
                            <IconComponent size={22} />
                          </div>
                          <div>
                            <div style={{ fontSize: "1.02rem", fontWeight: 700, color: "#162F4B" }}>
                              {item.label}
                            </div>
                            <div style={{ fontSize: "0.86rem", color: "#64748B", marginTop: "0.15rem" }}>
                              {item.desc}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* ETAPA 2: Valor da carta de crédito */}
              {step === 2 && (
                <div>
                  <h2
                    style={{
                      fontSize: "clamp(1.4rem, 3vw, 1.8rem)",
                      color: "#162F4B",
                      fontWeight: 800,
                      marginBottom: "0.5rem",
                    }}
                  >
                    2. Valor da carta de crédito
                  </h2>
                  <p style={{ color: "#64748B", fontSize: "0.95rem", marginBottom: "1.5rem" }}>
                    Use o controle deslizante (de R$ 30 mil a R$ 1 milhão) ou digite o valor desejado:
                  </p>

                  <div
                    style={{
                      background: "#F8FAFC",
                      border: "1px solid #E2E8F0",
                      borderRadius: "14px",
                      padding: "1.5rem",
                      marginBottom: "1.5rem",
                    }}
                  >
                    <label
                      htmlFor="valor-digitado"
                      style={{
                        display: "block",
                        fontSize: "0.85rem",
                        fontWeight: 700,
                        color: "#475569",
                        marginBottom: "0.5rem",
                      }}
                    >
                      Valor estimado da carta (R$)
                    </label>
                    <input
                      id="valor-digitado"
                      type="text"
                      value={valorDigitado}
                      onChange={handleValorInputChange}
                      placeholder="R$ 150.000"
                      style={{
                        width: "100%",
                        padding: "0.9rem 1rem",
                        fontSize: "1.35rem",
                        fontWeight: 800,
                        color: "#162F4B",
                        borderRadius: "10px",
                        border: "1px solid #CBD5E1",
                        background: "#ffffff",
                        fontFamily: "inherit",
                        marginBottom: "1.25rem",
                      }}
                    />

                    <input
                      type="range"
                      min={30000}
                      max={1000000}
                      step={5000}
                      value={valorCarta}
                      onChange={handleSliderChange}
                      style={{
                        width: "100%",
                        accentColor: "#EE661C",
                        cursor: "pointer",
                      }}
                    />
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        fontSize: "0.8rem",
                        fontWeight: 600,
                        color: "#64748B",
                        marginTop: "0.4rem",
                      }}
                    >
                      <span>R$ 30.000</span>
                      <span>R$ 500.000</span>
                      <span>R$ 1.000.000</span>
                    </div>
                  </div>

                  <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem" }}>
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="btn btn-secondary"
                      style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem" }}
                    >
                      <ArrowLeft size={16} /> Voltar
                    </button>
                    <button
                      type="button"
                      onClick={() => setStep(3)}
                      className="btn btn-primary"
                      style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem" }}
                    >
                      Continuar <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
              )}

              {/* ETAPA 3: Prefere simular por */}
              {step === 3 && (
                <div>
                  <h2
                    style={{
                      fontSize: "clamp(1.4rem, 3vw, 1.8rem)",
                      color: "#162F4B",
                      fontWeight: 800,
                      marginBottom: "0.5rem",
                    }}
                  >
                    3. Prefere simular por:
                  </h2>
                  <p style={{ color: "#64748B", fontSize: "0.95rem", marginBottom: "1.5rem" }}>
                    Escolha qual critério é mais importante para dimensionarmos o seu plano:
                  </p>

                  <div style={{ display: "grid", gap: "0.9rem", marginBottom: "1.5rem" }}>
                    {PREFERENCIAS.map((pref) => {
                      const selected = preferenciaSimulacao === pref;
                      return (
                        <button
                          key={pref}
                          type="button"
                          onClick={() => {
                            setPreferenciaSimulacao(pref);
                            setStep(4);
                          }}
                          style={{
                            width: "100%",
                            textAlign: "left",
                            padding: "1.2rem 1.35rem",
                            borderRadius: "12px",
                            border: selected ? "2px solid #EE661C" : "1px solid #CBD5E1",
                            background: selected ? "rgba(238, 102, 28, 0.06)" : "#F8FAFC",
                            fontSize: "1.02rem",
                            fontWeight: 700,
                            color: "#162F4B",
                            cursor: "pointer",
                            fontFamily: "inherit",
                          }}
                        >
                          {pref}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="btn btn-secondary"
                    style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem" }}
                  >
                    <ArrowLeft size={16} /> Voltar
                  </button>
                </div>
              )}

              {/* ETAPA 4: Quando você gostaria de ser contemplado? */}
              {step === 4 && (
                <div>
                  <h2
                    style={{
                      fontSize: "clamp(1.4rem, 3vw, 1.8rem)",
                      color: "#162F4B",
                      fontWeight: 800,
                      marginBottom: "0.5rem",
                    }}
                  >
                    4. Quando você gostaria de ser contemplado?
                  </h2>
                  <p style={{ color: "#64748B", fontSize: "0.95rem", marginBottom: "1.5rem" }}>
                    Informe sua expectativa de prazo para selecionarmos os grupos mais adequados:
                  </p>

                  <div style={{ display: "grid", gap: "0.85rem", marginBottom: "1.5rem" }}>
                    {PRAZOS_CONTEMPLACAO.map((prazo) => {
                      const selected = prazoContemplacao === prazo;
                      return (
                        <button
                          key={prazo}
                          type="button"
                          onClick={() => {
                            setPrazoContemplacao(prazo);
                            setStep(5);
                          }}
                          style={{
                            width: "100%",
                            textAlign: "left",
                            padding: "1.1rem 1.35rem",
                            borderRadius: "12px",
                            border: selected ? "2px solid #EE661C" : "1px solid #CBD5E1",
                            background: selected ? "rgba(238, 102, 28, 0.06)" : "#F8FAFC",
                            fontSize: "1rem",
                            fontWeight: 700,
                            color: "#162F4B",
                            cursor: "pointer",
                            fontFamily: "inherit",
                          }}
                        >
                          {prazo}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    type="button"
                    onClick={() => setStep(3)}
                    className="btn btn-secondary"
                    style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem" }}
                  >
                    <ArrowLeft size={16} /> Voltar
                  </button>
                </div>
              )}

              {/* ETAPA 5: Tem valor para lance ou FGTS? */}
              {step === 5 && (
                <div>
                  <h2
                    style={{
                      fontSize: "clamp(1.4rem, 3vw, 1.8rem)",
                      color: "#162F4B",
                      fontWeight: 800,
                      marginBottom: "0.5rem",
                    }}
                  >
                    5. Tem valor para lance ou FGTS?
                  </h2>
                  <p style={{ color: "#64748B", fontSize: "0.95rem", marginBottom: "1.5rem" }}>
                    Mesmo que não tenha recurso próprio para lance, avaliamos opções com lance embutido:
                  </p>

                  <div style={{ display: "grid", gap: "0.85rem", marginBottom: "1.5rem" }}>
                    {OPCOES_LANCE.map((opcao) => {
                      const selected = temLanceOuFgts === opcao;
                      return (
                        <button
                          key={opcao}
                          type="button"
                          onClick={() => {
                            setTemLanceOuFgts(opcao);
                            setStep(6);
                          }}
                          style={{
                            width: "100%",
                            textAlign: "left",
                            padding: "1.1rem 1.35rem",
                            borderRadius: "12px",
                            border: selected ? "2px solid #EE661C" : "1px solid #CBD5E1",
                            background: selected ? "rgba(238, 102, 28, 0.06)" : "#F8FAFC",
                            fontSize: "1rem",
                            fontWeight: 700,
                            color: "#162F4B",
                            cursor: "pointer",
                            fontFamily: "inherit",
                          }}
                        >
                          {opcao}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    type="button"
                    onClick={() => setStep(4)}
                    className="btn btn-secondary"
                    style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem" }}
                  >
                    <ArrowLeft size={16} /> Voltar
                  </button>
                </div>
              )}

              {/* ETAPA 6: Dados de Contato */}
              {step === 6 && (
                <form onSubmit={handleSubmit}>
                  <h2
                    style={{
                      fontSize: "clamp(1.4rem, 3vw, 1.8rem)",
                      color: "#162F4B",
                      fontWeight: 800,
                      marginBottom: "0.5rem",
                    }}
                  >
                    6. Para quem enviamos o estudo personalizado?
                  </h2>
                  <p style={{ color: "#64748B", fontSize: "0.95rem", marginBottom: "1.5rem" }}>
                    Preencha seus dados para receber a simulação detalhada no seu WhatsApp:
                  </p>

                  <div style={{ display: "grid", gap: "1.1rem", marginBottom: "1.5rem" }}>
                    <div>
                      <label
                        htmlFor="sim-nome"
                        style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, color: "#162F4B", marginBottom: "0.35rem" }}
                      >
                        Nome completo *
                      </label>
                      <input
                        id="sim-nome"
                        type="text"
                        required
                        value={nome}
                        onChange={(e) => setNome(e.target.value)}
                        placeholder="Digite seu nome"
                        style={{
                          width: "100%",
                          padding: "0.85rem 1rem",
                          borderRadius: "10px",
                          border: "1px solid #CBD5E1",
                          fontSize: "0.95rem",
                          fontFamily: "inherit",
                        }}
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="sim-whatsapp"
                        style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, color: "#162F4B", marginBottom: "0.35rem" }}
                      >
                        WhatsApp *
                      </label>
                      <input
                        id="sim-whatsapp"
                        type="tel"
                        required
                        value={whatsapp}
                        onChange={handleWhatsappChange}
                        placeholder="(35) 99999-9999"
                        style={{
                          width: "100%",
                          padding: "0.85rem 1rem",
                          borderRadius: "10px",
                          border: "1px solid #CBD5E1",
                          fontSize: "0.95rem",
                          fontFamily: "inherit",
                        }}
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="sim-cidade"
                        style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, color: "#162F4B", marginBottom: "0.35rem" }}
                      >
                        Cidade *
                      </label>
                      <input
                        id="sim-cidade"
                        type="text"
                        required
                        value={cidade}
                        onChange={(e) => setCidade(e.target.value)}
                        placeholder="Ex: Itajubá - MG"
                        style={{
                          width: "100%",
                          padding: "0.85rem 1rem",
                          borderRadius: "10px",
                          border: "1px solid #CBD5E1",
                          fontSize: "0.95rem",
                          fontFamily: "inherit",
                        }}
                      />
                    </div>

                    <div>
                      <label
                        style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, color: "#162F4B", marginBottom: "0.45rem" }}
                      >
                        A simulação é para: *
                      </label>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                        {(["Pessoa Física", "Empresa"] as const).map((tipo) => {
                          const active = tipoPessoa === tipo;
                          return (
                            <button
                              key={tipo}
                              type="button"
                              onClick={() => setTipoPessoa(tipo)}
                              style={{
                                padding: "0.85rem 1rem",
                                borderRadius: "10px",
                                border: active ? "2px solid #EE661C" : "1px solid #CBD5E1",
                                background: active ? "rgba(238, 102, 28, 0.08)" : "#F8FAFC",
                                fontWeight: 700,
                                color: "#162F4B",
                                cursor: "pointer",
                                fontFamily: "inherit",
                              }}
                            >
                              {tipo}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {errorMsg && (
                    <p style={{ color: "#DC2626", fontSize: "0.9rem", fontWeight: 600, marginBottom: "1rem" }}>
                      {errorMsg}
                    </p>
                  )}

                  <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap" }}>
                    <button
                      type="button"
                      onClick={() => setStep(5)}
                      className="btn btn-secondary"
                      style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem" }}
                    >
                      <ArrowLeft size={16} /> Voltar
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="btn btn-primary"
                      style={{ flex: 1, minWidth: "220px" }}
                    >
                      {isSubmitting ? "Enviando..." : "Receber Simulação no WhatsApp"}
                    </button>
                  </div>
                </form>
              )}
            </>
          )}
        </div>
      </div>
    </section>
  );
}
