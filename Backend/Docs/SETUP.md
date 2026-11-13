# 🔧 Guia de Configuração - Rush-B-Market API

## ⚙️ Pré-requisitos

### 1. Java 17+
Verifique se está instalado:
```bash
java -version
```

Se não estiver, baixe do [Adoptium](https://adoptium.net/) ou [Oracle](https://www.oracle.com/java/technologies/downloads/).

### 2. Maven 3.9+
Verifique se está instalado:
```bash
mvn --version
```

Se não estiver, baixe do [Maven Apache](https://maven.apache.org/download.cgi).

### 3. Docker Desktop
Baixe e instale do [Docker.com](https://www.docker.com/products/docker-desktop/).

Verifique se está funcionando:
```bash
docker --version
docker compose version
```

## 🚀 Passo a Passo para Rodar

### Opção 1: Com Docker (Recomendado)

1. **Subir o banco de dados**
```bash
docker compose up -d
```

2. **Aguardar o PostgreSQL inicializar** (10-15 segundos)

3. **Compilar o projeto**
```bash
mvn clean package -DskipTests
```

4. **Rodar a aplicação**
```bash
mvn spring-boot:run
```

### Opção 2: Apenas Banco no Docker

1. **Subir só o banco**
```bash
docker compose up -d db
```

2. **Rodar direto com Maven**
```bash
mvn spring-boot:run
```

### Opção 3: PostgreSQL Local (sem Docker)

Se você já tem PostgreSQL instalado localmente:

1. **Criar o banco de dados**
```sql
CREATE DATABASE rushbmarket;
CREATE USER csuser WITH PASSWORD 'cspass';
GRANT ALL PRIVILEGES ON DATABASE rushbmarket TO csuser;
```

2. **Ajustar a porta no application.properties** (se necessário)
```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/rushbmarket
```

3. **Rodar a aplicação**
```bash
mvn spring-boot:run
```

## ✅ Verificando se está Funcionando

1. **Health Check**
```bash
curl http://localhost:8080/actuator/health
```

Deve retornar: `{"status":"UP"}`

2. **Swagger UI**

Abra no navegador: http://localhost:8080/swagger-ui.html

3. **Testar criação de Player**
```bash
curl -X POST http://localhost:8080/players \
  -H "Content-Type: application/json" \
  -d '{"email":"teste@exemplo.com","password":"senha123"}'
```

## 🐛 Problemas Comuns

### Porta 8080 já está em uso
```bash
# Windows - encontrar o processo
netstat -ano | findstr :8080

# Matar o processo (substituir PID)
taskkill /PID <numero_pid> /F
```

Ou altere a porta no `application.properties`:
```properties
server.port=8081
```

### Porta 5432 (PostgreSQL) em uso
Altere a porta no `docker-compose.yml`:
```yaml
ports:
  - "5433:5432"
```

E atualize o `application.properties`:
```properties
spring.datasource.url=jdbc:postgresql://localhost:5433/rushbmarket
```

### Docker não está rodando
```bash
# Windows - iniciar Docker Desktop
# Ou procurar "Docker Desktop" no menu iniciar
```

### Erro de conexão com banco
1. Verifique se o container está rodando:
```bash
docker ps
```

2. Verifique os logs:
```bash
docker logs rushbmarket-db
```

3. Teste a conexão:
```bash
docker exec -it rushbmarket-db psql -U csuser -d rushbmarket
```

## 🧹 Limpeza

### Parar a aplicação
`Ctrl + C` no terminal onde está rodando

### Parar e remover containers
```bash
docker compose down
```

### Remover também os volumes (CUIDADO: apaga dados)
```bash
docker compose down -v
```

## 📊 Populando o Banco

O banco é populado automaticamente ao iniciar a aplicação pela primeira vez graças ao arquivo `src/main/resources/data.sql`.

Se precisar repopular:
1. Pare a aplicação
2. Remova os volumes do Docker: `docker compose down -v`
3. Suba novamente: `docker compose up -d`
4. Inicie a aplicação: `mvn spring-boot:run`

## 🔄 Rebuild

Se alterar código:
```bash
# Ctrl + C para parar a aplicação
mvn clean package -DskipTests
mvn spring-boot:run
```

## 🌐 Endpoints Disponíveis

Após iniciar, acesse:
- **API Base**: http://localhost:8080
- **Swagger**: http://localhost:8080/swagger-ui.html
- **Health**: http://localhost:8080/actuator/health
- **Info**: http://localhost:8080/actuator/info

## 📝 Variáveis de Ambiente

Você pode sobrescrever configurações via variáveis de ambiente:

```bash
# Windows PowerShell
$env:SPRING_DATASOURCE_URL="jdbc:postgresql://localhost:5432/outro_banco"
$env:SPRING_DATASOURCE_USERNAME="outro_user"
$env:SPRING_DATASOURCE_PASSWORD="outra_senha"
mvn spring-boot:run
```

## 🆘 Precisa de Ajuda?

Entre em contato com a equipe do projeto!
