"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './HeroCarousel.module.css';

export const BF_CAMPAIGN_CONFIG = {
  title: "Vem aí! Black Friday Crédito BDMG",
  dateBadge: "17/11/26",
  subtitle: "Oportunidade exclusiva para impulsionar seus negócios.",
  legalNotice: "Sujeito a análise e aprovação de crédito. CET informado na proposta. Condições do BDMG válidas até 30/11.",
  endDate: "2026-11-30T23:59:59-03:00",
  displayEndDate: "30/11",
};

interface Slide {
  id: string;
  isCampaignBanner?: boolean;
  logo?: string | null;
  title: string;
  highlight: string;
  description: string;
  bgImage: string;
  primaryLink: string;
  secondaryLink?: string;
  secondaryText?: string;
  duration?: number;
}

const allSlides: Slide[] = [
  {
    id: 'black-friday-bdmg',
    isCampaignBanner: true,
    logo: null,
    title: 'Black Friday Crédito BDMG',
    highlight: 'Oportunidade exclusiva para impulsionar seus negócios.',
    description: 'Campanha oficial BDMG.',
    bgImage: '/assets/banner-bf-oficial-desktop.webp',
    primaryLink: '/black-friday-bdmg',
    duration: 11000 // 11 segundos de destaque na tela
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
  const [campaignActive, setCampaignActive] = useState<boolean>(() => {
    return new Date().getTime() < new Date(BF_CAMPAIGN_CONFIG.endDate).getTime();
  });

  useEffect(() => {
    const checkExpiry = () => {
      const active = new Date().getTime() < new Date(BF_CAMPAIGN_CONFIG.endDate).getTime();
      setCampaignActive(active);
    };
    checkExpiry();
    const interval = setInterval(checkExpiry, 60000);
    return () => clearInterval(interval);
  }, []);

  const slides = campaignActive
    ? allSlides
    : allSlides.filter((s) => !s.isCampaignBanner);

  const safeSlideIndex = currentSlide >= slides.length ? 0 : currentSlide;
  const slide = slides[safeSlideIndex];

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches) {
      return; // Sem autoplay se o usuário preferir redução de movimento
    }

    const duration = slide?.duration || 6000;
    const timer = setTimeout(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, duration);
    return () => clearTimeout(timer);
  }, [safeSlideIndex, slides.length, slide?.duration]);

  return (
    <section 
      className={`${styles.hero} ${slide.isCampaignBanner ? styles.heroCampaign : ''}`}
      style={slide.isCampaignBanner ? undefined : { backgroundImage: `url(${slide.bgImage})` }}
    >
      {slide.isCampaignBanner ? (
        <>
          {/* Link clicável cobrindo todo o banner */}
          <Link 
            href={slide.primaryLink} 
            className={styles.campaignLink}
            aria-label="Vem aí Black Friday Crédito BDMG - Oportunidade exclusiva para impulsionar seus negócios"
          >
            <span className={styles.srOnly}>
              {BF_CAMPAIGN_CONFIG.title} - {BF_CAMPAIGN_CONFIG.subtitle}
            </span>
          </Link>

          {/* Condição legal da campanha oficial */}
          <div className={styles.campaignLegalBar}>
            <p className={styles.campaignLegalCondition}>
              {BF_CAMPAIGN_CONFIG.legalNotice}
            </p>
          </div>
        </>
      ) : (
        <>
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
                {slide.secondaryLink && slide.secondaryText && (
                  <Link href={slide.secondaryLink} className="btn btn-outline">
                    {slide.secondaryText}
                  </Link>
                )}
              </div>
            </div>
          </div>
        </>
      )}

      <div className={styles.carouselIndicators}>
        {slides.map((_, index) => (
          <button 
            key={index} 
            className={`${styles.indicator} ${index === safeSlideIndex ? styles.active : ''}`}
            onClick={(e) => {
              e.stopPropagation();
              setCurrentSlide(index);
            }}
            aria-label={`Ir para o slide ${index + 1} de ${slides.length}`}
          />
        ))}
      </div>
    </section>
  );
}
