# ⚡ Quick Start - Rush-B-Market API

## 🚀 Iniciar em 3 passos

### 1. Subir o banco de dados
```bash
docker compose up -d
```
*Aguarde 10 segundos para o PostgreSQL inicializar*

### 2. Rodar a aplicação
```bash
mvn spring-boot:run
```
*Aguarde até ver: "Started RushBMarketApiApplication"*

### 3. Testar!
```bash
# Acesse o Swagger
start http://localhost:8080/swagger-ui.html
```

## 📝 Exemplos de Uso

### Criar um Player
```bash
curl -X POST http://localhost:8080/players \
  -H "Content-Type: application/json" \
  -d '{"email":"teste@rushb.com","password":"senha123"}'
```

### Adicionar Skin ao Player
```bash
curl -X POST http://localhost:8080/skins/player/1 \
  -H "Content-Type: application/json" \
  -d '{
    "name": "AK-47 | Redline",
    "floatValue": "0.15",
    "price": 45.99,
    "rarity": "Classified",
    "weapon": "AK-47"
  }'
```

### Buscar Player com Skins
```bash
curl http://localhost:8080/players/1
```

### Listar todas as Skins
```bash
curl http://localhost:8080/skins
```

## 🎯 Testando as Regras de Negócio

**Regra 1: Máximo 5 skins**
- Tente adicionar 6 skins ao mesmo player
- Deve retornar erro: "Player already has maximum of 5 skins"

**Regra 2: Sem skins duplicadas**
- Tente adicionar uma skin com o mesmo nome
- Deve retornar erro: "Player already has a skin named '...'"

**Regra 3: Uma skin por arma**
- Tente adicionar duas skins da mesma arma (ex: 2 AK-47)
- Deve retornar erro: "Player already has a skin for weapon '...'"

## 🛠️ Ferramentas

- **Swagger UI**: http://localhost:8080/swagger-ui.html
- **Health Check**: http://localhost:8080/actuator/health
- **Collection Postman**: Importe `postman_collection.json`

## 🐛 Problemas?

Ver [SETUP.md](SETUP.md) para guia completo de troubleshooting.

## 🧹 Parar tudo
```bash
# Parar aplicação: Ctrl + C
# Parar banco:
docker compose down
```
