"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './HeroCarousel.module.css';

const slides = [
  {
    id: 'bdmg',
    logo: '/assets/logo-bdmg-parceiro-244x150.png',
    title: 'Crédito BDMG Inteligente para ',
    highlight: 'Pequenos Negócios',
    description: 'Tenha acesso a crédito empresarial descomplicado, com os melhores prazos, taxas competitivas e menos burocracia. Potencialize o crescimento do seu negócio sem precisar adquirir produtos casados.',
    bgImage: '/assets/mg_historic_city.png',
    primaryLink: '/credito-bdmg#simular',
    secondaryLink: '/credito-bdmg#como-funciona',
    secondaryText: 'Como Funciona?'
  },
  {
    id: 'imobiliario',
    logo: null,
    title: 'O Caminho Mais Curto para o seu ',
    highlight: 'Novo Imóvel',
    description: 'Crédito imobiliário inteligente. Ajudamos você a encontrar a melhor taxa do mercado para conquistar sua casa própria sem dores de cabeça.',
    bgImage: '/assets/real_estate_handover.png',
    primaryLink: '/financiamento-imobiliario#simular',
    secondaryLink: '/financiamento-imobiliario',
    secondaryText: 'Saiba Mais'
  },
  {
    id: 'home-equity',
    logo: null,
    title: 'Transforme o seu Imóvel em ',
    highlight: 'Dinheiro na Conta',
    description: 'O Home Equity oferece as menores taxas do mercado usando seu imóvel quitado como garantia. Ideal para unificar dívidas ou investir.',
    bgImage: '/assets/home_equity_hero_bg_v2.png',
    primaryLink: '/home-equity#simular',
    secondaryLink: '/home-equity',
    secondaryText: 'Saiba Mais'
  },
  {
    id: 'consorcio',
    logo: null,
    title: 'Segurança patrimonial e ',
    highlight: 'planejamento sob medida',
    description: 'Consórcios imobiliários e automotivos estruturados sob medida por quem entende de estratégia financeira.',
    bgImage: '/assets/consorcio_hero_bg.jpg',
    primaryLink: '/consorcios#simular',
    secondaryLink: '/consorcios',
    secondaryText: 'Ver Planos'
  }
];

export default function HeroCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const slide = slides[currentSlide];

  return (
    <section 
      className={styles.hero}
      style={{ backgroundImage: `url(${slide.bgImage})` }}
    >
      <div className={styles.heroOverlay}></div>
      <div className={`container ${styles.heroContainer}`}>
        <div className={styles.heroContent} key={slide.id}>
          <div className={styles.heroPartnerIntegrated}>
            {slide.logo && (
              <Image
                src={slide.logo}
                alt="Logo Parceiro"
                width={150}
                height={92}
                className={styles.heroPartnerLogo}
                style={{ objectFit: 'contain' }}
                priority
              />
            )}
          </div>
          <h1 className={styles.heroTitle}>
            {slide.title}<span className={styles.heroTitleHighlight}>{slide.highlight}</span>
          </h1>
          <p className={styles.heroDescription}>
            {slide.description}
          </p>
          <div className={styles.heroButtons}>
            <Link href={slide.primaryLink} className="btn btn-primary">
              Simular Crédito Agora
            </Link>
            <Link href={slide.secondaryLink} className="btn btn-outline">
              {slide.secondaryText}
            </Link>
          </div>
        </div>
      </div>

      <div className={styles.carouselIndicators}>
        {slides.map((_, index) => (
          <button 
            key={index} 
            className={`${styles.indicator} ${index === currentSlide ? styles.active : ''}`}
            onClick={() => setCurrentSlide(index)}
            aria-label={`Ir para o slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
