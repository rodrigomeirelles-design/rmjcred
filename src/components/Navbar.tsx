"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import styles from "./Navbar.module.css";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <header className={styles.header}>
      <div className={`${styles.container} container`}>
        {/* Logo */}
        <Link href="/" className={styles.logoLink}>
          <Image
            src="/assets/logo-rmj-header.jpg"
            alt="RMJ Soluções de Crédito Logo"
            width={110}
            height={60}
            style={{ objectFit: "contain", height: "50px", width: "auto" }}
            priority
          />
        </Link>

        {/* Menu Hamburguer (Mobile) */}
        <button 
          className={`${styles.hamburger} ${isOpen ? styles.active : ""}`} 
          onClick={toggleMenu}
          aria-label="Abrir menu de navegação"
          aria-expanded={isOpen}
        >
          <span className={styles.bar}></span>
          <span className={styles.bar}></span>
          <span className={styles.bar}></span>
        </button>

        {/* Links de Navegação */}
        <nav className={`${styles.nav} ${isOpen ? styles.open : ""}`}>
          <ul className={styles.navList}>
            <li>
              <Link href="/" className={styles.navLink} onClick={() => setIsOpen(false)}>
                Início
              </Link>
            </li>
            <li className={styles.dropdown}>
              <span className={styles.navLink}>Serviços</span>
              <ul className={styles.dropdownMenu}>
                <li>
                  <Link href="/#bdmg" className={styles.dropdownLink} onClick={() => setIsOpen(false)}>
                    Crédito BDMG
                  </Link>
                </li>
                <li>
                  <Link href="/financiamento-imobiliario" className={styles.dropdownLink} onClick={() => setIsOpen(false)}>
                    Financiamento Imobiliário
                  </Link>
                </li>
                <li>
                  <Link href="/home-equity" className={styles.dropdownLink} onClick={() => setIsOpen(false)}>
                    Home Equity
                  </Link>
                </li>
                <li>
                  <Link href="/financiamento-veiculos" className={styles.dropdownLink} onClick={() => setIsOpen(false)}>
                    Financiamento de Veículos
                  </Link>
                </li>
                <li>
                  <Link href="/credito-garantia-veiculo" className={styles.dropdownLink} onClick={() => setIsOpen(false)}>
                    Crédito com Garantia de Veículo
                  </Link>
                </li>
                <li>
                  <Link href="/consorcios" className={styles.dropdownLink} onClick={() => setIsOpen(false)}>
                    Consórcios
                  </Link>
                </li>
              </ul>
            </li>
            <li>
              <Link href="/nossos-parceiros" className={styles.navLink} onClick={() => setIsOpen(false)}>
                Parceiros
              </Link>
            </li>
            <li>
              <Link href="/sobre-nos" className={styles.navLink} onClick={() => setIsOpen(false)}>
                Sobre Nós
              </Link>
            </li>
            <li>
              <Link href="/contato" className={styles.navLink} onClick={() => setIsOpen(false)}>
                Contato
              </Link>
            </li>
          </ul>
          
          <div className={styles.navCTA}>
            <Link href="/contato#simular" className="btn btn-primary" onClick={() => setIsOpen(false)}>
              Simular Crédito
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}
