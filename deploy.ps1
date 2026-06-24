# Deploy CRM RMJ para Netlify
# Este script executa todos os passos necessarios para o deploy

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "PASSO 1: Criar repositorio Git local" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

# Configurar Git com usuario padrao
Write-Host "Configurando Git..." -ForegroundColor Yellow
git config user.email "rodrigomeirelles@gmail.com"
git config user.name "Rodrigo Meirelles"

git init
git add .
git commit -m "feat: CRM RMJ MVP inicial - formulario BDMG + admin Kanban"

if ($LASTEXITCODE -eq 0) {
    Write-Host "Repositorio Git criado com sucesso!" -ForegroundColor Green
} else {
    Write-Host "Erro ao criar repositorio Git" -ForegroundColor Red
    exit 1
}

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "PASSO 2: Criar repositorio privado no GitHub" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

gh repo create crm-rmj --private --source=. --push

if ($LASTEXITCODE -eq 0) {
    Write-Host "Repositorio GitHub criado e enviado com sucesso!" -ForegroundColor Green
} else {
    Write-Host "Erro ao criar repositorio GitHub" -ForegroundColor Red
    exit 1
}

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "PASSO 3: Criar site no Netlify com CLI" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

Write-Host "Iniciando setup do Netlify..." -ForegroundColor Yellow
Write-Host "Quando perguntado:" -ForegroundColor Yellow
Write-Host "- What would you like to do? -> selecione Create & configure a new site" -ForegroundColor Yellow
Write-Host "- Team -> selecione sua equipe" -ForegroundColor Yellow
Write-Host "- Site name -> digite crm-rmj (ou crm-rmj-mvp se o nome ja existir)" -ForegroundColor Yellow

npx netlify-cli init

if ($LASTEXITCODE -ne 0) {
    Write-Host "Erro ao inicializar Netlify" -ForegroundColor Red
    exit 1
}

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "PASSO 4: Configurar variaveis de ambiente no Netlify" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

Write-Host "Configurando GOOGLE_SHEETS_ID..." -ForegroundColor Yellow
npx netlify-cli env:set GOOGLE_SHEETS_ID "1D8kQJSUp5UwlUsc-9-P9Nj-rft0BADbGeBg0aHPjT-8"

Write-Host "Configurando GOOGLE_SERVICE_ACCOUNT_EMAIL..." -ForegroundColor Yellow
npx netlify-cli env:set GOOGLE_SERVICE_ACCOUNT_EMAIL "rmj-admin-sheets@spartan-metric-499115-a3.iam.gserviceaccount.com"

