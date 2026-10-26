"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import styles from "../consorcios/page.module.css";

function formatBRL(val: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(val);
}

/**
 * Calcula a parcela fixa (Tabela Price) para taxa mensal `i` (decimal) e `n` meses.
 */
function calcPriceInstallment(principal: number, monthlyRateDecimal: number, months: number): number {
  if (months <= 0) return 0;
  if (monthlyRateDecimal <= 0) return principal / months;
  const factor = Math.pow(1 + monthlyRateDecimal, months);
  return principal * ((monthlyRateDecimal * factor) / (factor - 1));
}

export default function ComparadorPage() {
  const [valorCredito, setValorCredito] = useState<number>(300000);
  const [prazoMeses, setPrazoMeses] = useState<number>(180);

  // Taxa de administração TOTAL do consórcio no período (%)
  const [taxaAdminTotalConsorcio, setTaxaAdminTotalConsorcio] = useState<number>(18);
  // Taxa de juros mensal do financiamento tradicional (% a.m.)
  const [taxaMensalFinanciamento, setTaxaMensalFinanciamento] = useState<number>(0.95);
  // Taxa de juros mensal do Home Equity (% a.m.)
  const [taxaMensalHomeEquity, setTaxaMensalHomeEquity] = useState<number>(1.09);

  const resultados = useMemo(() => {
    const meses = Math.max(1, prazoMeses);
    const capital = Math.max(0, valorCredito);

    // 1. Consórcio: capital + taxa administrativa total diluída no período
    const custoAdminConsorcio = capital * (taxaAdminTotalConsorcio / 100);
    const totalConsorcio = capital + custoAdminConsorcio;
    const parcelaConsorcio = totalConsorcio / meses;

    // 2. Financiamento (Price estimada)
    const iFinanc = Math.max(0, taxaMensalFinanciamento) / 100;
    const parcelaFinanciamento = calcPriceInstallment(capital, iFinanc, meses);
    const totalFinanciamento = parcelaFinanciamento * meses;
    const jurosFinanciamento = totalFinanciamento - capital;

    // 3. Home Equity (Price estimada)
    const iHomeEquity = Math.max(0, taxaMensalHomeEquity) / 100;
    const parcelaHomeEquity = calcPriceInstallment(capital, iHomeEquity, meses);
    const totalHomeEquity = parcelaHomeEquity * meses;
    const jurosHomeEquity = totalHomeEquity - capital;

    return {
      consorcio: {
        parcela: parcelaConsorcio,
        custoAdicional: custoAdminConsorcio,
        total: totalConsorcio,
      },
      financiamento: {
        parcela: parcelaFinanciamento,
        custoAdicional: jurosFinanciamento,
        total: totalFinanciamento,
      },
      homeEquity: {
        parcela: parcelaHomeEquity,
        custoAdicional: jurosHomeEquity,
        total: totalHomeEquity,
      },
    };
  }, [valorCredito, prazoMeses, taxaAdminTotalConsorcio, taxaMensalFinanciamento, taxaMensalHomeEquity]);

  return (
    <>
      {/* ── HERO ────────────────────────────────────────────── */}
      <section className={styles.headerSection}>
        <div className={`${styles.titleContainer} container`}>
          <Link href="/" className={styles.backLink}>
            &larr; Voltar para a Página Inicial
          </Link>
          <h1 className={styles.title} style={{ maxWidth: "840px" }}>
            Comparador Financeiro: Consórcio x Financiamento x Home Equity
          </h1>
          <p className={styles.leadText}>
            Simule e compare o custo total estimado de cada modalidade informando o valor desejado, o prazo em meses e as taxas de referência.
          </p>
        </div>
      </section>

      {/* ── CALCULADORA ─────────────────────────────────────── */}
      <section className={`${styles.editorialSectionAlt} section`}>
        <div className="container">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: "2rem",
              alignItems: "start",
            }}
          >
            {/* Painel de Parâmetros */}
            <div className={styles.infoCard} style={{ padding: "2rem" }}>
              <span className={styles.chartBadge}>Parâmetros da Simulação</span>
              <h2 className={styles.editorialSubheading} style={{ marginTop: "0.25rem" }}>
                Informe os valores e taxas
              </h2>

              <div className={styles.simField} style={{ marginTop: "0.75rem" }}>
                <label className={styles.simLabel} htmlFor="comp-valor">
                  Valor do Crédito / Bem (R$)
                </label>
                <input
                  id="comp-valor"
                  type="number"
                  min={10000}
                  step={5000}
                  value={valorCredito}
                  onChange={(e) => setValorCredito(Number(e.target.value))}
                  className={styles.simInput}
                />
              </div>

              <div className={styles.simField}>
                <label className={styles.simLabel} htmlFor="comp-prazo">
                  Prazo de Pagamento (meses)
                </label>
                <input
                  id="comp-prazo"
                  type="number"
                  min={12}
                  max={420}
                  step={6}
                  value={prazoMeses}
                  onChange={(e) => setPrazoMeses(Number(e.target.value))}
                  className={styles.simInput}
                />
              </div>

              <div className={styles.simField}>
                <label className={styles.simLabel} htmlFor="comp-taxa-consorcio">
                  Taxa de Administração Total do Consórcio (% no período)
                </label>
                <input
                  id="comp-taxa-consorcio"
                  type="number"
                  min={1}
                  max={40}
                  step={0.5}
                  value={taxaAdminTotalConsorcio}
                  onChange={(e) => setTaxaAdminTotalConsorcio(Number(e.target.value))}
                  className={styles.simInput}
                />
              </div>

              <div className={styles.simField}>
                <label className={styles.simLabel} htmlFor="comp-taxa-financ">
                  Taxa de Juros do Financiamento (% ao mês)
                </label>
                <input
                  id="comp-taxa-financ"
                  type="number"
                  min={0.1}
                  max={10}
                  step={0.05}
                  value={taxaMensalFinanciamento}
                  onChange={(e) => setTaxaMensalFinanciamento(Number(e.target.value))}
                  className={styles.simInput}
                />
              </div>

              <div className={styles.simField}>
                <label className={styles.simLabel} htmlFor="comp-taxa-he">
                  Taxa de Juros do Home Equity (% ao mês)
                </label>
                <input
                  id="comp-taxa-he"
                  type="number"
                  min={0.1}
                  max={10}
                  step={0.05}
                  value={taxaMensalHomeEquity}
                  onChange={(e) => setTaxaMensalHomeEquity(Number(e.target.value))}
                  className={styles.simInput}
                />
              </div>
            </div>

            {/* Cards de Resultado */}
            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              <div className={styles.cardsGrid3} style={{ marginTop: 0 }}>
                {/* Card Consórcio */}
                <div
                  className={styles.infoCard}
                  style={{ borderTop: "4px solid #EE661C", justifyContent: "space-between" }}
                >
                  <div>
                    <span className={styles.relatedTag}>Planejamento Programado</span>
                    <h3 className={styles.infoCardTitle} style={{ marginTop: "0.35rem" }}>
                      Consórcio
                    </h3>
                    <p style={{ fontSize: "0.85rem", color: "#64748B", marginTop: "0.25rem" }}>
                      Taxa admin. total: {taxaAdminTotalConsorcio}% ({(taxaAdminTotalConsorcio / Math.max(1, prazoMeses / 12)).toFixed(2)}% a.a. equiv.)
                    </p>
                    <div style={{ margin: "1.25rem 0" }}>
                      <span style={{ fontSize: "0.8rem", color: "#64748B", display: "block" }}>
                        Parcela mensal estimada:
                      </span>
                      <strong style={{ fontSize: "1.35rem", color: "#162F4B" }}>
                        {formatBRL(resultados.consorcio.parcela)}
                      </strong>
                    </div>
                    <div style={{ fontSize: "0.9rem", color: "#334155", lineHeight: 1.6 }}>
                      <div>Taxa administrativa: <strong>{formatBRL(resultados.consorcio.custoAdicional)}</strong></div>
                      <div>Custo total final: <strong style={{ color: "#EE661C" }}>{formatBRL(resultados.consorcio.total)}</strong></div>
                    </div>
                  </div>
                  <Link
                    href="/simulador-consorcio"
                    className="btn btn-primary"
                    style={{ marginTop: "1.25rem", width: "100%", textAlign: "center" }}
                  >
                    Simular Consórcio
                  </Link>
                </div>

                {/* Card Financiamento */}
                <div
                  className={styles.infoCard}
                  style={{ borderTop: "4px solid #162F4B", justifyContent: "space-between" }}
                >
                  <div>
                    <span className={styles.relatedTag} style={{ color: "#162F4B" }}>Aquisição Imediata</span>
                    <h3 className={styles.infoCardTitle} style={{ marginTop: "0.35rem" }}>
                      Financiamento
                    </h3>
                    <p style={{ fontSize: "0.85rem", color: "#64748B", marginTop: "0.25rem" }}>
                      Taxa informada: {taxaMensalFinanciamento}% a.m. (Sistema Price)
                    </p>
                    <div style={{ margin: "1.25rem 0" }}>
                      <span style={{ fontSize: "0.8rem", color: "#64748B", display: "block" }}>
                        Parcela mensal estimada:
                      </span>
                      <strong style={{ fontSize: "1.35rem", color: "#162F4B" }}>
                        {formatBRL(resultados.financiamento.parcela)}
                      </strong>
                    </div>
                    <div style={{ fontSize: "0.9rem", color: "#334155", lineHeight: 1.6 }}>
                      <div>Total em juros: <strong>{formatBRL(resultados.financiamento.custoAdicional)}</strong></div>
                      <div>Custo total final: <strong>{formatBRL(resultados.financiamento.total)}</strong></div>
                    </div>
                  </div>
                  <Link
                    href="/credito-imovel"
                    className="btn btn-secondary"
                    style={{ marginTop: "1.25rem", width: "100%", textAlign: "center" }}
                  >
                    Ver Financiamento
                  </Link>
                </div>

                {/* Card Home Equity */}
                <div
                  className={styles.infoCard}
                  style={{ borderTop: "4px solid #21446A", justifyContent: "space-between" }}
                >
                  <div>
                    <span className={styles.relatedTag} style={{ color: "#21446A" }}>Uso Livre com Garantia</span>
                    <h3 className={styles.infoCardTitle} style={{ marginTop: "0.35rem" }}>
                      Home Equity
                    </h3>
                    <p style={{ fontSize: "0.85rem", color: "#64748B", marginTop: "0.25rem" }}>
                      Taxa informada: {taxaMensalHomeEquity}% a.m. (Sistema Price)
                    </p>
                    <div style={{ margin: "1.25rem 0" }}>
                      <span style={{ fontSize: "0.8rem", color: "#64748B", display: "block" }}>
                        Parcela mensal estimada:
                      </span>
                      <strong style={{ fontSize: "1.35rem", color: "#162F4B" }}>
                        {formatBRL(resultados.homeEquity.parcela)}
                      </strong>
                    </div>
                    <div style={{ fontSize: "0.9rem", color: "#334155", lineHeight: 1.6 }}>
                      <div>Total em juros: <strong>{formatBRL(resultados.homeEquity.custoAdicional)}</strong></div>
                      <div>Custo total final: <strong>{formatBRL(resultados.homeEquity.total)}</strong></div>
                    </div>
                  </div>
                  <Link
                    href="/home-equity"
                    className="btn btn-secondary"
                    style={{ marginTop: "1.25rem", width: "100%", textAlign: "center" }}
                  >
                    Ver Home Equity
                  </Link>
                </div>
              </div>

              {/* Aviso de Estimativa */}
              <div className={styles.calloutBox}>
                <p className={styles.calloutText}>
                  <strong>Aviso Importante (Estimativa Educacional):</strong> Os cálculos apresentados acima são meras estimativas matemáticas baseadas exclusivamente nos parâmetros digitados pelo usuário, sem considerar correções monetárias anuais (como INCC, IPCA ou TR), fundo de reserva, seguros obrigatórios (MIP/DFI/Prestamista), IOF ou custos cartorários. Esta simulação não configura proposta ou promessa de crédito. Para receber um estudo personalizado junto às instituições parceiras, fale com os especialistas da RMJ Soluções de Crédito.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
