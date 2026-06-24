# Deploy CRM RMJ - Versao Final com Tratamento de Erros

Write-Host "===== INICIANDO DEPLOY CRM RMJ =====" -ForegroundColor Cyan
Write-Host ""

# ===== PASSO 1: Git =====
Write-Host "PASSO 1: Configurar Git" -ForegroundColor Cyan
Write-Host "---" -ForegroundColor Gray

try {
    Write-Host "Configurando usuario Git..." -ForegroundColor Yellow
    git config user.email "rodrigomeirelles@gmail.com"
    git config user.name "Rodrigo Meirelles"

    Write-Host "Inicializando repositorio Git..." -ForegroundColor Yellow
    git init

    Write-Host "Adicionando arquivos..." -ForegroundColor Yellow
    git add .

    Write-Host "Fazendo primeiro commit..." -ForegroundColor Yellow
    git commit -m "feat: CRM RMJ MVP inicial"

    Write-Host "Git inicializado com sucesso!" -ForegroundColor Green
} catch {
    Write-Host "ERRO ao configurar Git: $_" -ForegroundColor Red
}

Write-Host ""
Write-Host "PAUSA - Pressione tecla para continuar..." -ForegroundColor Cyan
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

# ===== PASSO 2: GitHub (OPCIONAL) =====
Write-Host ""
Write-Host "PASSO 2: GitHub (OPCIONAL)" -ForegroundColor Cyan
Write-Host "---" -ForegroundColor Gray

$ghInstalled = $false
try {
    gh --version | Out-Null
    $ghInstalled = $true
} catch {
    $ghInstalled = $false
}

