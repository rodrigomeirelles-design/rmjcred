"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './HeroCarousel.module.css';

interface Slide {
  id: string;
  isCampaignBanner?: boolean;
  logo?: string | null;
  title: string;
  highlight: string;
  description: string;
  bgImage: string;
  mobileBgImage?: string;
  primaryLink: string;
  primaryText?: string;
  secondaryLink: string;
  secondaryText: string;
  duration?: number;
}

const slides: Slide[] = [
  {
    id: 'black-friday-bdmg',
    isCampaignBanner: true,
    logo: null,
    title: 'Black Friday Crédito BDMG: ',
    highlight: 'Taxas a partir de Selic + 4,0% a.a.',
    description: 'Campanha exclusiva BDMG para impulsionar sua empresa com as menores taxas do mercado e prazos estendidos.',
    bgImage: '/assets/banner-black-friday-hero.jpg',
    mobileBgImage: '/assets/banner-black-friday-mobile-final.jpg',
    primaryLink: '/credito-bdmg#simular',
    primaryText: 'Quero Aproveitar a Black Friday',
    secondaryLink: 'https://wa.me/5535991084513?text=Ol%C3%A1!%20Gostaria%20de%20aproveitar%20as%20condi%C3%A7%C3%B5es%20exclusivas%20da%20Black%20Friday%20BDMG.',
    secondaryText: 'Falar no WhatsApp',
    duration: 11000 // 11 segundos de transição para dar destaque à campanha
  },
  {
    id: 'bdmg',
    logo: null,
    title: 'Crédito Sob Medida com as ',
    highlight: 'Melhores Taxas do Mercado',
    description: 'Comparamos ofertas em mais de 50 instituições financeiras para encontrar a menor taxa e o melhor prazo para o seu perfil. Assessoria 100% gratuita.',
    bgImage: '/assets/mg_historic_city.png',
    primaryLink: '/credito-bdmg#simular',
    secondaryLink: '/credito-bdmg#como-funciona',
    secondaryText: 'Como Funciona?',
    duration: 6000
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
    secondaryText: 'Saiba Mais',
    duration: 6000
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
    secondaryText: 'Saiba Mais',
    duration: 6000
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
    secondaryText: 'Ver Planos',
    duration: 6000
  }
];

export default function HeroCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const duration = slides[currentSlide].duration || 6000;
    const timer = setTimeout(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, duration);
    return () => clearTimeout(timer);
  }, [currentSlide]);

  const slide = slides[currentSlide];

  return (
    <section 
      className={`${styles.hero} ${slide.isCampaignBanner ? styles.heroCampaign : ''}`}
      style={{ backgroundImage: `url(${slide.bgImage})` }}
    >
      <div className={slide.isCampaignBanner ? styles.heroOverlayCampaign : styles.heroOverlay}></div>
      <div className={`container ${styles.heroContainer}`}>
        {slide.isCampaignBanner ? (
          <div className={styles.campaignContainer} key={slide.id}>
            {/* Título e descrição acessíveis para SEO e leitores de tela */}
            <h1 className="sr-only">
              {slide.title}{slide.highlight}
            </h1>
            <p className="sr-only">
              {slide.description}
            </p>

            <div className={styles.campaignButtons}>
              <Link href={slide.primaryLink} className={styles.btnBlackFriday}>
                <span>⚡</span>
                {slide.primaryText || 'Quero Minha Análise Gratuita'}
              </Link>
              <a 
                href={slide.secondaryLink}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.btnWhatsappBf}
              >
                <Image 
                  src="/assets/whatsapp-icon.png" 
                  alt="WhatsApp" 
                  width={20} 
                  height={20} 
                  style={{ objectFit: 'contain' }}
                />
                {slide.secondaryText}
              </a>
            </div>
          </div>
        ) : (
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
        )}
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
