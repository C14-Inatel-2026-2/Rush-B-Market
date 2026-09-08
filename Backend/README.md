# 🎯 Rush-B-Market API

API REST para marketplace de skins de CS (Counter-Strike) desenvolvida com Java e Spring Boot.

## 👥 Equipe

- **Bruno Alvarenga** - Product Owner / Backend / QA - [GitHub](https://github.com/brunoquirino14)
- **Bruce Alvarenga** - Backend / QA - [GitHub](https://github.com/BruceBrAlva/)
- **Samuel Ribeiro** - Backend / DevOps - [GitHub](https://github.com/Samu-TimRib)
- **Gabriel Pivoto** - Frontend / QA - [GitHub](https://github.com/GPivoto)
- **Luís Teles** - Frontend / DevOps - [GitHub](https://github.com/LuisTeles)
- **André Araújo** - Frontend / DevOps - [GitHub](https://github.com/Alves-Araujo)

## 🚀 Stack Tecnológica

- **Backend**: Java 17 + Spring Boot 3.4.0
- **Banco de Dados**: PostgreSQL 16
- **Gerenciamento de Dependências**: Maven
- **Documentação**: Swagger/OpenAPI
- **Containerização**: Docker + Docker Compose

## 📋 Modelo de Dados

### Player
- `id` - Identificador único
- `email` - Email único do jogador
- `password` - Senha
- `created_at` - Data de criação

### Skin
- `id` - Identificador único
- `name` - Nome da skin
- `float_value` - Valor do float (desgaste)
- `price` - Preço
- `rarity` - Raridade
- `weapon` - Arma da skin
- `player_id` - ID do dono (pode ser NULL)

**Relacionamento**: 1 Player → N Skins

## ⚖️ Regras de Negócio

1. ✅ **Player não pode ter skin duplicada** (mesmo nome)
2. ✅ **Player pode ter no máximo 5 skins**
3. ✅ **Player não pode ter mais de uma skin da mesma arma**

## 🔌 Endpoints

### Players

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/players` | Criar novo player |
| GET | `/players` | Listar todos os players |
| GET | `/players/{id}` | Buscar player por ID (com skins) |
| DELETE | `/players/{id}` | Deletar player |

### Skins

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/skins/player/{playerId}` | Adicionar skin ao player |
| GET | `/skins` | Listar todas as skins |
| GET | `/skins/{id}` | Buscar skin por ID |
| DELETE | `/skins/{id}` | Deletar skin |

## 🏃 Como Executar

### Pré-requisitos
- Docker e Docker Compose instalados
- Java 17+ (opcional, se quiser rodar local)
- Maven 3.9+ (opcional, se quiser rodar local)

### 1️⃣ Subir o Banco de Dados

```bash
docker-compose up -d db
```

### 2️⃣ Rodar a Aplicação

**Opção A - Com Maven (local):**
```bash
mvn spring-boot:run
```

**Opção B - Com Docker:**
```bash
docker-compose up
```

### 3️⃣ Acessar a Aplicação

- **API**: http://localhost:8080
- **Swagger UI**: http://localhost:8080/swagger-ui.html
- **Health Check**: http://localhost:8080/actuator/health

## 📊 Dados Fictícios

O banco é populado automaticamente com:
- 5 players de exemplo
- Várias skins já atribuídas a players
- Skins disponíveis no mercado (sem dono)

## 🧪 Testando a API

### Criar um Player

```bash
curl -X POST http://localhost:8080/players \
  -H "Content-Type: application/json" \
  -d '{
    "email": "teste@rushb.com",
    "password": "senha123"
  }'
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

## 🛠️ Build

```bash
mvn clean package
```

## 📝 Logs

A aplicação gera logs detalhados com SQL formatado para facilitar o debug.

## 🔐 Segurança

⚠️ **ATENÇÃO**: Esta é uma versão inicial para desenvolvimento. As senhas estão armazenadas em texto plano. Em produção, use BCrypt ou similar!

## 📦 Estrutura do Projeto

```
src/
├── main/
│   ├── java/com/rushbmarket/api/
│   │   ├── controller/     # Controllers REST
│   │   ├── service/        # Lógica de negócio
│   │   ├── repository/     # Acesso ao banco
│   │   ├── model/
│   │   │   ├── entity/     # Entidades JPA
│   │   │   └── dto/        # DTOs Request/Response
│   │   ├── mapper/         # Conversores Entity <-> DTO
│   │   └── exception/      # Exceções customizadas
│   └── resources/
│       ├── application.properties
│       └── data.sql        # Dados iniciais
```

## 🐳 Docker

O projeto inclui:
- `docker-compose.yml` - Orquestração do PostgreSQL
- `Dockerfile` - Build da aplicação (multi-stage)

## 📄 Licença

Projeto acadêmico - Universidade/Disciplina
