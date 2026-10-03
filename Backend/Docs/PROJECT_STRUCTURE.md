# 📁 Estrutura do Projeto - Rush-B-Market API

## 🌳 Árvore de Diretórios

```
Backend/
│
├── src/
│   ├── main/
│   │   ├── java/com/rushbmarket/api/
│   │   │   ├── RushBMarketApiApplication.java     # Classe principal Spring Boot
│   │   │   │
│   │   │   ├── controller/                         # 🎮 Controllers (REST API)
│   │   │   │   ├── PlayerController.java          #   Endpoints de Players
│   │   │   │   └── SkinController.java            #   Endpoints de Skins
│   │   │   │
│   │   │   ├── service/                            # 💼 Services (Lógica de Negócio)
│   │   │   │   ├── PlayerService.java             #   Regras de Players
│   │   │   │   └── SkinService.java               #   Regras de Skins + Validações
│   │   │   │
│   │   │   ├── repository/                         # 🗄️ Repositories (Acesso a Dados)
│   │   │   │   ├── PlayerRepository.java          #   JPA Repository de Players
│   │   │   │   └── SkinRepository.java            #   JPA Repository de Skins
│   │   │   │
│   │   │   ├── model/                              # 📦 Modelos de Dados
│   │   │   │   ├── entity/                        #   Entidades JPA
│   │   │   │   │   ├── Player.java                #     Tabela players
│   │   │   │   │   └── Skin.java                  #     Tabela skins
│   │   │   │   │
│   │   │   │   └── dto/                            #   Data Transfer Objects
│   │   │   │       ├── request/                   #     DTOs de Request
│   │   │   │       │   ├── CreatePlayerRequestDTO.java
│   │   │   │       │   └── AddSkinRequestDTO.java
│   │   │   │       │
│   │   │   │       └── response/                  #     DTOs de Response
│   │   │   │           ├── PlayerResponseDTO.java
│   │   │   │           ├── PlayerWithSkinsResponseDTO.java
│   │   │   │           └── SkinResponseDTO.java
│   │   │   │
│   │   │   ├── mapper/                             # 🔄 Mappers (Conversões)
│   │   │   │   ├── PlayerMapper.java              #   Entity ↔ DTO (Player)
│   │   │   │   └── SkinMapper.java                #   Entity ↔ DTO (Skin)
│   │   │   │
│   │   │   └── exception/                          # 🚨 Exceções Customizadas
│   │   │       ├── GlobalExceptionHandler.java    #   Handler global de erros
│   │   │       ├── ErrorResponse.java             #   Modelo de resposta de erro
│   │   │       ├── PlayerNotFoundException.java
│   │   │       ├── SkinNotFoundException.java
│   │   │       ├── EmailAlreadyExistsException.java
│   │   │       ├── MaxSkinsLimitExceededException.java
│   │   │       ├── DuplicateSkinException.java
│   │   │       └── DuplicateWeaponException.java
│   │   │
│   │   └── resources/
│   │       ├── application.properties              # ⚙️ Configurações da aplicação
│   │       └── data.sql                            # 📊 Dados iniciais (seed)
│   │
│   └── test/                                        # 🧪 Testes (futuro)
│       └── java/com/rushbmarket/api/
│
├── target/                                          # 📦 Arquivos compilados (gerado)
│
├── .idea/                                           # IDE IntelliJ IDEA
├── .mvn/                                            # Maven Wrapper
│
├── docker-compose.yml                               # 🐳 Orquestração Docker
├── Dockerfile                                       # 🐳 Build da aplicação
├── pom.xml                                          # 📋 Dependências Maven
├── .gitignore                                       # 🚫 Arquivos ignorados pelo Git
│
├── README.md                                        # 📖 Documentação principal
├── QUICKSTART.md                                    # ⚡ Guia rápido de início
├── SETUP.md                                         # 🔧 Guia completo de setup
├── BUSINESS_RULES.md                                # 📋 Regras de negócio detalhadas
├── PROJECT_STRUCTURE.md                             # 📁 Este arquivo
│
├── postman_collection.json                          # 📮 Collection Postman
├── test-api.ps1                                     # 🧪 Script de teste PowerShell
│
├── Instructions.md                                  # 📝 Instruções do projeto
└── HELP.md                                          # ℹ️ Ajuda Spring Boot

```

## 🎯 Padrão Arquitetural

### Arquitetura em Camadas

```
┌─────────────────────────────────────┐
│          CLIENT                     │  (Postman, Browser, Frontend)
└─────────────────────────────────────┘
                ↓
┌─────────────────────────────────────┐
│      CONTROLLER LAYER               │  REST API Endpoints
│  - PlayerController                 │  @RestController
│  - SkinController                   │  HTTP Methods (GET, POST, DELETE)
└─────────────────────────────────────┘
                ↓
┌─────────────────────────────────────┐
│       SERVICE LAYER                 │  Business Logic
│  - PlayerService                    │  @Service
│  - SkinService                      │  Validações & Regras de Negócio
└─────────────────────────────────────┘
                ↓
┌─────────────────────────────────────┐
│     REPOSITORY LAYER                │  Data Access
│  - PlayerRepository                 │  @Repository
│  - SkinRepository                   │  JPA / Hibernate
└─────────────────────────────────────┘
                ↓
┌─────────────────────────────────────┐
│         DATABASE                    │  PostgreSQL
│  - players table                    │  
│  - skins table                      │  
└─────────────────────────────────────┘
```

## 📝 Responsabilidades das Camadas

### 1. Controller Layer
**Responsabilidade**: Receber requisições HTTP e retornar respostas

