"use client";

import { useState } from "react";
import styles from "./page.module.css";
import { trackFormSubmit, trackFormBegin } from "@/lib/analytics";

const LINHAS: Record<string, string> = {
  "Capital de Giro BF": "Black Friday BDMG - Capital de Giro",
  "Investimento Fixo": "Black Friday BDMG - Investimento Fixo",
  "Inovação": "Black Friday BDMG - Inovação",
  "Exportação": "Black Friday BDMG - Exportação",
};

export default function BfHeroForm() {
  const [form, setForm] = useState({ nome: "", telefone: "", email: "", servico: "Capital de Giro BF" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [started, setStarted] = useState(false);

  const handleFocus = () => {
    if (!started) {
      setStarted(true);
      trackFormBegin("black_friday_bdmg_hero");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (form.telefone.replace(/\D/g, "").length < 10) {
      setError("Informe um WhatsApp válido com DDD.");
      return;
    }
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome: form.nome,
          telefone: form.telefone,
          email: form.email,
          servico: LINHAS[form.servico] || "Black Friday BDMG - Taxa Promocional",
        }),
      });
      if (!res.ok) throw new Error("Falha no envio");
      trackFormSubmit({ form_type: "black_friday_bdmg_hero", service_selected: form.servico });
      setSuccess(true);
    } catch {
      setError("Não foi possível enviar agora. Tente novamente ou fale conosco pelo WhatsApp.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.heroFormCard} id="simular">
      <div className={styles.formBadge}>⚡ Oferta por Tempo Limitado</div>
      <h2 className={styles.heroFormTitle}>Garanta sua Taxa de Black Friday</h2>
      <p className={styles.heroFormSubtitle}>
        Receba uma análise gratuita do perfil da sua empresa em até 24h sem custo algum.
      </p>

      {success ? (
        <div className={styles.heroFormSuccess} role="status">
          <strong>Solicitação da Black Friday recebida!</strong>
          <p>Obrigado, {form.nome.split(" ")[0]}. Nossa equipe entrará em contato pelo WhatsApp com sua análise e simulação.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} onFocus={handleFocus} className={styles.heroForm} noValidate={false}>
          <div className={styles.heroField}>
            <label htmlFor="bf-nome">Nome do Responsável *</label>
            <input 
              id="bf-nome" 
              name="nome" 
              type="text" 
              required 
              autoComplete="name"
              value={form.nome} 
              onChange={handleChange} 
              placeholder="Seu nome completo" 
            />
          </div>
          <div className={styles.heroField}>
            <label htmlFor="bf-telefone">WhatsApp com DDD *</label>
            <input 
              id="bf-telefone" 
              name="telefone" 
              type="tel" 
              required 
              autoComplete="tel"
              value={form.telefone} 
              onChange={handleChange} 
              placeholder="(35) 99999-9999" 
            />
          </div>
          <div className={styles.heroField}>
            <label htmlFor="bf-email">E-mail corporativo <span className={styles.optional}>(opcional)</span></label>
            <input 
              id="bf-email" 
              name="email" 
              type="email" 
              autoComplete="email"
              value={form.email} 
              onChange={handleChange} 
              placeholder="contato@suaempresa.com.br" 
            />
          </div>
          <div className={styles.heroField}>
            <label htmlFor="bf-servico">Finalidade do Crédito</label>
            <select id="bf-servico" name="servico" value={form.servico} onChange={handleChange}>
              <option value="Capital de Giro BF">Capital de Giro (Reforço e Estoque)</option>
              <option value="Investimento Fixo">Investimento Fixo (Máquinas / Reformas)</option>
              <option value="Inovação">Inovação e Tecnologia</option>
              <option value="Exportação">Exportação</option>
            </select>
          </div>

          {error && <p className={styles.heroFormError} role="alert">{error}</p>}

          <button type="submit" disabled={isSubmitting} className={styles.btnSubmit}>
            {isSubmitting ? "Enviando análise..." : "Quero Minha Análise Gratuita"}
          </button>
          <span className={styles.heroFormFootnote}>
            🔒 Sem compromisso e 100% gratuito. Seus dados estão protegidos.
          </span>
        </form>
      )}
    </div>
  );
}
