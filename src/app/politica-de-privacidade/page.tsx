import Link from "next/link";

export const metadata = {
  title: "Política de Privacidade — RMJ Soluções de Crédito",
  description: "Leia a política de privacidade e conformidade com a LGPD da RMJ Soluções de Crédito, sediada em Itajubá - MG.",
};

export default function PoliticaPrivacidade() {
  return (
    <article style={{ padding: "4rem 0" }}>
      <div className="container" style={{ maxWidth: "800px", display: "flex", flexDirection: "column", gap: "2rem" }}>
        
        <Link href="/" style={{ fontSize: "0.9rem", fontWeight: "600", color: "var(--neutral-muted)" }}>
          &larr; Voltar para a Página Inicial
        </Link>
        
        <header>
          <h1 style={{ fontSize: "2.5rem", color: "var(--primary-dark)", marginBottom: "1rem" }}>
            Política de Privacidade
          </h1>
          <p style={{ color: "var(--neutral-muted)", fontSize: "0.95rem" }}>
            Última atualização: 07 de Maio de 2026.
          </p>
        </header>

        <section style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          <p>
            A <strong>RMJ Soluções de Crédito</strong>, com sede em Itajubá, MG, valoriza a privacidade dos seus usuários e clientes. Esta política descreve como coletamos, usamos e protegemos suas informações ao interagir com nossos serviços de consultoria financeira, intermediação de fomento e atendimento via WhatsApp e outras plataformas digitais.
          </p>

          <h2 style={{ fontSize: "1.5rem", color: "var(--primary-color)", marginTop: "1rem" }}>
            1. Informações que Coletamos
          </h2>
          <p>
            Coletamos informações necessárias estritamente para a prestação de nossos serviços de consultoria financeira e intermediação de crédito junto aos parceiros, tais como:
          </p>
          <ul style={{ paddingLeft: "1.5rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <li><strong>Dados de Contato:</strong> Nome completo, número de telefone/WhatsApp e endereço de e-mail.</li>
            <li><strong>Dados Profissionais e Empresariais:</strong> Informações sobre o faturamento, CNPJ e histórico da sua empresa para fins de análise de linhas de crédito (ex: fomento BDMG).</li>
            <li><strong>Comunicações:</strong> Histórico de conversas e documentos enviados através de nossa integração com a API do WhatsApp ou e-mails de atendimento.</li>
          </ul>

          <h2 style={{ fontSize: "1.5rem", color: "var(--primary-color)", marginTop: "1rem" }}>
            2. Finalidade do Tratamento de Dados
          </h2>
          <p>
            Os dados coletados são utilizados exclusivamente para:
          </p>
          <ul style={{ paddingLeft: "1.5rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <li>Realizar o atendimento personalizado e tirar dúvidas sobre produtos de crédito e taxas de mercado.</li>
            <li>Processar solicitações de simulação e análise de crédito junto aos nossos parceiros financeiros oficiais, como o BDMG (Banco de Desenvolvimento de Minas Gerais).</li>
            <li>Enviar atualizações sobre o status de propostas de crédito solicitadas pelo titular.</li>
          </ul>

          <h2 style={{ fontSize: "1.5rem", color: "var(--primary-color)", marginTop: "1rem" }}>
            3. Compartilhamento de Dados
          </h2>
          <p>
            A RMJ Soluções de Crédito não vende, aluga ou cede seus dados pessoais para terceiros para fins de marketing. O compartilhamento ocorre apenas com:
          </p>
          <ul style={{ paddingLeft: "1.5rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <li>Instituições financeiras parceiras (ex: BDMG e Franq), com a finalidade exclusiva de prosseguir com as propostas e simulações expressamente solicitadas pelo titular.</li>
            <li>Autoridades judiciais ou governamentais, quando exigido por lei ou regulamentação governamental.</li>
          </ul>

          <h2 style={{ fontSize: "1.5rem", color: "var(--primary-color)", marginTop: "1rem" }}>
            4. Direitos do Titular (LGPD)
          </h2>
          <p>
            Em conformidade com a Lei Geral de Proteção de Dados (LGPD), você possui os seguintes direitos em relação aos seus dados pessoais:
          </p>
          <ul style={{ paddingLeft: "1.5rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <li>Confirmar a existência do tratamento e acessar seus dados.</li>
            <li>Solicitar a correção de dados incompletos, inexatos ou desatualizados.</li>
            <li>Solicitar a eliminação definitiva de seus dados de nossa base de dados a qualquer momento (salvo se houver obrigação legal de retenção do dado).</li>
          </ul>

          <h2 style={{ fontSize: "1.5rem", color: "var(--primary-color)", marginTop: "1rem" }}>
            5. Segurança das Informações
          </h2>
          <p>
            Implementamos rígidas medidas técnicas de segurança da informação e protocolos de criptografia de dados (especialmente nas trocas pelo WhatsApp) para garantir a integridade dos dados e evitar qualquer forma de acesso não autorizado, perda ou vazamento.
          </p>

          <h2 style={{ fontSize: "1.5rem", color: "var(--primary-color)", marginTop: "1rem" }}>
            6. Contato e Responsável pelos Dados
          </h2>
          <p>
            Para exercer seus direitos, solicitar a exclusão de seus dados ou tirar dúvidas sobre esta política, entre em contato diretamente com o nosso Encarregado de Proteção de Dados (DPO):
          </p>
          <p style={{ backgroundColor: "var(--neutral-light)", padding: "1.25rem", borderRadius: "var(--radius-sm)", border: "1px solid var(--neutral-border)" }}>
            <strong>Responsável:</strong> Rodrigo Meirelles<br />
            <strong>E-mail:</strong> <a href="mailto:contato@rmjcred.com.br">contato@rmjcred.com.br</a><br />
            <strong>Localização:</strong> Itajubá, MG.
          </p>
        </section>
      </div>
    </article>
  );
}
