import type { NextConfig } from "next";

const CRM_ORIGIN = "https://crm-rmj-mvp-rodrigo.netlify.app";

const nextConfig: NextConfig = {
  assetPrefix: process.env.NODE_ENV === "production" ? CRM_ORIGIN : undefined,
  async rewrites() {
    return [
      { source: "/cadastro/financiamento-imobiliario", destination: "/cadastro/imovel/financiamento" },
      { source: "/cadastro/home-equity", destination: "/cadastro/imovel/home-equity" },
    ];
  },
};

export default nextConfig;
