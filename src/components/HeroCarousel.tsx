"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './HeroCarousel.module.css';

export const BF_CAMPAIGN_CONFIG = {
  rateSpread: "Selic + 4,0%",
  ratePeriod: "a.a.",
  rateEffectiveYear: "17,75% a.a.",
  rateEffectiveMonth: "1,37% a.m.",
  maxLimit: "500 mil",
  maxTermMonths: 72,
  gracePeriod: "12 meses",
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
    title: 'Capital de giro com a ',
    highlight: 'menor taxa do ano',
    description: '',
    bgImage: '/assets/bf-bg-desktop.webp',
    primaryLink: '/black-friday-bdmg#simular',
    secondaryLink: '/black-friday-bdmg',
    secondaryText: 'Ver condições',
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

function getRemainingTime(endDateStr: string) {
  const diff = new Date(endDateStr).getTime() - Date.now();
  if (diff <= 0) return null;
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  return { days, hours };
}

export default function HeroCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [timeLeft, setTimeLeft] = useState<{ days: number; hours: number } | null>(null);
  const [campaignActive, setCampaignActive] = useState<boolean>(() => {
    return new Date().getTime() < new Date(BF_CAMPAIGN_CONFIG.endDate).getTime();
  });

  useEffect(() => {
    const updateCountdown = () => {
      const remaining = getRemainingTime(BF_CAMPAIGN_CONFIG.endDate);
      if (!remaining) {
        setCampaignActive(false);
        setTimeLeft(null);
      } else {
        setCampaignActive(true);
        setTimeLeft(remaining);
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 60000);
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
      <div className={slide.isCampaignBanner ? styles.heroCampaignOverlay : styles.heroOverlay}></div>
      
      {slide.isCampaignBanner ? (
        <div className={`container ${styles.heroContainer}`}>
          <div className={`${styles.heroContent} ${styles.campaignHeroContent}`} key={slide.id}>
            {/* [1] Eyebrow */}
            <div className={styles.campaignEyebrow}>
              <span className={styles.campaignEyebrowDot} />
              BLACK FRIDAY DO CRÉDITO · RMJ + BDMG
            </div>

            {/* [2] Title */}
            <h1 className={styles.heroTitle}>
              {slide.title}
              <span className={styles.heroTitleHighlight}>{slide.highlight}</span>
            </h1>

            {/* [3] Rate highlight */}
            <div className={styles.campaignRateBlock}>
              <div className={styles.campaignRateMain}>
                <span className={styles.campaignRateNumber}>{BF_CAMPAIGN_CONFIG.rateSpread}</span>
                <span className={styles.campaignRatePeriod}>{BF_CAMPAIGN_CONFIG.ratePeriod}</span>
              </div>
              <p className={styles.campaignRateSub}>
                hoje ≈ {BF_CAMPAIGN_CONFIG.rateEffectiveYear} · {BF_CAMPAIGN_CONFIG.rateEffectiveMonth}
              </p>
            </div>

            {/* [4] Chips */}
            <div className={styles.campaignChips}>
              <span className={styles.campaignChip}>até R$ {BF_CAMPAIGN_CONFIG.maxLimit}</span>
              <span className={styles.campaignChip}>{BF_CAMPAIGN_CONFIG.maxTermMonths} meses</span>
              <span className={styles.campaignChip}>{BF_CAMPAIGN_CONFIG.gracePeriod} de carência</span>
            </div>

            {/* [5] Action buttons */}
            <div className={styles.heroButtons}>
              <Link href={slide.primaryLink} className="btn btn-primary">
                Simular minha taxa
              </Link>
              {slide.secondaryLink && slide.secondaryText && (
                <Link href={slide.secondaryLink} className="btn btn-outline">
                  {slide.secondaryText}
                </Link>
              )}
            </div>

            {/* [6] Deadline & countdown */}
            <div className={styles.campaignDeadline}>
              <svg 
                viewBox="0 0 24 24" 
                width="16" 
                height="16" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                aria-hidden="true"
              >
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              <span>
                Termina em {BF_CAMPAIGN_CONFIG.displayEndDate}
                {timeLeft && (
                  <> · restam {timeLeft.days}d {timeLeft.hours}h</>
                )}
              </span>
            </div>

            {/* [7] Legal disclaimer */}
            <p className={styles.campaignLegal}>
              Sujeito a análise e aprovação de crédito. CET informado na proposta. Condições do BDMG válidas até {BF_CAMPAIGN_CONFIG.displayEndDate}.
            </p>

            {/* [8] Brands */}
            <div className={styles.campaignBrands}>
              <Image
                src="/assets/logo-rmj-horizontal.png"
                alt="RMJ Soluções de Crédito"
                width={96}
                height={32}
                className={styles.brandRmj}
              />
              <span className={styles.brandSeparator}>em parceria com</span>
              <Image
                src="/assets/selo-parceiro-bdmg-negativo.png"
                alt="BDMG"
                width={90}
                height={24}
                className={styles.brandBdmg}
              />
            </div>
          </div>
        </div>
      ) : (
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
