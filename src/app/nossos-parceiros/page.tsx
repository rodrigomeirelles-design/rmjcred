import Link from "next/link";
import Image from "next/image";
import styles from "./page.module.css";

export const metadata = {
  title: "Nossos Parceiros — RMJ Soluções de Crédito",
  description: "Trabalhamos com mais de 150 das principais instituições financeiras e bancos do país para levar até você as melhores taxas de fomento e crédito.",
};

export default function NossosParceiros() {
  const partnersList = [
    { name: "BDMG", logo: "/assets/logo-bdmg-simples.png" },
    { name: "BNDES", logo: "/assets/logo-bndes.png" },
    { name: "Santander", logo: "/assets/logo-santander.png" },
    { name: "Itaú", logo: "/assets/logo-itau.png" },
    { name: "Banco Daycoval", logo: "/assets/logo-daycoval.png" },
    { name: "C6 Bank", logo: "/assets/logo-c6bank.png" },
    { name: "Creditas", logo: "/assets/logo-creditas.png" },
    { name: "BV Financeira", logo: "/assets/logo-bv.png" },
    { name: "Bradesco", logo: "/assets/logo-bradesco.png" },
    { name: "Inter", logo: "/assets/logo-inter.png" },
    { name: "Banco Bari", logo: "/assets/logo-bari.png" },
    { name: "Omni", logo: "/assets/logo-omni.png" },
    { name: "Sim", logo: "/assets/logo-sim.png" },
    { name: "Banco Safra", logo: "/assets/logo-safra.png" },
    { name: "Ademicon", logo: "/assets/ademicon.svg" }
  ];

  return (
    <>
      {/* Cabeçalho */}
      <section className={styles.headerSection}>
        <div className={`${styles.titleContainer} container`}>
          <Link href="/" className={styles.backLink}>
            &larr; Voltar para a Página Inicial
          </Link>
          <h1 className={styles.title}>Nossos Parceiros</h1>
          <p className={styles.leadText}>
            Conexão direta com as maiores e melhores instituições financeiras do Brasil. Como um hub multimarcas, colocamos mais de 150 bancos a serviço dos seus objetivos.
          </p>
        </div>
      </section>

      {/* Grid de Parceiros */}
      <section className={`${styles.partnersSection} section`}>
        <div className="container">
          <p className={styles.gridDescription}>
            Nossa independência comercial garante total transparência. Analisamos de forma neutra qual instituição oferece a menor taxa de juros e o melhor prazo para sua simulação.
          </p>

          <div className={styles.partnersGrid}>
            {partnersList.map((partner, index) => (
              <div className={styles.partnerCard} key={index}>
                <div className={styles.logoWrapper}>
                  <Image
                    src={partner.logo}
                    alt={`Logo da instituição ${partner.name}`}
                    fill
                    style={{ objectFit: "contain" }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Seção CTA */}
      <section className={`${styles.ctaSection} section`}>
        <div className={`${styles.ctaContent} container`}>
          <h2 className={styles.ctaTitle}>Precisa de Recursos?</h2>
          <p>
            Deixe que a RMJ encontre a melhor oportunidade de financiamento ou capital de giro em nossa rede integrada de parceiros.
          </p>
          <Link href="/contato#simular" className="btn btn-primary">
            Fazer Simulação Agora
          </Link>
        </div>
      </section>
    </>
  );
}
