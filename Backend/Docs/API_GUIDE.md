# 🎮 Guia Visual da API - Rush-B-Market

## 🌐 Endpoints Disponíveis

```
http://localhost:8080/
├── /players
│   ├── POST   /              → Criar novo player
│   ├── GET    /              → Listar todos os players
│   ├── GET    /{id}          → Buscar player por ID (com skins)
│   └── DELETE /{id}          → Deletar player
│
├── /skins
│   ├── POST   /player/{id}   → Adicionar skin ao player
│   ├── GET    /              → Listar todas as skins
│   ├── GET    /{id}          → Buscar skin por ID
│   └── DELETE /{id}          → Deletar skin
│
└── /actuator
    ├── GET    /health        → Status da aplicação
    └── GET    /info          → Informações da aplicação
```

---

## 📋 Exemplos de Requisições

### 1️⃣ Criar Player

**Request:**
```http
POST http://localhost:8080/players
Content-Type: application/json

{
  "email": "player@rushb.com",
  "password": "senha123"
}
```

**Response (201 Created):**
```json
{
  "id": 1,
  "email": "player@rushb.com",
  "createdAt": "2026-09-06T10:30:00"
}
```

---

### 2️⃣ Buscar Player com Skins

**Request:**
```http
GET http://localhost:8080/players/1
```

**Response (200 OK):**
```json
{
  "id": 1,
  "email": "player@rushb.com",
  "createdAt": "2026-09-06T10:30:00",
  "skins": [
    {
      "id": 10,
      "name": "AK-47 | Redline",
      "floatValue": "0.15",
      "price": 45.99,
      "rarity": "Classified",
      "weapon": "AK-47",
      "playerId": 1
    }
  ]
}
```

---

### 3️⃣ Adicionar Skin ao Player

**Request:**
```http
POST http://localhost:8080/skins/player/1
Content-Type: application/json

{
  "name": "AWP | Dragon Lore",
  "floatValue": "0.03",
  "price": 2500.00,
  "rarity": "Covert",
  "weapon": "AWP"
}
```

**Response (201 Created):**
```json
{
  "id": 11,
  "name": "AWP | Dragon Lore",
  "floatValue": "0.03",
  "price": 2500.00,
  "rarity": "Covert",
  "weapon": "AWP",
  "playerId": 1
}
```

---

### 4️⃣ Listar Todas as Skins

**Request:**
```http
GET http://localhost:8080/skins
```

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "name": "AK-47 | Redline",
    "floatValue": "0.15",
    "price": 45.99,
    "rarity": "Classified",
    "weapon": "AK-47",
    "playerId": 1
  },
  {
    "id": 2,
    "name": "USP-S | Kill Confirmed",
    "floatValue": "0.12",
    "price": 180.00,
    "rarity": "Covert",
    "weapon": "USP-S",
    "playerId": null
  }
]
```

---

## 🚨 Exemplos de Erros

### ❌ Violação de Regra 1: Máximo 5 Skins

**Request:**
```http
POST http://localhost:8080/skins/player/1
```
(Player já tem 5 skins)

**Response (400 Bad Request):**
```json
{
  "timestamp": "2026-09-06T10:35:00",
  "status": 400,
  "error": "Max Skins Limit Exceeded",
  "message": "Player already has maximum of 5 skins"
}
```

---

### ❌ Violação de Regra 2: Skin Duplicada

**Request:**
```http
POST http://localhost:8080/skins/player/1
```
(Player já tem "AK-47 | Redline")

**Response (400 Bad Request):**
```json
{
  "timestamp": "2026-09-06T10:36:00",
  "status": 400,
  "error": "Duplicate Skin",
  "message": "Player already has a skin named 'AK-47 | Redline'"
}
```

---

### ❌ Violação de Regra 3: Arma Duplicada

**Request:**
```http
POST http://localhost:8080/skins/player/1
```
(Player já tem skin de AK-47)

**Response (400 Bad Request):**
```json
{
  "timestamp": "2026-09-06T10:37:00",
  "status": 400,
  "error": "Duplicate Weapon",
  "message": "Player already has a skin for weapon 'AK-47'"
}
```

---

### ❌ Player Não Encontrado

**Request:**
```http
GET http://localhost:8080/players/999
```

**Response (404 Not Found):**
```json
{
  "timestamp": "2026-09-06T10:38:00",
  "status": 404,
  "error": "Player Not Found",
  "message": "Player with ID 999 not found"
}
```

---

### ❌ Email Já Existe

**Request:**
```http
POST http://localhost:8080/players
Content-Type: application/json

{
  "email": "bruno@rushb.com",
  "password": "senha123"
}
```
(Email já cadastrado)

**Response (409 Conflict):**
```json
{
  "timestamp": "2026-09-06T10:39:00",
  "status": 409,
  "error": "Email Already Exists",
  "message": "Email 'bruno@rushb.com' already exists"
}
```

---

### ❌ Validação de Campos

**Request:**
```http
POST http://localhost:8080/players
Content-Type: application/json

