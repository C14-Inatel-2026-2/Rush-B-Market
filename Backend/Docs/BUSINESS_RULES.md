# 📋 Regras de Negócio - Rush-B-Market API

## ⚖️ Visão Geral

O sistema implementa 3 regras principais para controle de skins dos players:

1. **Máximo de 5 skins por player**
2. **Sem skins duplicadas** (mesmo nome)
3. **Uma skin por arma**

---

## 📝 Regra 1: Máximo de 5 Skins por Player

### Descrição
Um player não pode ter mais de 5 skins em seu inventário.

### Implementação
- Localização: `SkinService.addSkinToPlayer()`
- Exceção: `MaxSkinsLimitExceededException`
- HTTP Status: `400 Bad Request`

### Exemplo de Teste

**Cenário**: Tentar adicionar a 6ª skin

```bash
# Adicionar 5 skins ao player ID 1
curl -X POST http://localhost:8080/skins/player/1 \
  -H "Content-Type: application/json" \
  -d '{"name":"AK-47 | Redline","floatValue":"0.15","price":45.99,"rarity":"Classified","weapon":"AK-47"}'

curl -X POST http://localhost:8080/skins/player/1 \
  -H "Content-Type: application/json" \
  -d '{"name":"AWP | Dragon Lore","floatValue":"0.03","price":2500.00,"rarity":"Covert","weapon":"AWP"}'

curl -X POST http://localhost:8080/skins/player/1 \
  -H "Content-Type: application/json" \
  -d '{"name":"M4A4 | Howl","floatValue":"0.07","price":1800.00,"rarity":"Contraband","weapon":"M4A4"}'

curl -X POST http://localhost:8080/skins/player/1 \
  -H "Content-Type: application/json" \
  -d '{"name":"Desert Eagle | Blaze","floatValue":"0.008","price":520.00,"rarity":"Restricted","weapon":"Desert Eagle"}'

curl -X POST http://localhost:8080/skins/player/1 \
  -H "Content-Type: application/json" \
  -d '{"name":"Glock-18 | Fade","floatValue":"0.01","price":350.00,"rarity":"Restricted","weapon":"Glock-18"}'

# Tentar adicionar a 6ª skin - DEVE FALHAR
curl -X POST http://localhost:8080/skins/player/1 \
  -H "Content-Type: application/json" \
  -d '{"name":"USP-S | Kill Confirmed","floatValue":"0.12","price":180.00,"rarity":"Covert","weapon":"USP-S"}'
```

**Resposta Esperada**:
```json
{
  "timestamp": "2026-09-06T...",
  "status": 400,
  "error": "Max Skins Limit Exceeded",
  "message": "Player already has maximum of 5 skins"
}
```

---

## 📝 Regra 2: Sem Skins Duplicadas

### Descrição
Um player não pode ter duas skins com o mesmo nome, mesmo que tenham float ou preço diferentes.

### Implementação
- Localização: `SkinService.addSkinToPlayer()`
- Validação: Case-insensitive (ignora maiúsculas/minúsculas)
- Exceção: `DuplicateSkinException`
- HTTP Status: `400 Bad Request`

### Exemplo de Teste

**Cenário**: Tentar adicionar a mesma skin duas vezes

```bash
# Adicionar uma skin
curl -X POST http://localhost:8080/skins/player/1 \
  -H "Content-Type: application/json" \
  -d '{"name":"AK-47 | Redline","floatValue":"0.15","price":45.99,"rarity":"Classified","weapon":"AK-47"}'

# Tentar adicionar novamente (mesmo nome, float diferente) - DEVE FALHAR
curl -X POST http://localhost:8080/skins/player/1 \
  -H "Content-Type: application/json" \
  -d '{"name":"AK-47 | Redline","floatValue":"0.25","price":40.00,"rarity":"Classified","weapon":"AK-47"}'

# Tentar com maiúsculas/minúsculas diferentes - TAMBÉM DEVE FALHAR
curl -X POST http://localhost:8080/skins/player/1 \
  -H "Content-Type: application/json" \
  -d '{"name":"ak-47 | redline","floatValue":"0.10","price":50.00,"rarity":"Classified","weapon":"AK-47"}'
```

**Resposta Esperada**:
```json
{
  "timestamp": "2026-09-06T...",
  "status": 400,
  "error": "Duplicate Skin",
  "message": "Player already has a skin named 'AK-47 | Redline'"
}
```

---

## 📝 Regra 3: Uma Skin por Arma

### Descrição
Um player não pode ter mais de uma skin para a mesma arma.

### Implementação
- Localização: `SkinService.addSkinToPlayer()`
- Validação: Case-insensitive no nome da arma
- Exceção: `DuplicateWeaponException`
- HTTP Status: `400 Bad Request`

### Exemplo de Teste

**Cenário**: Tentar adicionar duas skins de AK-47

```bash
# Adicionar primeira skin de AK-47
curl -X POST http://localhost:8080/skins/player/1 \
  -H "Content-Type: application/json" \
  -d '{"name":"AK-47 | Redline","floatValue":"0.15","price":45.99,"rarity":"Classified","weapon":"AK-47"}'

# Tentar adicionar segunda skin de AK-47 (nome diferente) - DEVE FALHAR
curl -X POST http://localhost:8080/skins/player/1 \
  -H "Content-Type: application/json" \
  -d '{"name":"AK-47 | Fire Serpent","floatValue":"0.10","price":850.00,"rarity":"Covert","weapon":"AK-47"}'
```

