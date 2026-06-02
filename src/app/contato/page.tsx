import Link from "next/link";
import styles from "./page.module.css";
import LeadForm from "@/components/LeadForm";

export const metadata = {
  title: "Contato — RMJ Soluções de Crédito",
  description: "Fale com a RMJ Soluções de Crédito em Itajubá - MG. Atendimento via WhatsApp, telefone ou e-mail. Solicite sua simulação grátis.",
};

export default function Contato() {
  return (
    <>
      {/* Cabeçalho */}
      <section className={styles.headerSection}>
        <div className={`${styles.titleContainer} container`}>
          <Link href="/" className={styles.backLink}>
            &larr; Voltar para a Página Inicial
          </Link>
          <h1 className={styles.title}>Fale Conosco</h1>
          <p className={styles.leadText}>
            Dúvidas sobre linhas de crédito, taxas ou quer iniciar sua simulação? Nosso time está de prontidão para prestar um atendimento ágil e personalizado.
          </p>
        </div>
      </section>

      {/* Informações e Formulário */}
      <section className={`${styles.contactGridSection} section`}>
        <div className={`${styles.contactGrid} container`}>
          {/* Coluna 1: Dados de Contato */}
          <div className={styles.contactInfo}>
            <div>
              <h2 className={styles.infoTitle}>Canais de Atendimento</h2>
              <p className={styles.infoDesc}>
                Escolha a forma mais conveniente para falar conosco. Se preferir atendimento imediato, clique no ícone do WhatsApp flutuante ou envie uma mensagem no número abaixo.
              </p>
            </div>

            <div className={styles.cardsList}>
              {/* WhatsApp */}
              <div className={styles.infoCard}>
                <div className={styles.cardDetails}>
                  <h4 className={styles.cardTitle}>WhatsApp Oficial</h4>
                  <p className={styles.cardText}>Atendimento comercial das 8h às 18h.</p>
                  <a href="https://wa.me/5535997248658" target="_blank" rel="noopener noreferrer" className={styles.cardLink}>
                    (35) 99724-8658
                  </a>
                </div>
              </div>

              {/* Telefone */}
              <div className={styles.infoCard}>
                <div className={styles.cardDetails}>
                  <h4 className={styles.cardTitle}>Telefone Fixo / Celular</h4>
                  <p className={styles.cardText}>Ligue para falar com nossa mesa de crédito.</p>
                  <a href="tel:+5535997248658" className={styles.cardLink}>
                    (35) 99724-8658
                  </a>
                </div>
              </div>

              {/* E-mail */}
              <div className={styles.infoCard}>
                <div className={styles.cardDetails}>
                  <h4 className={styles.cardTitle}>E-mail Geral</h4>
                  <p className={styles.cardText}>Para propostas, envio de documentos ou parcerias.</p>
                  <a href="mailto:contato@rmjcred.com.br" className={styles.cardLink}>
                    contato@rmjcred.com.br
                  </a>
                </div>
              </div>

              {/* Endereço */}
              <div className={styles.infoCard}>
                <div className={styles.cardDetails}>
                  <h4 className={styles.cardTitle}>Escritório Físico</h4>
                  <p className={styles.cardText}>
                    Rua Felipe Pizutto, 193 — Centro, Itajubá — MG, CEP 37500-000
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Coluna 2: Simulador / Formulário de Contato */}
          <div id="simular">
            <LeadForm defaultService="BDMG" />
          </div>
        </div>
      </section>
    </>
  );
}
