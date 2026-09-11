# Script de Teste da API Rush-B-Market
# PowerShell

Write-Host "🧪 Testando Rush-B-Market API..." -ForegroundColor Cyan
Write-Host ""

$baseUrl = "http://localhost:8080"

# Teste 1: Health Check
Write-Host "✅ Teste 1: Health Check" -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/actuator/health" -Method Get
    Write-Host "Status: $($response.status)" -ForegroundColor Green
} catch {
    Write-Host "❌ Erro: API não está respondendo" -ForegroundColor Red
    Write-Host "Execute 'mvn spring-boot:run' primeiro!" -ForegroundColor Yellow
    exit 1
}

Write-Host ""

# Teste 2: Criar Player
Write-Host "✅ Teste 2: Criando novo player..." -ForegroundColor Yellow
$playerBody = @{
    email = "teste.api@rushb.com"
    password = "senha123"
} | ConvertTo-Json

try {
    $player = Invoke-RestMethod -Uri "$baseUrl/players" -Method Post -Body $playerBody -ContentType "application/json"
    Write-Host "Player criado com ID: $($player.id)" -ForegroundColor Green
    Write-Host "Email: $($player.email)" -ForegroundColor Green
    $playerId = $player.id
} catch {
    Write-Host "⚠️  Player pode já existir. Tentando com ID 1..." -ForegroundColor Yellow
    $playerId = 1
}

Write-Host ""

# Teste 3: Buscar Player
Write-Host "✅ Teste 3: Buscando player por ID..." -ForegroundColor Yellow
try {
    $player = Invoke-RestMethod -Uri "$baseUrl/players/$playerId" -Method Get
    Write-Host "Player encontrado: $($player.email)" -ForegroundColor Green
    Write-Host "Número de skins: $($player.skins.Count)" -ForegroundColor Green
} catch {
    Write-Host "❌ Erro ao buscar player" -ForegroundColor Red
}

Write-Host ""

# Teste 4: Adicionar Skin ao Player
Write-Host "✅ Teste 4: Adicionando skin ao player..." -ForegroundColor Yellow
$skinBody = @{
    name = "M4A4 | Howl"
    floatValue = "0.07"
    price = 1800.00
    rarity = "Contraband"
    weapon = "M4A4"
} | ConvertTo-Json

try {
    $skin = Invoke-RestMethod -Uri "$baseUrl/skins/player/$playerId" -Method Post -Body $skinBody -ContentType "application/json"
    Write-Host "Skin adicionada com ID: $($skin.id)" -ForegroundColor Green
    Write-Host "Nome: $($skin.name)" -ForegroundColor Green
    Write-Host "Preço: `$$($skin.price)" -ForegroundColor Green
} catch {
    $errorMessage = $_.Exception.Message
    if ($errorMessage -like "*already has*") {
        Write-Host "⚠️  Skin já existe para este player (validação funcionando!)" -ForegroundColor Yellow
    } elseif ($errorMessage -like "*maximum*") {
        Write-Host "⚠️  Player já tem 5 skins (limite atingido - validação funcionando!)" -ForegroundColor Yellow
    } else {
        Write-Host "❌ Erro: $errorMessage" -ForegroundColor Red
    }
}

Write-Host ""

# Teste 5: Listar todas as skins
Write-Host "✅ Teste 5: Listando todas as skins..." -ForegroundColor Yellow
try {
    $skins = Invoke-RestMethod -Uri "$baseUrl/skins" -Method Get
    Write-Host "Total de skins no sistema: $($skins.Count)" -ForegroundColor Green
} catch {
    Write-Host "❌ Erro ao listar skins" -ForegroundColor Red
}

Write-Host ""

# Teste 6: Buscar player com skins
Write-Host "✅ Teste 6: Buscando player com suas skins..." -ForegroundColor Yellow
try {
    $player = Invoke-RestMethod -Uri "$baseUrl/players/$playerId" -Method Get
    Write-Host "Player: $($player.email)" -ForegroundColor Green
    Write-Host "Skins do player:" -ForegroundColor Green
    foreach ($skin in $player.skins) {
        Write-Host "  - $($skin.name) ($($skin.weapon)) - `$$($skin.price)" -ForegroundColor Cyan
    }
} catch {
    Write-Host "❌ Erro ao buscar player" -ForegroundColor Red
}

Write-Host ""

# Teste 7: Validar regras de negócio
Write-Host "✅ Teste 7: Testando regra - Skin duplicada..." -ForegroundColor Yellow
try {
    # Tentar adicionar a mesma skin novamente
    $duplicateSkin = @{
        name = "M4A4 | Howl"
        floatValue = "0.10"
        price = 1900.00
        rarity = "Contraband"
        weapon = "M4A4"
    } | ConvertTo-Json
    
    $result = Invoke-RestMethod -Uri "$baseUrl/skins/player/$playerId" -Method Post -Body $duplicateSkin -ContentType "application/json"
    Write-Host "❌ ERRO: Deveria ter bloqueado skin duplicada!" -ForegroundColor Red
} catch {
    $errorMessage = $_.Exception.Message
    if ($errorMessage -like "*already has*") {
        Write-Host "✅ Regra validada: Skin duplicada bloqueada!" -ForegroundColor Green
    } else {
        Write-Host "⚠️  Outro erro: $errorMessage" -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "🎉 Testes concluídos!" -ForegroundColor Green
Write-Host ""
Write-Host "📖 Acesse a documentação Swagger em:" -ForegroundColor Cyan
Write-Host "   http://localhost:8080/swagger-ui.html" -ForegroundColor White
Write-Host ""
