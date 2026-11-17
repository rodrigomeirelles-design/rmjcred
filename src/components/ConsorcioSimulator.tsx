"use client";

import React, { useState } from "react";
import Link from "next/link";
import styles from "./ConsorcioSimulator.module.css";
import { trackFormSubmit, trackFormBegin } from "@/lib/analytics";

interface ConsorcioSimulatorProps {
  initialTipo?: string;
}

export default function ConsorcioSimulator({
  initialTipo = "Imóveis",
}: ConsorcioSimulatorProps) {
  // Step: 1 = Configuração do plano, 2 = Dados de contato, 3 = Resultado da simulação
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Step 1: Configuração do Plano
  const [tipo, setTipo] = useState(initialTipo);
  const [modo, setModo] = useState<"parcela" | "credito">("parcela");
  
  // Parcela default R$ 4.000,00 (conforme referência visual)
  // Crédito default R$ 300.000,00 (conforme tabela oficial)
  const [numericValue, setNumericValue] = useState<number>(4000);
  const [inputValue, setInputValue] = useState<string>("R$ 4.000,00");
  const [includeBlackFriday, setIncludeBlackFriday] = useState<boolean>(true);

  // Step 2: Dados de Contato
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [celular, setCelular] = useState("");
  const [cpf, setCpf] = useState("");
  const [cep, setCep] = useState("");
  const [aceitoTermos, setAceitoTermos] = useState(true);
  const [concordoNotificacoes, setConcordoNotificacoes] = useState(true);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formStarted, setFormStarted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Helper de formatação de moeda
  const formatBRL = (val: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(val);
  };

  // Alterna modo (parcela vs crédito)
  const handleModoChange = (newModo: "parcela" | "credito") => {
    setModo(newModo);
    if (newModo === "parcela") {
      const defaultParcela = 4000;
      setNumericValue(defaultParcela);
      setInputValue(formatBRL(defaultParcela));
    } else {
      const defaultCredito = 300000;
      setNumericValue(defaultCredito);
      setInputValue(formatBRL(defaultCredito));
    }
  };

  // Slider change
  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setNumericValue(val);
    setInputValue(formatBRL(val));
  };

  // Input text change (com máscara de moeda R$ 0,00 dinâmica)
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, "");
    if (!raw) {
      setNumericValue(0);
      setInputValue("R$ 0,00");
      return;
    }
    const cents = parseInt(raw, 10);
    const num = cents / 100;
    setNumericValue(num);
    setInputValue(formatBRL(num));
  };

  // Máscaras de entrada
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let v = e.target.value.replace(/\D/g, "");
    if (v.length > 11) v = v.substring(0, 11);
    if (v.length > 10) {
      v = v.replace(/^(\d{2})(\d{5})(\d{4})$/, "($1) $2-$3");
    } else if (v.length > 6) {
      v = v.replace(/^(\d{2})(\d{4})(\d{0,4})$/, "($1) $2-$3");
    } else if (v.length > 2) {
      v = v.replace(/^(\d{2})(\d{0,5})$/, "($1) $2");
    } else if (v.length > 0) {
      v = v.replace(/^(\d{0,2})$/, "($1");
    }
    setCelular(v);
  };

  const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let v = e.target.value.replace(/\D/g, "");
    if (v.length > 11) v = v.substring(0, 11);
    if (v.length > 9) {
      v = v.replace(/^(\d{3})(\d{3})(\d{3})(\d{1,2})$/, "$1.$2.$3-$4");
    } else if (v.length > 6) {
      v = v.replace(/^(\d{3})(\d{3})(\d{1,3})$/, "$1.$2.$3");
    } else if (v.length > 3) {
      v = v.replace(/^(\d{3})(\d{1,3})$/, "$1.$2");
    }
    setCpf(v);
  };

  const handleCepChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let v = e.target.value.replace(/\D/g, "");
    if (v.length > 8) v = v.substring(0, 8);
    if (v.length > 5) {
      v = v.replace(/^(\d{5})(\d{1,3})$/, "$1-$2");
    }
    setCep(v);
  };

  // Coeficientes oficiais da tabela da campanha Black Friday
  // 300k: Parcela Black R$ 875,45 (0.002918) | Reduzida R$ 1.011,90 (0.003373) | Cheia R$ 1.690,00 (0.005633)
  // 500k: Parcela Black R$ 1.459,00 (0.002918) | Reduzida R$ 1.800,00 (0.003600) | Cheia R$ 2.848,50 (0.005697)
  // 1M:   Parcela Black R$ 2.920,00 (0.002920) | Reduzida R$ 3.600,00 (0.003600) | Cheia R$ 5.645,00 (0.005645)
  const calcCredito = modo === "credito" 
    ? (numericValue > 0 ? numericValue : 300000)
    : (includeBlackFriday ? numericValue / 0.002918 : numericValue / 0.00564);

  const parcelaBlack = calcCredito * 0.002918;
  const parcelaReduzida = calcCredito * 0.0036;
  const parcelaCheia = calcCredito * 0.00564;
  const economiaMensal = Math.max(0, parcelaCheia - (includeBlackFriday ? parcelaBlack : parcelaReduzida));

  // Faixas do Slider
  const minRange = modo === "parcela" ? 269.84 : 50000;
  const maxRange = modo === "parcela" ? 8675.97 : 2000000;
  const sliderStep = modo === "parcela" ? 25 : 10000;

  const sliderPercent = Math.min(
    100,
    Math.max(0, ((numericValue - minRange) / (maxRange - minRange)) * 100)
  );

  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (numericValue <= 0) {
      setErrorMessage("Por favor, informe um valor válido para simulação.");
      return;
    }
    setErrorMessage("");
    if (!formStarted) {
      setFormStarted(true);
      trackFormBegin("simulador_consorcio");
    }
    setStep(2);
  };

  const handleStep2Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome.trim() || !email.trim() || !celular.trim()) {
      setErrorMessage("Por favor, preencha os campos obrigatórios (*)");
      return;
    }
    if (!aceitoTermos) {
      setErrorMessage("É necessário aceitar os termos de privacidade para prosseguir.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome,
          email,
          telefone: celular,
          cpf,
          cep,
          servico: "Consórcio",
          valor: formatBRL(calcCredito),
          tipo_pessoa: "PF",
        }),
      });

      trackFormSubmit({
        form_type: "simulador_consorcio",
        service_selected: `Consórcio ${tipo}`,
        estimated_amount: formatBRL(calcCredito),
      });

      setStep(3);
    } catch (err) {
      console.error("Erro ao enviar lead:", err);
      // Avança para o resultado mesmo se houver falha de rede transitória
      setStep(3);
    } finally {
      setIsSubmitting(false);
    }
  };

  const whatsappMessage = encodeURIComponent(
    `Olá! Fiz uma simulação de Consórcio na RMJ Soluções de Crédito:\n\n` +
    `• Tipo: ${tipo}\n` +
    `• Crédito Estimado: ${formatBRL(calcCredito)}\n` +
    `• Parcela Black Friday (60%): ${formatBRL(parcelaBlack)}/mês\n` +
    `• Nome: ${nome}\n` +
    `• Contato: ${celular}\n\n` +
    `Gostaria de receber a proposta oficial da campanha Black Friday!`
  );

  const whatsappUrl = `https://wa.me/5535991084513?text=${whatsappMessage}`;

  return (
    <div className={styles.simulatorCard}>
      {/* ── ETAPA 1: CONFIGURAÇÃO DO PLANO ── */}
      {step === 1 && (
        <form onSubmit={handleStep1Submit} className={styles.formStep}>
          {/* Badge Black Friday */}
          <div className={styles.badgeWrapper}>
            <div className={styles.blackFridayBadge}>
              <span className={styles.badgeBlack}>BLACK FRIDAY</span>
              <span className={styles.badgeRed}>PLANO 60% REDUÇÃO</span>
            </div>
          </div>

          {/* Título de Destaque */}
          <h3 className={styles.cardHeading}>
            Você está perto de realizar o seu projeto de vida
          </h3>

          {/* Campo: Tipo de Consórcio */}
          <div className={styles.fieldGroup}>
            <label htmlFor="tipoConsorcio" className={styles.fieldLabel}>
              Selecione um tipo de consórcio
            </label>
            <div className={styles.selectWrapper}>
              <select
                id="tipoConsorcio"
                value={tipo}
                onChange={(e) => setTipo(e.target.value)}
                className={styles.selectInput}
              >
                <option value="Imóveis">Imóveis</option>
                <option value="Veículos">Veículos (Carros e Motos)</option>
                <option value="Pesados">Pesados (Caminhões, Tratores e Frotas)</option>
                <option value="Serviços">Serviços (Viagens, Festas e Reformas)</option>
              </select>
            </div>
          </div>

          {/* Campo: Simular Plano por */}
          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel}>Simular Plano por</label>
            <div className={styles.toggleGroup}>
              <button
                type="button"
                className={`${styles.toggleBtn} ${modo === "parcela" ? styles.toggleActive : ""}`}
                onClick={() => handleModoChange("parcela")}
              >
                Parcela
              </button>
              <button
                type="button"
                className={`${styles.toggleBtn} ${modo === "credito" ? styles.toggleActive : ""}`}
                onClick={() => handleModoChange("credito")}
              >
                Crédito
              </button>
            </div>
          </div>

          {/* Campo: Valor com máscara monetária e Slider sincronizado */}
          <div className={styles.fieldGroup}>
            <label htmlFor="valorInput" className={styles.fieldLabel}>
              {modo === "parcela" ? "Valor da parcela" : "Valor do crédito"}
            </label>
            <div className={styles.inputWrapper}>
              <input
                type="text"
                id="valorInput"
                value={inputValue}
                onChange={handleInputChange}
                className={styles.currencyInput}
                placeholder="R$ 0,00"
              />
            </div>

            {/* Range Slider com Track Vermelho Dinâmico */}
            <div className={styles.sliderContainer}>
              <input
                type="range"
                min={minRange}
                max={maxRange}
                step={sliderStep}
                value={numericValue}
                onChange={handleSliderChange}
                className={styles.rangeSlider}
                style={{
                  background: `linear-gradient(to right, #e62222 0%, #e62222 ${sliderPercent}%, #e2e8f0 ${sliderPercent}%, #e2e8f0 100%)`
                }}
              />
              <div className={styles.sliderLimits}>
                <span>{formatBRL(minRange)}</span>
                <span>{formatBRL(maxRange)}</span>
              </div>
            </div>
          </div>

          {/* Card Checkbox: Incluir Plano 60% Black Friday */}
          <div 
            className={`${styles.checkboxCard} ${includeBlackFriday ? styles.checkboxCardActive : ""}`}
            onClick={() => setIncludeBlackFriday(!includeBlackFriday)}
          >
            <div className={styles.customCheckboxWrapper}>
              <input
                type="checkbox"
                checked={includeBlackFriday}
                onChange={(e) => setIncludeBlackFriday(e.target.checked)}
                className={styles.customCheckbox}
                id="checkBlackFriday"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
            <div className={styles.checkboxContent}>
              <strong className={styles.checkboxTitle}>
                Incluir o Plano 60% redução Black Friday
              </strong>
              <p className={styles.checkboxSubtext}>
                Parcela com redução de 60% no fundo comum até a contemplação
              </p>
            </div>
          </div>

          {errorMessage && (
            <p className={styles.errorText}>{errorMessage}</p>
          )}

          {/* Botão de Avanço */}
          <button type="submit" className={styles.btnSimular}>
            <span>Simule seu consórcio</span>
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </button>
        </form>
      )}

      {/* ── ETAPA 2: DADOS DE CONTATO (EXATO AO MODELO DE REFERÊNCIA) ── */}
      {step === 2 && (
        <form onSubmit={handleStep2Submit} className={styles.formStep}>
          {/* Resumo da Etapa 1 */}
          <div className={styles.summaryPill}>
            <span>📋 {tipo}</span>
            <span>💰 {modo === "parcela" ? `Parcela: ${inputValue}` : `Crédito: ${inputValue}`}</span>
            {includeBlackFriday && <span className={styles.bfPill}>🔥 60% Redução</span>}
          </div>

          <div className={styles.fieldGroup}>
            <label htmlFor="contatoNome" className={styles.fieldLabel}>Nome</label>
            <input
              type="text"
              id="contatoNome"
              required
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Insira seu nome"
              className={styles.textInput}
            />
          </div>

          <div className={styles.fieldGroup}>
            <label htmlFor="contatoEmail" className={styles.fieldLabel}>E-mail</label>
            <input
              type="email"
              id="contatoEmail"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Insira seu e-mail"
              className={styles.textInput}
            />
          </div>

          <div className={styles.fieldGroup}>
            <label htmlFor="contatoCelular" className={styles.fieldLabel}>Celular</label>
            <input
              type="tel"
              id="contatoCelular"
              required
              value={celular}
              onChange={handlePhoneChange}
              placeholder="(35) 99999-9999"
              className={styles.textInput}
            />
          </div>

          <div className={styles.fieldGroup}>
            <label htmlFor="contatoCpf" className={styles.fieldLabel}>CPF</label>
            <input
              type="text"
              id="contatoCpf"
              value={cpf}
              onChange={handleCpfChange}
              placeholder="Insira seu CPF"
              className={styles.textInput}
            />
          </div>

          <div className={styles.fieldGroup}>
            <div className={styles.labelWithLink}>
              <label htmlFor="contatoCep" className={styles.fieldLabel}>CEP</label>
              <a
                href="https://buscacepinter.correios.com.br/app/endereco/index.php"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.linkCep}
              >
                Não sei meu CEP
              </a>
            </div>
            <input
              type="text"
              id="contatoCep"
              value={cep}
              onChange={handleCepChange}
              placeholder="Insira um CEP"
              className={styles.textInput}
            />
          </div>

          {/* Checkboxes de Termos e Notificações */}
          <div className={styles.termsWrapper}>
            <label className={styles.termsLabel}>
              <input
                type="checkbox"
                checked={aceitoTermos}
                onChange={(e) => setAceitoTermos(e.target.checked)}
                className={styles.termsCheckbox}
              />
              <span>
                Aceito os{" "}
                <Link href="/politica-de-privacidade" className={styles.termsLink}>
                  Termos de Privacidade
                </Link>.
              </span>
            </label>

            <label className={styles.termsLabel}>
              <input
                type="checkbox"
                checked={concordoNotificacoes}
                onChange={(e) => setConcordoNotificacoes(e.target.checked)}
                className={styles.termsCheckbox}
              />
              <span>Sim, eu concordo em receber notificações.</span>
            </label>
          </div>

          {errorMessage && (
            <p className={styles.errorText}>{errorMessage}</p>
          )}

          {/* Botões de Ação: Voltar / Resultado */}
          <div className={styles.step2Buttons}>
            <button
              type="button"
              className={styles.btnVoltar}
              onClick={() => setStep(1)}
            >
              VOLTAR
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={styles.btnResultado}
            >
              {isSubmitting ? "PROCESSANDO..." : "RESULTADO"}
            </button>
          </div>
        </form>
      )}

      {/* ── ETAPA 3: RESULTADO DA SIMULAÇÃO ── */}
      {step === 3 && (
        <div className={styles.resultStep}>
          <div className={styles.resultSuccessIcon}>🎉</div>
          <h3 className={styles.resultTitle}>Sua Simulação está Pronta!</h3>
          <p className={styles.resultSubtitle}>
            Olá, <strong>{nome}</strong>! Com base nas condições da campanha <strong>Black Friday Consórcio</strong>, confira os valores estimados para a sua carta:
          </p>

          <div className={styles.resultCard}>
            <div className={styles.resultRowPrimary}>
              <span className={styles.resultLabelPrimary}>Crédito Simulado</span>
              <span className={styles.resultValuePrimary}>{formatBRL(calcCredito)}</span>
            </div>

            <div className={styles.divider} />

            {includeBlackFriday ? (
              <div className={styles.blackFridayHighlightBox}>
                <div className={styles.bfBadgeRow}>
                  <span className={styles.bfTag}>Condição Especial Black Friday</span>
                  <span className={styles.bfSavings}>-60% na parcela</span>
                </div>
                <div className={styles.bfPriceRow}>
                  <span className={styles.bfPriceLabel}>Parcela Black:</span>
                  <strong className={styles.bfPriceValue}>{formatBRL(parcelaBlack)}</strong>
                  <span className={styles.bfPricePeriod}>/mês</span>
                </div>
                <p className={styles.bfNote}>
                  Até a contemplação no fundo comum. Economia estimada de <strong>{formatBRL(economiaMensal)}/mês</strong> em relação à parcela cheia!
                </p>
              </div>
            ) : null}

            <div className={styles.comparisonGrid}>
              <div className={styles.comparisonItem}>
                <span className={styles.comparisonLabel}>Parcela Reduzida Padrão</span>
                <strong className={styles.comparisonValue}>{formatBRL(parcelaReduzida)}</strong>
                <span className={styles.comparisonSub}>/mês</span>
              </div>
              <div className={styles.comparisonItem}>
                <span className={styles.comparisonLabel}>Parcela Cheia Sem Desconto</span>
                <strong className={styles.comparisonValue}>{formatBRL(parcelaCheia)}</strong>
                <span className={styles.comparisonSub}>/mês</span>
              </div>
            </div>

            <p className={styles.legalNotice}>
              *Valores sujeitos a alteração conforme tabela vigente e regras dos grupos disponíveis. Cotas limitadas durante a campanha Black Friday.
            </p>
          </div>

          {/* Botão de WhatsApp direto com mensagem pré-preenchida */}
          <div className={styles.resultActions}>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.btnWhatsapp}
            >
              <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden="true">
                <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.771-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86.173.086.275.072.376-.044.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564.289.13.332.202c.043.072.043.419-.101.824z"/>
              </svg>
              <span>Garantir Cota com Desconto no WhatsApp</span>
            </a>

            <button
              type="button"
              className={styles.btnRefazer}
              onClick={() => setStep(1)}
            >
              Fazer outra simulação
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