if ($ghInstalled) {
    Write-Host "GitHub CLI encontrado. Criando repositorio..." -ForegroundColor Yellow
    try {
        gh repo create crm-rmj --private --source=. --push
        Write-Host "Repositorio GitHub criado com sucesso!" -ForegroundColor Green
    } catch {
        Write-Host "ERRO ao criar repositorio: $_" -ForegroundColor Red
    }
} else {
    Write-Host "GitHub CLI nao esta instalado. Pulando este passo." -ForegroundColor Yellow
    Write-Host "Voce pode fazer isso manualmente depois com: gh repo create crm-rmj --private --source=. --push" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "PAUSA - Pressione tecla para continuar..." -ForegroundColor Cyan
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

# ===== PASSO 3: Netlify =====
Write-Host ""
Write-Host "PASSO 3: Inicializar Netlify" -ForegroundColor Cyan
Write-Host "---" -ForegroundColor Gray
Write-Host "Siga as instrucoes na tela:" -ForegroundColor Yellow
Write-Host "- 'What would you like to do?' -> selecione 'Create & configure a new site'" -ForegroundColor Yellow
Write-Host "- Digite o nome do site: crm-rmj (ou crm-rmj-mvp)" -ForegroundColor Yellow
Write-Host ""

try {
    npx netlify-cli init
    Write-Host "Netlify inicializado com sucesso!" -ForegroundColor Green
} catch {
    Write-Host "ERRO ao inicializar Netlify: $_" -ForegroundColor Red
}

Write-Host ""
Write-Host "PAUSA - Pressione tecla para continuar..." -ForegroundColor Cyan
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

# ===== PASSO 4: Variaveis de Ambiente =====
Write-Host ""
Write-Host "PASSO 4: Configurar variaveis de ambiente" -ForegroundColor Cyan
Write-Host "---" -ForegroundColor Gray

try {
    Write-Host "Configurando GOOGLE_SHEETS_ID..." -ForegroundColor Yellow
    npx netlify-cli env:set GOOGLE_SHEETS_ID "1D8kQJSUp5UwlUsc-9-P9Nj-rft0BADbGeBg0aHPjT-8"

    Write-Host "Configurando GOOGLE_SERVICE_ACCOUNT_EMAIL..." -ForegroundColor Yellow
    npx netlify-cli env:set GOOGLE_SERVICE_ACCOUNT_EMAIL "rmj-admin-sheets@spartan-metric-499115-a3.iam.gserviceaccount.com"

    Write-Host "Configurando ADMIN_PASSWORD..." -ForegroundColor Yellow
    npx netlify-cli env:set ADMIN_PASSWORD "rmjadmin2024"

    Write-Host "Configurando GOOGLE_PRIVATE_KEY..." -ForegroundColor Yellow
    npx netlify-cli env:set GOOGLE_PRIVATE_KEY "-----BEGIN PRIVATE KEY-----`nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQDh/l9ol3zKmnCo`n2L4anGc5jJ+959mYKZfSzkSwfAe5re9KVGA5vRQ3NdCV+prmVVCYE60Bk9zysmVA`nDUmXMVF6OcLcfDUoUAJFCeXqPgZ2/HFlF+uQx0BFYznB8OJnb0x5P8VteJJgISHZ`nxI6Ls9Wy3kXcxD1PEkpdnSS8bTBSmQkrQSVtVDz50eDkiy4mLiKcuq5Ox4hoQHs3`nRSqxgaftyVnTr7clZoi0e7TmgtImuJbV9CrruKc4bCafjrjZ5G73i9INpFZZzN+6`nbOcI8ZbwShsPPQXQoN12kYUG9tmfFR+AyLw26EG+wL+C21At6oqtairjjYGJR4cq`nZVHM/2/dAgMBAAECggEAAmJi7SFOJXwDtUW/qojbBOPM9PJolwlc1VJGrgPCZTlR`n4yL1/juaQKzd8KiOW8KkBeRf9P43OsILm3wCwddmRrIc5u5wbblsfh5FWewPEznF`nIzV4BAt2l2TSDMwJusKkStIivrj1jXOO3EDCT+VPcfc59/9HkE/qWqXYK4ZJ28ly`n4XSWYOW9DJBthhgX1+OGwBfutCM8E7jPA0VEzCnpwu9kxAvBS5dIfXh1B6pCK8qr`nG2pU7yEo/ifIjRwtn9XZwVAM/zCK/BjXiKaeVXdBky+XBCHI/kT8dk8G/bXicnrm`nF2HRzFDt4VqZJLnPc/9upGBqpxaLUP4vsyeZ/SGCNwKBgQD/y4iqqK3jX43vQvTU`norHl3aceYrCysTZn/TrY8AP4OLanJDz6davTCeJQf/FNRJWvZRofXAQMQFq+aMSh`nn0BzuPLpbs8fKnBsC5T5ENvqzIRwMe9E2IsBB26hqTityO1MsBVaMd7MPTpIqAX7`nh/1dTYE56xilOmsZy+P8MunA0wKBgQDiLLnsi/Wn58vB1Ey6PYlDlYquRFacbkkl`nohrCTS3UPj6Sym92s9ljSrRX6KUdi7NvAVVyFsPcF0MS1i4v1Y1c+3AOgMCdDvP2`nd8jU4ZjoZs/W8GPpN9FsGSsCdGJvQnm35sNYbifdqB1RFwwaiXBHJ8knsDKL61dl`nTfNZJFwejwKBgGDUwqqf6hudq5Q8S4RHBoMW0lGtWGh8rzTUZreCvG31wicpj6/c`nZawhHLwOguEWKnfYFPh0E9AzeGaGMJFiQLrN856sZNnObfpos/9JA4cx3py+Om5c`nbtp33shxz9PxsOsL6TlYkZfNQcgJWyJpy17LnTS4q364y5xbU7W/7D8jAoGAFyyU`nBEu26PRUKVESZ4bEmLsq0X5JDZAzSHramQwFZRjXmnzJfPUikgzme5dny6YzxWzy`nj1ULznJHuhdd9iLAcEWHDsVcdvtAPgG5/y36V92o8BIDerLwb04I3SCFsXazOAeZ`n/maTCSAfmN5urA1nBrNp5fokw7diZgvdokWadrsCgYBF38JDbrxw6UHjVBs8OaXX`nL01QZRxybURrZZDJPtHUYOs4HnslLI+hCNQ1bWqgZ7t0zw0YRztCXPCMCiJA7TEi`nXOgtopsJh1D0vmuRJWLZdtOHZHIllHHsGhRob+EepnmqxagIHfdl/Qkwmn1m2bjy`nqKt2N2zsTBnBOL3QejfA3A==`n-----END PRIVATE KEY-----"

    Write-Host "Todas as variaveis configuradas com sucesso!" -ForegroundColor Green
} catch {
    Write-Host "ERRO ao configurar variaveis: $_" -ForegroundColor Red
}

Write-Host ""
Write-Host "PAUSA - Pressione tecla para continuar..." -ForegroundColor Cyan
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

# ===== PASSO 5: Deploy =====
Write-Host ""
Write-Host "PASSO 5: Fazer deploy na Netlify" -ForegroundColor Cyan
Write-Host "---" -ForegroundColor Gray
Write-Host "Iniciando deploy..." -ForegroundColor Yellow
Write-Host "Isso pode levar 5-15 minutos (build do Next.js)..." -ForegroundColor Yellow
Write-Host ""

try {
    npx netlify-cli deploy --build --prod
    Write-Host ""
    Write-Host "Deploy realizado com sucesso!" -ForegroundColor Green
} catch {
    Write-Host "ERRO durante o deploy: $_" -ForegroundColor Red
}

# ===== RESUMO FINAL =====
Write-Host ""
Write-Host "===== DEPLOY CONCLUIDO =====" -ForegroundColor Green
Write-Host ""
Write-Host "Proximos passos:" -ForegroundColor Yellow
Write-Host "1. Verifique as rotas do site (URL sera mostrada acima)" -ForegroundColor Yellow
Write-Host "   - /cadastro/bdmg (formulario)" -ForegroundColor Yellow
Write-Host "   - /admin/propostas (painel Kanban)" -ForegroundColor Yellow
Write-Host "   - /api/propostas (API)" -ForegroundColor Yellow
Write-Host ""
Write-Host "2. GitHub (se nao fez ainda):" -ForegroundColor Yellow
Write-Host "   Instale GitHub CLI: https://cli.github.com/" -ForegroundColor Yellow
Write-Host "   Depois execute: gh repo create crm-rmj --private --source=. --push" -ForegroundColor Yellow
Write-Host ""
Write-Host "3. Confirme aba 'Propostas' na planilha Google Sheets:" -ForegroundColor Yellow
Write-Host "   https://docs.google.com/spreadsheets/d/1D8kQJSUp5UwlUsc-9-P9Nj-rft0BADbGeBg0aHPjT-8" -ForegroundColor Yellow
Write-Host ""
Write-Host "Pressione qualquer tecla para fechar..." -ForegroundColor Cyan
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