**Resposta Esperada**:
```json
{
  "timestamp": "2026-09-06T...",
  "status": 400,
  "error": "Duplicate Weapon",
  "message": "Player already has a skin for weapon 'AK-47'"
}
```

---

## 🔄 Interação entre Regras

As regras são validadas nesta ordem:

1. **Máximo de 5 skins** (primeiro)
2. **Skin duplicada** (nome)
3. **Arma duplicada** (último)

### Exemplo Complexo

```bash
# Cenário: Player com 4 skins diferentes
# Skins atuais:
# 1. AK-47 | Redline
# 2. AWP | Dragon Lore
# 3. M4A4 | Howl
# 4. Desert Eagle | Blaze

# ✅ Permitido: 5ª skin, nome novo, arma nova
curl -X POST http://localhost:8080/skins/player/1 \
  -H "Content-Type: application/json" \
  -d '{"name":"Glock-18 | Fade","floatValue":"0.01","price":350.00,"rarity":"Restricted","weapon":"Glock-18"}'

# ❌ Bloqueado: 6ª skin (limite de 5)
curl -X POST http://localhost:8080/skins/player/1 \
  -H "Content-Type: application/json" \
  -d '{"name":"USP-S | Kill Confirmed","floatValue":"0.12","price":180.00,"rarity":"Covert","weapon":"USP-S"}'
```

---

## 🧪 Teste Completo de Validação

Script para testar todas as regras de uma vez:

```bash
# Criar player
PLAYER_ID=$(curl -s -X POST http://localhost:8080/players \
  -H "Content-Type: application/json" \
  -d '{"email":"teste.regras@rushb.com","password":"senha123"}' \
  | jq -r '.id')

echo "Player criado com ID: $PLAYER_ID"

# Adicionar 5 skins válidas
echo "Adicionando 5 skins..."
curl -X POST http://localhost:8080/skins/player/$PLAYER_ID \
  -H "Content-Type: application/json" \
  -d '{"name":"AK-47 | Redline","floatValue":"0.15","price":45.99,"rarity":"Classified","weapon":"AK-47"}'

curl -X POST http://localhost:8080/skins/player/$PLAYER_ID \
  -H "Content-Type: application/json" \
  -d '{"name":"AWP | Dragon Lore","floatValue":"0.03","price":2500.00,"rarity":"Covert","weapon":"AWP"}'

curl -X POST http://localhost:8080/skins/player/$PLAYER_ID \
  -H "Content-Type: application/json" \
  -d '{"name":"M4A4 | Howl","floatValue":"0.07","price":1800.00,"rarity":"Contraband","weapon":"M4A4"}'

curl -X POST http://localhost:8080/skins/player/$PLAYER_ID \
  -H "Content-Type: application/json" \
  -d '{"name":"Desert Eagle | Blaze","floatValue":"0.008","price":520.00,"rarity":"Restricted","weapon":"Desert Eagle"}'

curl -X POST http://localhost:8080/skins/player/$PLAYER_ID \
  -H "Content-Type: application/json" \
  -d '{"name":"Glock-18 | Fade","floatValue":"0.01","price":350.00,"rarity":"Restricted","weapon":"Glock-18"}'

# Testar Regra 1: Máximo de 5
echo "Testando Regra 1: Máximo de 5 skins..."
curl -X POST http://localhost:8080/skins/player/$PLAYER_ID \
  -H "Content-Type: application/json" \
  -d '{"name":"USP-S | Kill Confirmed","floatValue":"0.12","price":180.00,"rarity":"Covert","weapon":"USP-S"}'

# Remover uma skin para testar outras regras
SKIN_ID=$(curl -s http://localhost:8080/players/$PLAYER_ID | jq -r '.skins[0].id')
curl -X DELETE http://localhost:8080/skins/$SKIN_ID

# Testar Regra 2: Skin duplicada
echo "Testando Regra 2: Skin duplicada..."
curl -X POST http://localhost:8080/skins/player/$PLAYER_ID \
  -H "Content-Type: application/json" \
  -d '{"name":"AWP | Dragon Lore","floatValue":"0.05","price":2600.00,"rarity":"Covert","weapon":"AWP"}'

# Testar Regra 3: Arma duplicada
echo "Testando Regra 3: Arma duplicada..."
curl -X POST http://localhost:8080/skins/player/$PLAYER_ID \
  -H "Content-Type: application/json" \
  -d '{"name":"AWP | Asiimov","floatValue":"0.25","price":95.00,"rarity":"Covert","weapon":"AWP"}'

echo "Testes concluídos!"
```

---

## 📊 Matriz de Validação

| Cenário | Regra Violada | Status Esperado | Mensagem |
|---------|---------------|-----------------|----------|
| 6+ skins | Regra 1 | 400 | "Player already has maximum of 5 skins" |
| Nome duplicado | Regra 2 | 400 | "Player already has a skin named '...'" |
| Arma duplicada | Regra 3 | 400 | "Player already has a skin for weapon '...'" |
| Tudo válido | Nenhuma | 201 | Skin criada com sucesso |

---

## 🎯 Casos de Borda

### Players Diferentes
- ✅ Dois players PODEM ter a mesma skin
- ✅ Dois players PODEM ter skins da mesma arma

### Skins sem Dono
- ✅ Skins podem existir sem player (player_id = NULL)
- ✅ São consideradas "disponíveis no mercado"
- ✅ Não contam para o limite de nenhum player

### Validações de Campo
- Email deve ser único
- Email deve ser válido
- Password deve ter pelo menos 6 caracteres
- Price deve ser positivo
- Todos os campos são obrigatórios
