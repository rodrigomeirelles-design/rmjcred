import Link from "next/link";
import Image from "next/image";
import styles from "./Footer.module.css";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={`${styles.container} container grid grid-4`}>
        {/* Coluna 1: Logo e Descrição */}
        <div className={styles.colInfo}>
          <div className={styles.logo}>
            <Image
              src="/assets/logo-rmj-header.jpg"
              alt="RMJ Soluções de Crédito Logo"
              width={160}
              height={87}
              style={{ objectFit: "contain", borderRadius: "6px" }}
            />
          </div>
          <p className={styles.description}>
            Expertise e atendimento estratégico para impulsionar negócios e viabilizar conquistas. Hub completo de soluções financeiras.
          </p>
          <div className={styles.socialList}>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className={styles.socialLink} aria-label="Instagram">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
              </svg>
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className={styles.socialLink} aria-label="LinkedIn">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                <rect x="2" y="9" width="4" height="12"></rect>
                <circle cx="4" cy="4" r="2"></circle>
              </svg>
            </a>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className={styles.socialLink} aria-label="Facebook">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
              </svg>
            </a>
            <a href="https://wa.me/5535997248658" target="_blank" rel="noopener noreferrer" className={styles.socialLink} aria-label="WhatsApp">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
              </svg>
            </a>
          </div>
        </div>

        {/* Coluna 2: Links Rápidos */}
        <div className={styles.colLinks}>
          <h4 className={styles.colTitle}>Links Rápidos</h4>
          <ul className={styles.linkList}>
            <li><Link href="/" className={styles.link}>Início</Link></li>
            <li><Link href="/sobre-nos" className={styles.link}>Sobre Nós</Link></li>
            <li><Link href="/nossos-parceiros" className={styles.link}>Nossos Parceiros</Link></li>
            <li><Link href="/blog" className={styles.link}>Blog</Link></li>
            <li><Link href="/contato" className={styles.link}>Fale Conosco</Link></li>
          </ul>
        </div>

        {/* Coluna 3: Nossos Serviços */}
        <div className={styles.colLinks}>
          <h4 className={styles.colTitle}>Serviços</h4>
          <ul className={styles.linkList}>
            <li><Link href="/#bdmg" className={styles.link}>Crédito BDMG</Link></li>
            <li><Link href="/financiamento-imobiliario" className={styles.link}>Crédito Imobiliário</Link></li>
            <li><Link href="/home-equity" className={styles.link}>Home Equity</Link></li>
            <li><Link href="/financiamento-veiculos" className={styles.link}>Crédito de Veículos</Link></li>
            <li><Link href="/consorcios" className={styles.link}>Consórcios</Link></li>
          </ul>
        </div>

        {/* Coluna 4: Contato */}
        <div className={styles.colContact}>
          <h4 className={styles.colTitle}>Contato</h4>
          <ul className={styles.contactList}>
            <li className={styles.contactItem}>
              <span className={styles.contactText}>
                Rua Felipe Pizutto, 193 - Itajubá - MG
              </span>
            </li>
            <li className={styles.contactItem}>
              <span className={styles.contactText}>
                (35) 99724-8658
              </span>
            </li>
            <li className={styles.contactItem}>
              <span className={styles.contactText}>
                <a href="mailto:contato@rmjcred.com.br" className={styles.link}>
                  contato@rmjcred.com.br
                </a>
              </span>
            </li>
          </ul>
        </div>
      </div>

      {/* Faixa inferior */}
      <div className={styles.bottomBar}>
        <div className={`${styles.bottomContainer} container`}>
          <p className={styles.copyright}>
            &copy; {currentYear} RMJ Soluções de Crédito. Todos os direitos reservados.
          </p>
          <div className={styles.bottomLinks}>
            <Link href="/politica-de-privacidade" className={styles.link}>
              Política de Privacidade (LGPD)
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
