"use client";

import { useState } from "react";
import styles from "./page.module.css";
import { trackFormSubmit, trackFormBegin } from "@/lib/analytics";

const LINHAS: Record<string, string> = {
  "Capital de Giro": "Capital de Giro BDMG",
  "Investimento Fixo": "BDMG Investimento Fixo",
  "Inovação": "BDMG Inovação",
  "Exportação": "BDMG Exportação",
};

export default function BdmgHeroForm() {
  const [form, setForm] = useState({ nome: "", telefone: "", email: "", servico: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [started, setStarted] = useState(false);

  const handleFocus = () => {
    if (!started) {
      setStarted(true);
      trackFormBegin("bdmg_hero");
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
          servico: LINHAS[form.servico] || "Capital de Giro BDMG",
        }),
      });
      if (!res.ok) throw new Error("Falha no envio");
      trackFormSubmit({ form_type: "bdmg_hero", service_selected: form.servico || "Não informado" });
      setSuccess(true);
    } catch {
      setError("Não foi possível enviar agora. Tente novamente ou fale conosco pelo WhatsApp.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.heroFormCard} id="simular">
      <h2 className={styles.heroFormTitle}>Receba uma análise gratuita em 24h</h2>

      {success ? (
        <div className={styles.heroFormSuccess} role="status">
          <strong>Solicitação recebida!</strong>
          <p>Obrigado, {form.nome.split(" ")[0]}. Nossa equipe entrará em contato pelo WhatsApp informado.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} onFocus={handleFocus} className={styles.heroForm} noValidate={false}>
          <div className={styles.heroField}>
            <label htmlFor="bdmg-nome">Nome *</label>
            <input id="bdmg-nome" name="nome" type="text" required autoComplete="name"
              value={form.nome} onChange={handleChange} placeholder="Seu nome" />
          </div>
          <div className={styles.heroField}>
            <label htmlFor="bdmg-telefone">WhatsApp *</label>
            <input id="bdmg-telefone" name="telefone" type="tel" required autoComplete="tel"
              value={form.telefone} onChange={handleChange} placeholder="(35) 99999-9999" />
          </div>
          <div className={styles.heroField}>
            <label htmlFor="bdmg-email">E-mail <span className={styles.optional}>(opcional)</span></label>
            <input id="bdmg-email" name="email" type="email" autoComplete="email"
              value={form.email} onChange={handleChange} placeholder="seuemail@empresa.com" />
          </div>
          <div className={styles.heroField}>
            <label htmlFor="bdmg-servico">Serviço Desejado <span className={styles.optional}>(opcional)</span></label>
            <select id="bdmg-servico" name="servico" value={form.servico} onChange={handleChange}>
              <option value="">Selecione</option>
              <option value="Capital de Giro">Capital de Giro</option>
              <option value="Investimento Fixo">Investimento Fixo</option>
              <option value="Inovação">Inovação</option>
              <option value="Exportação">Exportação</option>
            </select>
          </div>

          {error && <p className={styles.heroFormError} role="alert">{error}</p>}

          <button type="submit" className="btn btn-primary" disabled={isSubmitting} style={{ width: "100%" }}>
            {isSubmitting ? "Enviando..." : "Quero minha análise gratuita"}
          </button>
          <p className={styles.heroFormNote}>Sem compromisso. Seus dados estão seguros.</p>
        </form>
      )}
    </div>
  );
}