{
  "email": "email-invalido",
  "password": "123"
}
```

**Response (400 Bad Request):**
```json
{
  "timestamp": "2026-09-06T10:40:00",
  "status": 400,
  "error": "Validation Failed",
  "errors": {
    "email": "Email must be valid",
    "password": "Password must have at least 6 characters"
  }
}
```

---

## 🎯 Fluxo de Uso Típico

```
1. Criar Player
   POST /players
   ↓
2. Verificar Player Criado
   GET /players/{id}
   ↓
3. Adicionar Skins (até 5, armas diferentes)
   POST /skins/player/{id}
   POST /skins/player/{id}
   POST /skins/player/{id}
   ↓
4. Listar Todas as Skins do Player
   GET /players/{id}
   ↓
5. Remover uma Skin
   DELETE /skins/{skinId}
   ↓
6. Adicionar Nova Skin (agora tem espaço)
   POST /skins/player/{id}
```

---

## 📊 Mapa de Status HTTP

| Método | Endpoint | Sucesso | Erros Possíveis |
|--------|----------|---------|----------------|
| POST | /players | 201 Created | 400 (validação), 409 (email existe) |
| GET | /players | 200 OK | - |
| GET | /players/{id} | 200 OK | 404 (não encontrado) |
| DELETE | /players/{id} | 204 No Content | 404 (não encontrado) |
| POST | /skins/player/{id} | 201 Created | 400 (regras violadas), 404 (player não existe) |
| GET | /skins | 200 OK | - |
| GET | /skins/{id} | 200 OK | 404 (não encontrado) |
| DELETE | /skins/{id} | 204 No Content | 404 (não encontrado) |

---

## 🔍 Headers Importantes

### Requisições
```
Content-Type: application/json     # Para POST/PUT com body
Accept: application/json           # Para receber JSON
```

### Respostas
```
Content-Type: application/json     # Sempre JSON
Location: /players/1               # Em POST com sucesso
```

---

## 🧪 Teste Rápido via cURL

```bash
# 1. Health Check
curl http://localhost:8080/actuator/health

# 2. Criar Player
curl -X POST http://localhost:8080/players \
  -H "Content-Type: application/json" \
  -d '{"email":"teste@exemplo.com","password":"senha123"}'

# 3. Buscar Player (substitua {id})
curl http://localhost:8080/players/1

# 4. Adicionar Skin
curl -X POST http://localhost:8080/skins/player/1 \
  -H "Content-Type: application/json" \
  -d '{
    "name": "AK-47 | Redline",
    "floatValue": "0.15",
    "price": 45.99,
    "rarity": "Classified",
    "weapon": "AK-47"
  }'

# 5. Listar Skins
curl http://localhost:8080/skins
```

---

## 📱 Teste via PowerShell

```powershell
# Health Check
Invoke-RestMethod -Uri "http://localhost:8080/actuator/health"

# Criar Player
$player = @{
    email = "teste@exemplo.com"
    password = "senha123"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:8080/players" `
    -Method Post `
    -Body $player `
    -ContentType "application/json"

# Buscar Player
Invoke-RestMethod -Uri "http://localhost:8080/players/1"

# Adicionar Skin
$skin = @{
    name = "AK-47 | Redline"
    floatValue = "0.15"
    price = 45.99
    rarity = "Classified"
    weapon = "AK-47"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:8080/skins/player/1" `
    -Method Post `
    -Body $skin `
    -ContentType "application/json"
```

---

## 🎨 Skins de Exemplo no Banco

Após iniciar a aplicação, estas skins já estarão disponíveis:

### Com Dono (Player 1 - bruno@rushb.com)
1. AK-47 | Redline - $45.99
2. AWP | Dragon Lore - $2500.00
3. M4A4 | Howl - $1800.00

### Com Dono (Player 2 - bruce@rushb.com)
4. Glock-18 | Fade - $350.00
5. Desert Eagle | Blaze - $520.00

### Sem Dono (Disponíveis)
6. USP-S | Kill Confirmed - $180.00
7. Karambit | Doppler - $950.00
8. M4A1-S | Hyper Beast - $65.00
9. AK-47 | Fire Serpent - $850.00
10. AWP | Asiimov - $95.00
... e mais!

---

## 🌟 Dicas

### Swagger UI é seu amigo!
Acesse http://localhost:8080/swagger-ui.html para:
- Ver todos os endpoints
- Testar diretamente no navegador
- Ver exemplos de request/response
- Entender validações

### Use o script de teste
Execute `.\test-api.ps1` para testar tudo automaticamente!

### Importe no Postman
Use `postman_collection.json` para ter todos os endpoints prontos!

---

## 🔗 Links Úteis

- **Swagger UI**: http://localhost:8080/swagger-ui.html
- **Health Check**: http://localhost:8080/actuator/health
- **H2 Console** (se precisar debugar): Não configurado (usando PostgreSQL)

---

**Documentação completa em**: [README.md](README.md)
