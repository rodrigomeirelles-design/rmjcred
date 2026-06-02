import styles from "./PartnerStrip.module.css";

export default function PartnerStrip() {
  return (
    <section className={styles.partnerStrip}>
      <div className={`${styles.stripContainer} container`}>
        <div className={styles.stripText}>
          Mais de 50 instituições financeiras parceiras
        </div>
        <div className={styles.logosWrapper}>
          {/* 1. Porto */}
          <div className={styles.logoItem} title="Porto Seguro">
            <svg viewBox="0 0 100 30" className={styles.svgLogo}>
              <path d="M12 5 C8 10 5 15 5 22 L15 22 C15 15 12 10 12 5 Z" fill="#004691" />
              <path d="M17 12 C14 15 12 18 12 22 L22 22 C22 18 17 15 17 12 Z" fill="#00a1e4" />
              <text x="28" y="21" fontFamily="system-ui, sans-serif" fontWeight="800" fontSize="16" fill="#000000">Porto</text>
            </svg>
          </div>

          {/* 2. Creditas */}
          <div className={styles.logoItem} title="Creditas">
            <svg viewBox="0 0 120 30" className={styles.svgLogo}>
              <circle cx="15" cy="15" r="10" fill="#00E676" />
              <path d="M12 12 L18 12 L18 18 M18 12 L12 18" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
              <text x="32" y="21" fontFamily="system-ui, sans-serif" fontWeight="800" fontSize="16" fill="#000000">creditas</text>
            </svg>
          </div>

          {/* 3. Itaú */}
          <div className={styles.logoItem} title="Itaú">
            <svg viewBox="0 0 100 30" className={styles.svgLogo}>
              <rect x="5" y="3" width="24" height="24" rx="6" fill="#EC7000" />
              <text x="9" y="19" fontFamily="system-ui, sans-serif" fontWeight="800" fontSize="11" fill="#FFF" fontStyle="italic">itaú</text>
              <text x="35" y="21" fontFamily="system-ui, sans-serif" fontWeight="800" fontSize="16" fill="#000" fontStyle="italic">itaú</text>
            </svg>
          </div>

          {/* 4. C6 Bank */}
          <div className={styles.logoItem} title="C6 Bank">
            <svg viewBox="0 0 110 30" className={styles.svgLogo}>
              <text x="5" y="21" fontFamily="system-ui, sans-serif" fontWeight="900" fontSize="20" fill="#000000" letterSpacing="0.5">C6</text>
              <text x="38" y="21" fontFamily="system-ui, sans-serif" fontWeight="400" fontSize="16" fill="#000000" letterSpacing="1">BANK</text>
            </svg>
          </div>

          {/* 5. Bradesco */}
          <div className={styles.logoItem} title="Bradesco">
            <svg viewBox="0 0 125 30" className={styles.svgLogo}>
              <circle cx="15" cy="15" r="10" fill="#CC092F" />
              <path d="M12 11 L12 19 L15 19 L15 11 Z M18 11 L18 19 L15 19 L15 11 Z M11 10 C15 7 20 10 20 10" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" fill="none" />
              <text x="32" y="21" fontFamily="system-ui, sans-serif" fontWeight="700" fontSize="15" fill="#000000" letterSpacing="-0.5">bradesco</text>
            </svg>
          </div>

          {/* 6. Prudential */}
          <div className={styles.logoItem} title="Prudential">
            <svg viewBox="0 0 135 30" className={styles.svgLogo}>
              <circle cx="15" cy="15" r="10" fill="#003366" />
              <path d="M10 18 L15 10 L20 18 Z" fill="#FFFFFF" />
              <path d="M13 18 L15 14 L17 18 Z" fill="#003366" />
              <text x="32" y="21" fontFamily="system-ui, sans-serif" fontWeight="800" fontSize="15" fill="#000000">Prudential</text>
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}
