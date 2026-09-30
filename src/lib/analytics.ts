/**
 * RMJ Soluções de Crédito — Analytics & Tracking Library
 * Centraliza todos os eventos de rastreamento (GTM + GA4 + Clarity)
 *
 * Variáveis de ambiente necessárias no Netlify:
 *   NEXT_PUBLIC_GTM_ID    (ex: GTM-XXXXXXX)
 *   NEXT_PUBLIC_GA4_ID    (ex: G-XXXXXXXXXX)
 *   NEXT_PUBLIC_CLARITY_ID (ex: 123456789)
 */

// ─── Tipos ──────────────────────────────────────────────
type ContactMethod = "whatsapp" | "phone" | "email";
type ButtonLocation = "hero" | "header" | "sidebar" | "footer" | "cta_section" | "card" | "floating";

interface FormSubmitParams {
  form_type: string;
  service_selected?: string;
  estimated_amount?: string;
}

interface CTAClickParams {
  button_text: string;
  button_location: ButtonLocation;
  page_path?: string;
}

interface ContactClickParams {
  contact_method: ContactMethod;
  page_path?: string;
}

interface ScrollDepthParams {
  depth_percentage: 25 | 50 | 75 | 100;
  page_path?: string;
}

interface ServiceViewParams {
  service_name: string;
  service_type?: string;
}

// ─── Helpers ────────────────────────────────────────────

/** Push event to GTM dataLayer (safe – noop if dataLayer absent) */
function pushToDataLayer(event: string, data: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const w = window as any;
  w.dataLayer = w.dataLayer || [];
  w.dataLayer.push({ event, ...data });
}

/** Fire GA4 gtag event (safe – noop if gtag absent) */
function gtagEvent(eventName: string, params: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const w = window as any;
  if (typeof w.gtag === "function") {
    w.gtag("event", eventName, params);
  }
}

/** Send event to both GTM and GA4 for redundancy */
function trackEvent(eventName: string, params: Record<string, unknown> = {}) {
  pushToDataLayer(eventName, params);
  gtagEvent(eventName, params);
}

// ─── Public API ─────────────────────────────────────────

/**
 * Formulário de lead enviado com sucesso.
 * Evento GA4: `generate_lead`
 */
export function trackFormSubmit(params: FormSubmitParams) {
  trackEvent("generate_lead", {
    form_type: params.form_type,
    service_selected: params.service_selected ?? "",
    estimated_amount: params.estimated_amount ?? "",
    page_path: typeof window !== "undefined" ? window.location.pathname : "",
  });
}

/**
 * Clique em botão CTA (Simular Agora, Saber Mais, etc.)
 * Evento GA4: `click_cta`
 */
export function trackCTAClick(params: CTAClickParams) {
  trackEvent("click_cta", {
    button_text: params.button_text,
    button_location: params.button_location,
    page_path: params.page_path ?? (typeof window !== "undefined" ? window.location.pathname : ""),
  });
}

/**
 * Clique em link de WhatsApp.
 * Evento GA4: `click_contact` com method = whatsapp
 */
export function trackWhatsAppClick(location: ButtonLocation = "floating") {
  trackEvent("click_contact", {
    contact_method: "whatsapp" as ContactMethod,
    button_location: location,
    page_path: typeof window !== "undefined" ? window.location.pathname : "",
  });
}

/**
 * Clique em link de telefone.
 * Evento GA4: `click_contact` com method = phone
 */
export function trackPhoneClick(params?: ContactClickParams) {
  trackEvent("click_contact", {
    contact_method: params?.contact_method ?? "phone",
    page_path: params?.page_path ?? (typeof window !== "undefined" ? window.location.pathname : ""),
  });
}

/**
 * Visualização de página de serviço específico.
 * Evento GA4: `view_service`
 */
export function trackServiceView(params: ServiceViewParams) {
  trackEvent("view_service", {
    service_name: params.service_name,
    service_type: params.service_type ?? "credit",
    page_path: typeof window !== "undefined" ? window.location.pathname : "",
  });
}

/**
 * Profundidade de scroll atingida (25 / 50 / 75 / 100%).
 * Evento GA4: `scroll_depth`
 */
export function trackScrollDepth(params: ScrollDepthParams) {
  trackEvent("scroll_depth", {
    depth_percentage: params.depth_percentage,
    page_path: params.page_path ?? (typeof window !== "undefined" ? window.location.pathname : ""),
  });
}

/**
 * Início de preenchimento de formulário.
 * Evento GA4: `begin_form`
 */
export function trackFormBegin(formType: string) {
  trackEvent("begin_form", {
    form_type: formType,
    page_path: typeof window !== "undefined" ? window.location.pathname : "",
  });
}
