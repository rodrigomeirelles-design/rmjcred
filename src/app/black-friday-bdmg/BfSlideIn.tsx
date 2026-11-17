"use client";

import { useEffect, useState } from "react";
import styles from "./page.module.css";
import WhatsAppCta from "./WhatsAppCta";

const STORAGE_KEY = "rmj_bf_bdmg_slidein_closed";
const DELAY_MS = 22000;

export default function BfSlideIn() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (sessionStorage.getItem(STORAGE_KEY) === "1") return;
    } catch {
      /* sessionStorage indisponível: segue sem persistência */
    }

    let shown = false;
    const show = () => {
      if (shown) return;
      shown = true;
      setVisible(true);
      cleanup();
    };

    const onScroll = () => {
      const doc = document.documentElement;
      const scrollable = doc.scrollHeight - window.innerHeight;
      if (scrollable > 0 && window.scrollY / scrollable >= 0.4) show();
    };

    const timer = window.setTimeout(show, DELAY_MS);
    window.addEventListener("scroll", onScroll, { passive: true });

    function cleanup() {
      window.clearTimeout(timer);
      window.removeEventListener("scroll", onScroll);
    }
    return cleanup;
  }, []);

  const close = () => {
    setVisible(false);
    try {
      sessionStorage.setItem(STORAGE_KEY, "1");
    } catch {
      /* ignore */
    }
  };

  if (!visible) return null;

  return (
    <aside className={styles.slideIn} role="dialog" aria-label="Black Friday Crédito BDMG">
      <button type="button" className={styles.slideInClose} onClick={close} aria-label="Fechar">
        ×
      </button>
      <div className={styles.slideInBadge}>
        <span>🔥</span> BLACK FRIDAY BDMG
      </div>
      <p className={styles.slideInText}>
        Quer saber quanto sua empresa pode acessar com a taxa especial a partir de <strong>Selic + 4,0% a.a.</strong>?
      </p>
      <div className={styles.slideInActions}>
        <WhatsAppCta label="Falar agora com o Rodrigo" location="card" />
        <a href="#simular" onClick={close} className={styles.slideInFormLink}>
          Ou preencha o formulário rápido &rarr;
        </a>
      </div>
    </aside>
  );
}
