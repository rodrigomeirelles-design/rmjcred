"use client";

import styles from "./page.module.css";
import { trackWhatsAppClick } from "@/lib/analytics";

export const BF_WHATSAPP_URL =
  "https://wa.me/5535991084513?text=" +
  encodeURIComponent("Olá, Rodrigo! Acessei a página especial da Black Friday BDMG no site da RMJ e gostaria de simular crédito com taxa a partir de Selic + 4,0% a.a. para minha empresa.");

type Location = "hero" | "cta_section" | "card";

export default function WhatsAppCta({
  label = "Falar no WhatsApp",
  location = "hero",
  large = false,
}: {
  label?: string;
  location?: Location;
  large?: boolean;
}) {
  return (
    <a
      href={BF_WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={`${styles.btnWhatsapp} ${large ? styles.btnWhatsappLarge : ""}`}
      onClick={() => trackWhatsAppClick(location)}
    >
      <svg viewBox="0 0 24 24" width={large ? 24 : 20} height={large ? 24 : 20} fill="currentColor" aria-hidden="true">
        <path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.21 3.08c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.23 1.36.2 1.87.12.57-.09 1.76-.72 2.01-1.41.25-.7.25-1.29.17-1.41-.07-.13-.27-.2-.57-.35zM12.05 21.5h-.01a9.4 9.4 0 0 1-4.8-1.32l-.34-.2-3.57.94.95-3.48-.22-.36a9.43 9.43 0 1 1 7.99 4.42zm8.02-17.45A11.3 11.3 0 0 0 12.04.75 11.34 11.34 0 0 0 2.22 17.76L.6 23.25l5.63-1.48a11.3 11.3 0 0 0 5.8 1.48h.01A11.34 11.34 0 0 0 20.07 4.05z" />
      </svg>
      {label}
    </a>
  );
}
