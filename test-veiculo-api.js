const payload = {
  nome: "Teste Silva",
  cpf: "059.162.175-25",
  email: "teste@teste.com",
  celular: "(35) 99999-9999",
  produto: "Financiamento de Veículo",
  aceite_lgpd: true,
  veiculo_tipo: "usado",
  valor_financiamento: 50000
};

fetch("https://crm-rmj-mvp-rodrigo.netlify.app/api/propostas-veiculo", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(payload)
})
  .then(r => r.json())
  .then(data => console.log("Resposta:", JSON.stringify(data, null, 2)))
  .catch(err => console.error("Erro:", err));
