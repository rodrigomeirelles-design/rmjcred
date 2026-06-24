# Deploy CRM RMJ - Versao Simples com DEBUG

Write-Host "===== INICIANDO DEPLOY CRM RMJ =====" -ForegroundColor Cyan
Write-Host "Pasta atual: $(Get-Location)" -ForegroundColor Yellow
Write-Host ""

# PASSO 1: Git
Write-Host "PASSO 1: Configurar e iniciar Git" -ForegroundColor Cyan
Write-Host "---" -ForegroundColor Gray

try {
    Write-Host "Verificando se Git esta instalado..." -ForegroundColor Yellow
    git --version

    Write-Host "Configurando usuario Git..." -ForegroundColor Yellow
    git config --global user.email "rodrigomeirelles@gmail.com"
    git config --global user.name "Rodrigo Meirelles"

    Write-Host "Inicializando repositorio..." -ForegroundColor Yellow
    git init

    if ($LASTEXITCODE -eq 0) {
        Write-Host "Git inicializado com sucesso!" -ForegroundColor Green
    } else {
        Write-Host "ERRO: Falha ao inicializar Git (erro: $LASTEXITCODE)" -ForegroundColor Red
    }

    Write-Host "Adicionando arquivos..." -ForegroundColor Yellow
    git add .

    Write-Host "Fazendo primeiro commit..." -ForegroundColor Yellow
    git commit -m "feat: CRM RMJ MVP inicial"

    if ($LASTEXITCODE -eq 0) {
        Write-Host "Commit realizado com sucesso!" -ForegroundColor Green
    } else {
        Write-Host "ERRO: Falha no commit (erro: $LASTEXITCODE)" -ForegroundColor Red
    }

    Write-Host ""
    Write-Host "Status do Git:" -ForegroundColor Yellow
    git status

} catch {
    Write-Host "EXCEPCAO: $_" -ForegroundColor Red
}

Write-Host ""
Write-Host "PAUSA - Pressione tecla para continuar..." -ForegroundColor Cyan
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

# PASSO 2: GitHub
Write-Host ""
Write-Host "PASSO 2: Criar repositorio no GitHub" -ForegroundColor Cyan
Write-Host "---" -ForegroundColor Gray

try {
    Write-Host "Verificando se GitHub CLI esta instalado..." -ForegroundColor Yellow
    gh --version

    Write-Host "Criando repositorio..." -ForegroundColor Yellow
    gh repo create crm-rmj --private --source=. --push

    if ($LASTEXITCODE -eq 0) {
        Write-Host "Repositorio GitHub criado com sucesso!" -ForegroundColor Green
    } else {
        Write-Host "ERRO: Falha ao criar repositorio (erro: $LASTEXITCODE)" -ForegroundColor Red
    }

} catch {
    Write-Host "EXCEPCAO: $_" -ForegroundColor Red
}

Write-Host ""
Write-Host "PAUSA - Pressione tecla para continuar..." -ForegroundColor Cyan
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

# PASSO 3: Netlify Init
Write-Host ""
Write-Host "PASSO 3: Inicializar Netlify" -ForegroundColor Cyan
Write-Host "---" -ForegroundColor Gray

try {
    Write-Host "Executando netlify init..." -ForegroundColor Yellow
    Write-Host "Siga as instrucoes na tela." -ForegroundColor Yellow

    npx netlify-cli init

    if ($LASTEXITCODE -eq 0) {
        Write-Host "Netlify inicializado com sucesso!" -ForegroundColor Green
    } else {
        Write-Host "ERRO: Falha ao inicializar Netlify (erro: $LASTEXITCODE)" -ForegroundColor Red
    }

} catch {
    Write-Host "EXCEPCAO: $_" -ForegroundColor Red
}

Write-Host ""
Write-Host "PAUSA - Pressione tecla para continuar..." -ForegroundColor Cyan
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