Write-Host "Configurando GOOGLE_PRIVATE_KEY..." -ForegroundColor Yellow
$privateKey = @"
-----BEGIN PRIVATE KEY-----
MIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQDh/l9ol3zKmnCo
2L4anGc5jJ+959mYKZfSzkSwfAe5re9KVGA5vRQ3NdCV+prmVVCYE60Bk9zysmVA
DUmXMVF6OcLcfDUoUAJFCeXqPgZ2/HFlF+uQx0BFYznB8OJnb0x5P8VteJJgISHZ
xI6Ls9Wy3kXcxD1PEkpdnSS8bTBSmQkrQSVtVDz50eDkiy4mLiKcuq5Ox4hoQHs3
RSqxgaftyVnTr7clZoi0e7TmgtImuJbV9CrruKc4bCafjrjZ5G73i9INpFZZzN+6
bOcI8ZbwShsPPQXQoN12kYUG9tmfFR+AyLw26EG+wL+C21At6oqtairjjYGJR4cq
ZVHM/2/dAgMBAAECggEAAmJi7SFOJXwDtUW/qojbBOPM9PJolwlc1VJGrgPCZTlR
4yL1/juaQKzd8KiOW8KkBeRf9P43OsILm3wCwddmRrIc5u5wbblsfh5FWewPEznF
IzV4BAt2l2TSDMwJusKkStIivrj1jXOO3EDCT+VPcfc59/9HkE/qWqXYK4ZJ28ly
4XSWYOW9DJBthhgX1+OGwBfutCM8E7jPA0VEzCnpwu9kxAvBS5dIfXh1B6pCK8qr
G2pU7yEo/ifIjRwtn9XZwVAM/zCK/BjXiKaeVXdBky+XBCHI/kT8dk8G/bXicnrm
F2HRzFDt4VqZJLnPc/9upGBqpxaLUP4vsyeZ/SGCNwKBgQD/y4iqqK3jX43vQvTU
orHl3aceYrCysTZn/TrY8AP4OLanJDz6davTCeJQf/FNRJWvZRofXAQMQFq+aMSh
n0BzuPLpbs8fKnBsC5T5ENvqzIRwMe9E2IsBB26hqTityO1MsBVaMd7MPTpIqAX7
h/1dTYE56xilOmsZy+P8MunA0wKBgQDiLLnsi/Wn58vB1Ey6PYlDlYquRFacbkkl
ohrCTS3UPj6Sym92s9ljSrRX6KUdi7NvAVVyFsPcF0MS1i4v1Y1c+3AOgMCdDvP2
d8jU4ZjoZs/W8GPpN9FsGSsCdGJvQnm35sNYbifdqB1RFwwaiXBHJ8knsDKL61dl
TfNZJFwejwKBgGDUwqqf6hudq5Q8S4RHBoMW0lGtWGh8rzTUZreCvG31wicpj6/c
ZawhHLwOguEWKnfYFPh0E9AzeGaGMJFiQLrN856sZNnObfpos/9JA4cx3py+Om5c
btp33shxz9PxsOsL6TlYkZfNQcgJWyJpy17LnTS4q364y5xbU7W/7D8jAoGAFyyU
BEu26PRUKVESZ4bEmLsq0X5JDZAzSHramQwFZRjXmnzJfPUikgzme5dny6YzxWzy
j1ULznJHuhdd9iLAcEWHDsVcdvtAPgG5/y36V92o8BIDerLwb04I3SCFsXazOAeZ
/maTCSAfmN5urA1nBrNp5fokw7diZgvdokWadrsCgYBF38JDbrxw6UHjVBs8OaXX
L01QZRxybURrZZDJPtHUYOs4HnslLI+hCNQ1bWqgZ7t0zw0YRztCXPCMCiJA7TEi
XOgtopsJh1D0vmuRJWLZdtOHZHIllHHsGhRob+EepnmqxagIHfdl/Qkwmn1m2bjy
qKt2N2zsTBnBOL3QejfA3A==
-----END PRIVATE KEY-----
"@
npx netlify-cli env:set GOOGLE_PRIVATE_KEY $privateKey

Write-Host "Configurando ADMIN_PASSWORD..." -ForegroundColor Yellow
npx netlify-cli env:set ADMIN_PASSWORD "rmjadmin2024"

Write-Host "Variaveis de ambiente configuradas!" -ForegroundColor Green

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "PASSO 5: Fazer o deploy na Netlify" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

Write-Host "Iniciando deploy..." -ForegroundColor Yellow
npx netlify-cli deploy --build --prod

if ($LASTEXITCODE -eq 0) {
    Write-Host "Deploy realizado com sucesso!" -ForegroundColor Green
} else {
    Write-Host "Erro durante o deploy" -ForegroundColor Red
    exit 1
}

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "DEPLOY CONCLUIDO COM SUCESSO!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Proximos passos:" -ForegroundColor Yellow
Write-Host "1. Verifique as rotas apos o deploy:" -ForegroundColor Yellow
Write-Host "   - /cadastro/bdmg (formulario)" -ForegroundColor Yellow
Write-Host "   - /admin/propostas (painel Kanban)" -ForegroundColor Yellow
Write-Host "   - /api/propostas (API)" -ForegroundColor Yellow
Write-Host "2. Confirme a aba Propostas na planilha Google Sheets" -ForegroundColor Yellow

Write-Host "`nPressione qualquer tecla para fechar..." -ForegroundColor Cyan
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
