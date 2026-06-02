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

      // 2. Montar mensagem formatada para o WhatsApp
      let message = `Olá! Solicitei uma simulação no site da RMJ Crédito:\n\n` +
        `👤 *Nome:* ${formData.nome}\n` +
        `✉️ *E-mail:* ${formData.email}\n` +
        `📞 *Telefone:* ${formData.telefone}\n`;

      if (formData.servico === "Veículos") {
        const valVeiculo = parseFloat(formData.valorVeiculo.replace(/[^\d]/g, "")) || 0;
        const valEntrada = parseFloat(formData.entradaVeiculo.replace(/[^\d]/g, "")) || 0;
        const valFinanciamento = Math.max(0, valVeiculo - valEntrada);

        message += `🚗 *Serviço:* Financiamento de Veículos\n` +
          `🚘 *Veículo:* ${formData.marcaModelo}\n` +
          `📅 *Ano:* ${formData.anoVeiculo}\n` +
          `💵 *Valor do Veículo:* R$ ${formData.valorVeiculo}\n` +
          `🪙 *Entrada:* R$ ${formData.entradaVeiculo || "0 (Sem entrada)"}\n` +
          `💰 *Valor Financiado:* R$ ${valFinanciamento.toLocaleString("pt-BR")}`;
      } else {
        message += `🏢 *Empresa:* ${formData.empresa || "Pessoa Física"}\n` +
          `💼 *Serviço:* ${formData.servico}\n` +
          `💵 *Valor Pretendido:* R$ ${formData.valor}`;
      }

      const encodedMessage = encodeURIComponent(message);
      const whatsappUrl = `https://wa.me/5535997248658?text=${encodedMessage}`;

      // 3. Abrir o WhatsApp
      window.open(whatsappUrl, "_blank");

      // 4. Redirecionar para o link do parceiro correspondente se necessário
      let partnerUrl = "";
      if (formData.servico === "BDMG") {
        partnerUrl = "https://wwws.bdmg.mg.gov.br/bdmg-digital/landing-page/1423";
      } else if (formData.servico === "Veículos") {
        partnerUrl = "https://loja.franq.com.br/pb/rodrigo-alves8328/financiamentos/96";
      } else if (formData.servico === "Consórcios") {
        partnerUrl = "https://loja.franq.com.br/pb/rodrigo-alves8328/financiamentos/97";
      } else if (formData.servico === "Outros") {
        partnerUrl = "https://loja.franq.com.br/pb/rodrigo-alves8328";
      }

      if (partnerUrl) {
        setTimeout(() => {
          window.open(partnerUrl, "_blank");
        }, 1500);
      }

    } catch (error) {
      console.error("Erro ao processar formulário:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`${styles.formWrapper} glass-panel`}>
      <h3 className={styles.formTitle}>Solicite uma Simulação Gratuita</h3>
      <p className={styles.formSubtitle}>
        Preencha os dados abaixo e receba uma análise de taxas e prazos sob medida para você ou sua empresa.
      </p>

      {success ? (
        <div className={styles.successMessage}>
          <h4>🎉 Solicitação Enviada!</h4>
          <p>
            Estamos abrindo o WhatsApp para iniciar seu atendimento e te direcionando para a página de simulação.
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
              <option value="Consórcios">Consórcios</option>
              <option value="Outros">Outros Serviços</option>
            </select>
          </div>

          {/* Seção Condicional para Dados do Veículo */}
          {formData.servico === "Veículos" ? (
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
                    required={formData.servico === "Veículos"}
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
                    required={formData.servico === "Veículos"}
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
                    required={formData.servico === "Veículos"}
                    value={formData.valorVeiculo}
                    onChange={handleChange}
                    placeholder="Ex: 65.000"
                    className={styles.input}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="entradaVeiculo" className={styles.label}>Valor de Entrada (R$ - opcional)</label>
                  <input
                    type="text"
                    id="entradaVeiculo"
                    name="entradaVeiculo"
                    value={formData.entradaVeiculo}
                    onChange={handleChange}
                    placeholder="Ex: 15.000 (deixe em branco se zero)"
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
                  required={formData.servico !== "Veículos"}
                  value={formData.valor}
                  onChange={handleChange}
                  placeholder="Ex: 150.000"
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
