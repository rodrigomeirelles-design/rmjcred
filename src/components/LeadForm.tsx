"use client";

import { useState } from "react";
import styles from "./LeadForm.module.css";

interface LeadFormProps {
  defaultService?: string;
}

export default function LeadForm({ defaultService = "BDMG" }: LeadFormProps) {
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    telefone: "",
    empresa: "",
    cnpj: "",
    servico: defaultService,
    valor: "",
    marcaModelo: "",
    anoVeiculo: "",
    valorVeiculo: "",
    entradaVeiculo: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCurrencyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const clean = value.replace(/\D/g, "");
    if (!clean) {
      setFormData((prev) => ({ ...prev, [name]: "" }));
      return;
    }
    const cents = parseInt(clean, 10);
    const num = cents / 100;
    const formatted = new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(num);
    setFormData((prev) => ({ ...prev, [name]: formatted }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // 1. Simular envio para a API interna (salvar lead)
      await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      setSuccess(true);

    } catch (error) {
      console.error("Erro ao processar formulário:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isVehicleService = formData.servico === "Veículos" || formData.servico === "Garantia de Veículo";

  return (
    <div className={`${styles.formWrapper} glass-panel`}>
      <h3 className={styles.formTitle}>Solicite uma Simulação Gratuita</h3>
      <p className={styles.formSubtitle}>
        Preencha os dados abaixo e receba uma análise de taxas e prazos sob medida para você ou sua empresa.
      </p>

      {success ? (
        <div className={styles.successMessage}>
          <h4>🎉 Solicitação Recebida com Sucesso!</h4>
          <p>
            Obrigado pelo seu contato. Recebemos seus dados de simulação e entraremos em contato via e-mail ou WhatsApp em breve.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="nome" className={styles.label}>Nome Completo *</label>
            <input
              type="text"
              id="nome"
              name="nome"
              required
              value={formData.nome}
              onChange={handleChange}
              placeholder="Digite seu nome"
              className={styles.input}
            />
          </div>

          <div className={styles.grid2}>
            <div className={styles.formGroup}>
              <label htmlFor="email" className={styles.label}>E-mail de Contato *</label>
              <input
                type="email"
                id="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="Ex: seuemail@contato.com"
                className={styles.input}
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="telefone" className={styles.label}>WhatsApp / Celular *</label>
              <input
                type="tel"
                id="telefone"
                name="telefone"
                required
                value={formData.telefone}
                onChange={handleChange}
                placeholder="(35) 99999-9999"
                className={styles.input}
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="servico" className={styles.label}>Serviço Desejado *</label>
            <select
              id="servico"
              name="servico"
              required
              value={formData.servico}
              onChange={handleChange}
              className={styles.select}
            >
              <option value="BDMG">Capital de Giro BDMG</option>
              <option value="Crédito Imobiliário">Crédito Imobiliário</option>
              <option value="Home Equity">Home Equity (Garantia de Imóvel)</option>
              <option value="Veículos">Financiamento de Veículos</option>
              <option value="Garantia de Veículo">Crédito com Garantia de Veículo</option>
              <option value="Consórcios">Consórcios</option>
              <option value="Outros">Outros Serviços</option>
            </select>
          </div>

          {/* Seção Condicional para Dados do Veículo */}
          {isVehicleService ? (
            <div className={styles.vehicleDetailsBlock}>
              <div className={styles.blockDivider}></div>
              <h4 className={styles.blockTitle}>Dados do Veículo para Simulação</h4>
              <div className={styles.grid2}>
                <div className={styles.formGroup}>
                  <label htmlFor="marcaModelo" className={styles.label}>Marca / Modelo do Carro *</label>
                  <input
                    type="text"
                    id="marcaModelo"
                    name="marcaModelo"
                    required={isVehicleService}
                    value={formData.marcaModelo}
                    onChange={handleChange}
                    placeholder="Ex: Chevrolet Onix 1.0 LT"
                    className={styles.input}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="anoVeiculo" className={styles.label}>Ano de Fabricação *</label>
                  <input
                    type="text"
                    id="anoVeiculo"
                    name="anoVeiculo"
                    required={isVehicleService}
                    value={formData.anoVeiculo}
                    onChange={handleChange}
                    placeholder="Ex: 2020"
                    className={styles.input}
                  />
                </div>
              </div>
              <div className={styles.grid2}>
                <div className={styles.formGroup}>
                  <label htmlFor="valorVeiculo" className={styles.label}>Valor Estimado do Carro (R$) *</label>
                  <input
                    type="text"
                    id="valorVeiculo"
                    name="valorVeiculo"
                    required={isVehicleService}
                    value={formData.valorVeiculo}
                    onChange={handleCurrencyChange}
                    placeholder="R$ 0,00"
                    className={styles.input}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="entradaVeiculo" className={styles.label}>Valor de Entrada ou Troco (R$ - opcional)</label>
                  <input
                    type="text"
                    id="entradaVeiculo"
                    name="entradaVeiculo"
                    value={formData.entradaVeiculo}
                    onChange={handleCurrencyChange}
                    placeholder="R$ 0,00"
                    className={styles.input}
                  />
                </div>
              </div>
            </div>
          ) : (
            <>
              <div className={styles.grid2}>
                <div className={styles.formGroup}>
                  <label htmlFor="empresa" className={styles.label}>Nome da Empresa</label>
                  <input
                    type="text"
                    id="empresa"
                    name="empresa"
                    value={formData.empresa}
                    onChange={handleChange}
                    placeholder="Nome da sua empresa (opcional)"
                    className={styles.input}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="cnpj" className={styles.label}>CNPJ (opcional)</label>
                  <input
                    type="text"
                    id="cnpj"
                    name="cnpj"
                    value={formData.cnpj}
                    onChange={handleChange}
                    placeholder="00.000.000/0000-00"
                    className={styles.input}
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="valor" className={styles.label}>Valor Pretendido *</label>
                <input
                  type="text"
                  id="valor"
                  name="valor"
                  required={!isVehicleService}
                  value={formData.valor}
                  onChange={handleCurrencyChange}
                  placeholder="R$ 0,00"
                  className={styles.input}
                />
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="btn btn-primary"
            style={{ width: "100%", marginTop: "1.5rem" }}
          >
            {isSubmitting ? "Enviando..." : "Fazer Simulação Agora 🚀"}
          </button>
        </form>
      )}
    </div>
  );
}
