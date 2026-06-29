import type { NextConfig } from "next";

const CRM = "https://crm-rmj-mvp-rodrigo.netlify.app";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  async rewrites() {
    return {
      beforeFiles: [
        { source: "/admin/:path*", destination: `${CRM}/admin/:path*` },
        { source: "/cadastro/:path*", destination: `${CRM}/cadastro/:path*` },
        { source: "/api/auth/:path*", destination: `${CRM}/api/auth/:path*` },
        { source: "/api/leads", destination: `${CRM}/api/leads` },
        { source: "/api/propostas", destination: `${CRM}/api/propostas` },
        { source: "/api/propostas/:path*", destination: `${CRM}/api/propostas/:path*` },
        { source: "/api/propostas-imovel", destination: `${CRM}/api/propostas-imovel` },
        { source: "/api/propostas-imovel/:path*", destination: `${CRM}/api/propostas-imovel/:path*` },
        { source: "/api/propostas-veiculo", destination: `${CRM}/api/propostas-veiculo` },
        { source: "/api/propostas-veiculo/:path*", destination: `${CRM}/api/propostas-veiculo/:path*` },
      ],
    };
  },
};

export default nextConfig;