- Define endpoints REST
- Valida entrada (Bean Validation)
- Serializa/Deserializa JSON
- Define status HTTP de resposta
- Documentação Swagger

**Não deve**:
- ❌ Conter lógica de negócio
- ❌ Acessar o banco diretamente
- ❌ Fazer validações complexas

### 2. Service Layer
**Responsabilidade**: Implementar regras de negócio

- Validações complexas (regras de negócio)
- Orquestração entre múltiplos repositories
- Transações (@Transactional)
- Tratamento de exceções de negócio
- Conversão Entity ↔ DTO (via Mappers)

**Não deve**:
- ❌ Saber sobre HTTP (Request/Response)
- ❌ Serialização JSON
- ❌ Status HTTP

### 3. Repository Layer
**Responsabilidade**: Acesso e persistência de dados

- CRUD básico (extends JpaRepository)
- Queries customizadas
- Conexão com banco de dados

**Não deve**:
- ❌ Conter lógica de negócio
- ❌ Validações complexas
- ❌ Saber sobre DTOs

### 4. Model Layer
**Responsabilidade**: Representar dados

**Entities**:
- Mapeamento JPA para tabelas
- Relacionamentos (@OneToMany, @ManyToOne)
- Validações de campo (@NotNull, @Email)

**DTOs**:
- Request: Dados recebidos do cliente
- Response: Dados enviados ao cliente
- Desacoplamento entre API e modelo de dados

### 5. Exception Layer
**Responsabilidade**: Tratamento centralizado de erros

- Exceções customizadas de negócio
- Handler global (@RestControllerAdvice)
- Padronização de respostas de erro
- Mapeamento de status HTTP

## 🔄 Fluxo de uma Requisição

### Exemplo: Adicionar Skin ao Player

```
1. Cliente faz POST /skins/player/1
   {
     "name": "AK-47 | Redline",
     "floatValue": "0.15",
     "price": 45.99,
     "rarity": "Classified",
     "weapon": "AK-47"
   }

2. SkinController.addSkinToPlayer()
   - Recebe AddSkinRequestDTO
   - Valida campos (@Valid)
   - Chama SkinService

3. SkinService.addSkinToPlayer()
   - Busca Player no repository
   - Valida Regra 1: máximo 5 skins
   - Valida Regra 2: skin duplicada
   - Valida Regra 3: arma duplicada
   - Converte DTO → Entity (SkinMapper)
   - Salva no repository
   - Converte Entity → DTO (SkinMapper)
   - Retorna SkinResponseDTO

4. SkinController
   - Retorna HTTP 201 Created
   - Body: SkinResponseDTO em JSON

5. Cliente recebe
   {
     "id": 10,
     "name": "AK-47 | Redline",
     "floatValue": "0.15",
     "price": 45.99,
     "rarity": "Classified",
     "weapon": "AK-47",
     "playerId": 1
   }
```

## 🛠️ Tecnologias e Frameworks

| Camada | Tecnologia | Anotações Principais |
|--------|------------|---------------------|
| Controller | Spring Web | @RestController, @RequestMapping, @GetMapping, @PostMapping, @DeleteMapping |
| Service | Spring Core | @Service, @Transactional |
| Repository | Spring Data JPA | @Repository, extends JpaRepository |
| Entity | JPA/Hibernate | @Entity, @Table, @Id, @GeneratedValue, @OneToMany, @ManyToOne |
| Validation | Bean Validation | @NotNull, @NotBlank, @Email, @Size, @Positive |
| Exception | Spring Web | @RestControllerAdvice, @ExceptionHandler |
| Documentation | SpringDoc OpenAPI | Swagger UI automático |
| Utilities | Lombok | @Data, @Builder, @NoArgsConstructor, @AllArgsConstructor, @RequiredArgsConstructor |

## 📦 Dependências Principais (pom.xml)

- **spring-boot-starter-web**: REST API
- **spring-boot-starter-data-jpa**: ORM/JPA
- **spring-boot-starter-validation**: Bean Validation
- **spring-boot-starter-actuator**: Health checks
- **postgresql**: Driver PostgreSQL
- **lombok**: Redução de boilerplate
- **springdoc-openapi**: Swagger/OpenAPI

## 🎨 Convenções de Código

### Nomenclatura
- **Controllers**: `*Controller.java`
- **Services**: `*Service.java`
- **Repositories**: `*Repository.java`
- **Entities**: Nome singular (Player, Skin)
- **DTOs**: `*RequestDTO.java` ou `*ResponseDTO.java`
- **Exceptions**: `*Exception.java`
- **Mappers**: `*Mapper.java`

### Pacotes
- `controller`: Controllers REST
- `service`: Lógica de negócio
- `repository`: Acesso a dados
- `model.entity`: Entidades JPA
- `model.dto.request`: DTOs de entrada
- `model.dto.response`: DTOs de saída
- `mapper`: Conversores Entity ↔ DTO
- `exception`: Exceções customizadas

## 🔍 Pontos de Extensão

### Adicionar Nova Entidade
1. Criar Entity em `model/entity/`
2. Criar Repository em `repository/`
3. Criar DTOs em `model/dto/`
4. Criar Mapper em `mapper/`
5. Criar Service em `service/`
6. Criar Controller em `controller/`
7. Criar Exceptions se necessário

### Adicionar Nova Regra de Negócio
1. Criar Exception se necessário
2. Implementar validação no Service
3. Adicionar tratamento no GlobalExceptionHandler
4. Documentar em BUSINESS_RULES.md

### Adicionar Novo Endpoint
1. Adicionar método no Controller
2. Anotar com @Operation (Swagger)
3. Criar DTO se necessário
4. Implementar lógica no Service
