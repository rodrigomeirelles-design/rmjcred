import Image from "next/image";
import styles from "./WhatsAppButton.module.css";

export default function WhatsAppButton() {
  const whatsappUrl = "https://wa.me/5535997248658?text=Olá,%20acessei%20o%20site%20da%20RMJ%20e%20gostaria%20de%20solicitar%20uma%20simulação%20de%20crédito.";

  return (
    <a
      href={whatsappUrl}
      className={styles.floatButton}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Fale conosco pelo WhatsApp"
    >
      <Image
        src="/assets/whatsapp-icon.png"
        alt="WhatsApp Oficial"
        width={60}
        height={60}
        style={{ objectFit: "cover", borderRadius: "50%", zIndex: 2 }}
      />
      <span className={styles.pulse}></span>
    </a>
  );
}
