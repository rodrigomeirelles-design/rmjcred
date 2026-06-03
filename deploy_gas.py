#!/usr/bin/env python3
"""
Script para fazer deploy do Google Apps Script via API
Requer que você tenha feito login com gcloud
"""
import subprocess
import json
import sys

# ID do projeto GAS
PROJECT_ID = "1hZQFhkrZfkqM0caogfhSzY88IehWcjr7042MsAMGCSCyu4jZQH0dCwKF"

# Tentar obter o access token do gcloud
try:
    result = subprocess.run(
        ["gcloud", "auth", "application-default", "print-access-token"],
        capture_output=True,
        text=True,
        check=True
    )
    access_token = result.stdout.strip()
    print(f"✓ Access token obtido")
except Exception as e:
    print(f"✗ Erro ao obter access token: {e}")
    print("\nAlternativa: Use o navegador para fazer deploy manualmente")
    print(f"URL do projeto: https://script.google.com/home/projects/{PROJECT_ID}/edit")
    sys.exit(1)

# URL da API do Google Apps Script
api_url = f"https://script.googleapis.com/v1/projects/{PROJECT_ID}/deployments"

print(f"\nID do Projeto: {PROJECT_ID}")
print(f"URL do Projeto: https://script.google.com/home/projects/{PROJECT_ID}/edit")
print(f"\nPara completar o deploy manualmente:")
print("1. Abra o link acima no navegador")
print("2. Clique em 'Implantar' > 'Nova implantação'")
print("3. Selecione 'App da Web'")
print("4. Configure 'Quem pode acessar' como 'Qualquer pessoa'")
print("5. Clique em 'Implantar'")