# PASSO 4: Variaveis de Ambiente
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

    Write-Host "GOOGLE_PRIVATE_KEY - Configurando..." -ForegroundColor Yellow
    $privateKey = "-----BEGIN PRIVATE KEY-----`nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQDh/l9ol3zKmnCo`n2L4anGc5jJ+959mYKZfSzkSwfAe5re9KVGA5vRQ3NdCV+prmVVCYE60Bk9zysmVA`nDUmXMVF6OcLcfDUoUAJFCeXqPgZ2/HFlF+uQx0BFYznB8OJnb0x5P8VteJJgISHZ`nxI6Ls9Wy3kXcxD1PEkpdnSS8bTBSmQkrQSVtVDz50eDkiy4mLiKcuq5Ox4hoQHs3`nRSqxgaftyVnTr7clZoi0e7TmgtImuJbV9CrruKc4bCafjrjZ5G73i9INpFZZzN+6`nbOcI8ZbwShsPPQXQoN12kYUG9tmfFR+AyLw26EG+wL+C21At6oqtairjjYGJR4cq`nZVHM/2/dAgMBAAECggEAAmJi7SFOJXwDtUW/qojbBOPM9PJolwlc1VJGrgPCZTlR`n4yL1/juaQKzd8KiOW8KkBeRf9P43OsILm3wCwddmRrIc5u5wbblsfh5FWewPEznF`nIzV4BAt2l2TSDMwJusKkStIivrj1jXOO3EDCT+VPcfc59/9HkE/qWqXYK4ZJ28ly`n4XSWYOW9DJBthhgX1+OGwBfutCM8E7jPA0VEzCnpwu9kxAvBS5dIfXh1B6pCK8qr`nG2pU7yEo/ifIjRwtn9XZwVAM/zCK/BjXiKaeVXdBky+XBCHI/kT8dk8G/bXicnrm`nF2HRzFDt4VqZJLnPc/9upGBqpxaLUP4vsyeZ/SGCNwKBgQD/y4iqqK3jX43vQvTU`norHl3aceYrCysTZn/TrY8AP4OLanJDz6davTCeJQf/FNRJWvZRofXAQMQFq+aMSh`nn0BzuPLpbs8fKnBsC5T5ENvqzIRwMe9E2IsBB26hqTityO1MsBVaMd7MPTpIqAX7`nh/1dTYE56xilOmsZy+P8MunA0wKBgQDiLLnsi/Wn58vB1Ey6PYlDlYquRFacbkkl`nohrCTS3UPj6Sym92s9ljSrRX6KUdi7NvAVVyFsPcF0MS1i4v1Y1c+3AOgMCdDvP2`nd8jU4ZjoZs/W8GPpN9FsGSsCdGJvQnm35sNYbifdqB1RFwwaiXBHJ8knsDKL61dl`nTfNZJFwejwKBgGDUwqqf6hudq5Q8S4RHBoMW0lGtWGh8rzTUZreCvG31wicpj6/c`nZawhHLwOguEWKnfYFPh0E9AzeGaGMJFiQLrN856sZNnObfpos/9JA4cx3py+Om5c`nbtp33shxz9PxsOsL6TlYkZfNQcgJWyJpy17LnTS4q364y5xbU7W/7D8jAoGAFyyU`nBEu26PRUKVESZ4bEmLsq0X5JDZAzSHramQwFZRjXmnzJfPUikgzme5dny6YzxWzy`nj1ULznJHuhdd9iLAcEWHDsVcdvtAPgG5/y36V92o8BIDerLwb04I3SCFsXazOAeZ`n/maTCSAfmN5urA1nBrNp5fokw7diZgvdokWadrsCgYBF38JDbrxw6UHjVBs8OaXX`nL01QZRxybURrZZDJPtHUYOs4HnslLI+hCNQ1bWqgZ7t0zw0YRztCXPCMCiJA7TEi`nXOgtopsJh1D0vmuRJWLZdtOHZHIllHHsGhRob+EepnmqxagIHfdl/Qkwmn1m2bjy`nqKt2N2zsTBnBOL3QejfA3A==`n-----END PRIVATE KEY-----"
    npx netlify-cli env:set GOOGLE_PRIVATE_KEY $privateKey

    Write-Host "Variaveis de ambiente configuradas!" -ForegroundColor Green

} catch {
    Write-Host "EXCEPCAO: $_" -ForegroundColor Red
}

Write-Host ""
Write-Host "PAUSA - Pressione tecla para continuar..." -ForegroundColor Cyan
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

# PASSO 5: Deploy
Write-Host ""
Write-Host "PASSO 5: Fazer deploy na Netlify" -ForegroundColor Cyan
Write-Host "---" -ForegroundColor Gray

try {
    Write-Host "Iniciando deploy..." -ForegroundColor Yellow
    Write-Host "Isso pode levar alguns minutos..." -ForegroundColor Yellow

    npx netlify-cli deploy --build --prod

    if ($LASTEXITCODE -eq 0) {
        Write-Host "Deploy realizado com sucesso!" -ForegroundColor Green
    } else {
        Write-Host "ERRO: Falha no deploy (erro: $LASTEXITCODE)" -ForegroundColor Red
    }

} catch {
    Write-Host "EXCEPCAO: $_" -ForegroundColor Red
}

Write-Host ""
Write-Host "===== DEPLOY CONCLUIDO =====" -ForegroundColor Green
Write-Host "Pressione tecla para fechar..." -ForegroundColor Cyan
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
