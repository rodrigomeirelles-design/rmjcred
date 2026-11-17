"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './HeroCarousel.module.css';

export const BF_CAMPAIGN_CONFIG = {
  title: "Black Friday Crédito BDMG",
  rateSpread: "a partir de 4,5% a.a. + Selic",
  ratePeriod: "",
  subtitle: "Condições exclusivas de Black Friday BDMG.",
  legalNotice: "Sujeito a análise e aprovação de crédito. CET informado na proposta. Condições do BDMG válidas até 30/11.",
  endDate: "2026-11-30T23:59:59-03:00",
  displayEndDate: "30/11",
};

// Tempo de rotação por banner: 4.5 segundos (entre 4s e 5s)
const SLIDE_DURATION = 4500;

interface Slide {
  id: string;
  isCampaignBanner?: boolean;
  isConsorcioBanner?: boolean;
  logo?: string | null;
  title: string;
  highlight: string;
  description: string;
  bgImage: string;
  primaryLink: string;
  secondaryLink?: string;
  secondaryText?: string;
}

const allSlides: Slide[] = [
  {
    id: 'black-friday-bdmg',
    isCampaignBanner: true,
    logo: null,
    title: 'Black Friday Crédito BDMG',
    highlight: 'a partir de 4,5% a.a. + Selic',
    description: 'Campanha oficial BDMG.',
    bgImage: '/assets/banner-bf-v2-desktop.webp',
    primaryLink: '/black-friday-bdmg',
  },
  {
    id: 'black-friday-consorcio',
    isConsorcioBanner: true,
    logo: null,
    title: 'A Black do consórcio que mais cresce no Brasil',
    highlight: '60% de redução até a contemplação',
    description: 'Cotas limitadas! Garanta já a sua.',
    bgImage: '/assets/banner-consorcio-black-desktop.webp',
    primaryLink: '/consorcios#simular',
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
  }
];

export default function HeroCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
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
    : allSlides.filter((s) => !s.isCampaignBanner && !s.isConsorcioBanner);

  const safeSlideIndex = currentSlide >= slides.length ? 0 : currentSlide;

  // Autoplay constante a cada 4.5s com pausa suave ao passar o mouse
  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, SLIDE_DURATION);

    return () => clearInterval(timer);
  }, [slides.length, isPaused]);

  return (
    <section 
      className={styles.heroCarouselContainer}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      aria-roledescription="carousel"
      aria-label="Destaques e Campanhas RMJ"
    >
      {slides.map((slide, index) => {
        const isActive = index === safeSlideIndex;
        return (
          <div
            key={slide.id}
            className={`${styles.slideLayer} ${isActive ? styles.slideActive : ''}`}
            aria-hidden={!isActive}
          >
            {slide.isCampaignBanner ? (
              <div className={styles.heroCampaign}>
                <div className={styles.campaignBannerContainer}>
                  {/* Link clicável cobrindo todo o banner */}
                  <Link 
                    href={slide.primaryLink} 
                    className={styles.campaignLink}
                    aria-label="Black Friday Crédito BDMG - a partir de 4,5% a.a. + Selic"
                    tabIndex={isActive ? 0 : -1}
                  >
                    <span className={styles.srOnly}>
                      {BF_CAMPAIGN_CONFIG.title} - {BF_CAMPAIGN_CONFIG.rateSpread} {BF_CAMPAIGN_CONFIG.ratePeriod} - {BF_CAMPAIGN_CONFIG.subtitle}
                    </span>
                  </Link>

                  {/* Rodapé do banner em branco, pequenininho */}
                  <div className={styles.campaignLegalBar}>
                    <p className={styles.campaignLegalCondition}>
                      {BF_CAMPAIGN_CONFIG.legalNotice}
                    </p>
                  </div>
                </div>
              </div>
            ) : slide.isConsorcioBanner ? (
              <div className={styles.heroConsorcioCampaign}>
                <div className={styles.consorcioBannerInner}>
                  <picture className={styles.consorcioPicture}>
                    <source
                      media="(min-width: 992px)"
                      srcSet="/assets/banner-consorcio-black-desktop.webp"
                      type="image/webp"
                    />
                    <source
                      media="(min-width: 992px)"
                      srcSet="/assets/banner-consorcio-black-desktop.jpg"
                      type="image/jpeg"
                    />
                    <source
                      srcSet="/assets/banner-consorcio-black-mobile.webp"
                      type="image/webp"
                    />
                    <img
                      src="/assets/banner-consorcio-black-mobile.jpg"
                      alt="A Black do consórcio que mais cresce no Brasil - 60% de redução até a contemplação"
                      className={styles.consorcioImg}
                      loading={index <= 1 ? "eager" : "lazy"}
                    />
                  </picture>

                  {/* Link clicável cobrindo todo o banner */}
                  <Link 
                    href={slide.primaryLink} 
                    className={styles.campaignLink}
                    aria-label="A Black do consórcio que mais cresce no Brasil - 60% de redução até a contemplação - Solicitar Simulação"
                    tabIndex={isActive ? 0 : -1}
                  >
                    <span className={styles.srOnly}>
                      A Black do consórcio que mais cresce no Brasil. 60% de redução até a contemplação. Cotas limitadas! Garanta já a sua. Solicitar simulação.
                    </span>
                  </Link>

                  {/* Botão para solicitar simulação posicionado no espaço abaixo da tabela */}
                  <div className={styles.consorcioCtaWrapper}>
                    <Link 
                      href={slide.primaryLink} 
                      className={styles.btnConsorcioCta}
                      tabIndex={isActive ? 0 : -1}
                    >
                      <span>Solicitar Simulação</span>
                      <svg 
                        viewBox="0 0 24 24" 
                        width="18" 
                        height="18" 
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth="2.5" 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        aria-hidden="true"
                      >
                        <path d="M5 12h14M12 5l7 7-7 7"/>
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
            ) : (
              <div 
                className={styles.heroStandard}
                style={{ backgroundImage: `url(${slide.bgImage})` }}
              >
                <div className={styles.heroOverlay}></div>
                <div className={`container ${styles.heroContainer}`}>
                  <div className={styles.heroContent}>
                    <div className={styles.heroPartnerIntegrated}>
                      {slide.logo && (
                        <Image
                          src={slide.logo}
                          alt="Logo Parceiro"
                          width={150}
                          height={92}
                          className={styles.heroPartnerLogo}
                          style={{ objectFit: 'contain' }}
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
                      <Link 
                        href={slide.primaryLink} 
                        className="btn btn-primary"
                        tabIndex={isActive ? 0 : -1}
                      >
                        Simular Crédito Agora
                      </Link>
                      {slide.secondaryLink && slide.secondaryText && (
                        <Link 
                          href={slide.secondaryLink} 
                          className="btn btn-outline"
                          tabIndex={isActive ? 0 : -1}
                        >
                          {slide.secondaryText}
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}

      {/* Indicadores de navegação */}
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
