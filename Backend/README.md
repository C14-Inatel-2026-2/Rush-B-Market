# Rush B Market — Backend

Documentação técnica exclusiva da API do Rush B Market. Este arquivo cobre somente o serviço localizado nesta pasta: configuração, persistência, regras de negócio, endpoints, execução e testes do backend.

> A visão geral do produto, equipe, organização ágil, requisitos do sistema completo e instruções do frontend estão documentadas no [README da raiz](../README.md).

## 1. Responsabilidade do backend

O backend disponibiliza uma API REST para operações relacionadas a jogadores (*players*) e skins. Ele recebe requisições HTTP em JSON, valida os dados de entrada, aplica as regras de negócio, acessa o PostgreSQL e retorna DTOs com os resultados.

### Tecnologias e dependências

| Tecnologia | Utilização |
|---|---|
| Java 17 | Linguagem e versão-alvo de compilação |
| Spring Boot 3.4.0 | Inicialização e configuração da aplicação |
| Spring Web | Criação dos endpoints REST |
| Spring Data JPA / Hibernate | Persistência e mapeamento objeto-relacional |
| PostgreSQL 16 | Banco de dados relacional |
| Jakarta Bean Validation | Validação dos dados de entrada |
| Maven e Maven Wrapper | Gerenciamento de dependências e build |
| Springdoc OpenAPI 2.7.0 | Documentação interativa da API |
| Spring Boot Actuator | Endpoints de saúde e informações |
| JUnit 5, Mockito e AssertJ | Testes automatizados |
| JaCoCo 0.8.13 | Instrumentação e relatório de cobertura |
| Docker | Containerização da aplicação e do banco |

## 2. Requisitos funcionais do backend

Os requisitos abaixo delimitam o comportamento implementado pela API. Não representam funcionalidades exclusivas do frontend.

| ID | Requisito | Situação no código |
|---|---|---|
| B-RF01 | Cadastrar um player informando e-mail e senha. | Implementado |
| B-RF02 | Impedir o cadastro de players com e-mail já existente. | Implementado |
| B-RF03 | Listar os players cadastrados. | Implementado |
| B-RF04 | Consultar um player pelo ID, incluindo seu inventário de skins. | Implementado |
| B-RF05 | Excluir um player pelo ID. | Implementado |
| B-RF06 | Adicionar uma skin ao inventário de um player existente. | Implementado |
| B-RF07 | Listar todas as skins cadastradas. | Implementado |
| B-RF08 | Consultar uma skin pelo ID. | Implementado |
| B-RF09 | Excluir uma skin pelo ID. | Implementado |

### Regras de negócio implementadas

1. Um player pode possuir no máximo **5 skins**.
2. Um player não pode possuir duas skins com o mesmo nome. A comparação do nome não diferencia maiúsculas de minúsculas.
3. Um player não pode possuir mais de uma skin da mesma arma. A comparação da arma não diferencia maiúsculas de minúsculas.
4. O e-mail do player é obrigatório, deve ter formato válido e deve ser único.
5. A senha é obrigatória e deve possuir pelo menos 6 caracteres.
6. O nome, float, raridade e arma da skin são obrigatórios.
7. O preço da skin é obrigatório e deve ser positivo.
8. Uma skin pode não estar associada a um player (`player_id` nulo), conforme o modelo de dados.

As três primeiras regras são verificadas no `SkinService` ao adicionar uma skin a um player. As validações de campos são declaradas nos DTOs de requisição e aplicadas com `@Valid` nos controllers.

## 3. Modelo de dados

O mapeamento é feito com JPA/Hibernate e utiliza duas entidades principais.

### Player — tabela `players`

| Campo | Tipo/descrição |
|---|---|
| `id` | Identificador gerado automaticamente |
| `email` | Obrigatório, único, até 255 caracteres |
| `password` | Obrigatório, mínimo de 6 caracteres |
| `created_at` | Data e hora de criação, preenchida antes da persistência |

### Skin — tabela `skins`

| Campo | Tipo/descrição |
|---|---|
| `id` | Identificador gerado automaticamente |
| `name` | Nome da skin, obrigatório |
| `float_value` | Float como texto, obrigatório |
| `price` | Preço numérico, obrigatório e positivo |
| `rarity` | Raridade, obrigatória |
| `weapon` | Arma, obrigatória |
| `player_id` | Referência ao player proprietário; pode ser nula |

### Relacionamento

- Um `Player` pode possuir várias `Skin`.
- Cada `Skin` pode estar associada a no máximo um `Player`.
- A associação é opcional para permitir skins sem proprietário.
- A entidade `Player` utiliza `cascade = CascadeType.ALL` e `orphanRemoval = true` no relacionamento com `Skin`.

## 4. Endpoints da API

A aplicação utiliza a porta `8080` por padrão. Os endpoints recebem e retornam JSON, exceto operações sem corpo de resposta.

### Players

| Método | Rota | Descrição | Sucesso |
|---|---|---|---|
| `POST` | `/players` | Cadastra um player | `201 Created` |
| `GET` | `/players` | Lista todos os players | `200 OK` |
| `GET` | `/players/{id}` | Consulta um player e suas skins | `200 OK` |
| `DELETE` | `/players/{id}` | Exclui um player | `204 No Content` |

#### Cadastrar player

**Requisição — `POST /players`**

```json
{
  "email": "player@rushb.com",
  "password": "senha123"
}
```

**Resposta ilustrativa — `201 Created`**

```json
{
  "id": 1,
  "email": "player@rushb.com",
  "createdAt": "2026-10-31T10:30:00"
}
```

A senha não faz parte do `PlayerResponseDTO`.

#### Consultar player por ID

**Requisição — `GET /players/1`**

A resposta contém os dados do player e uma lista de skins associadas. Se o player não existir, a API retorna `404 Not Found`.

### Skins

| Método | Rota | Descrição | Sucesso |
|---|---|---|---|
| `POST` | `/skins/player/{playerId}` | Adiciona uma skin ao inventário do player | `201 Created` |
| `GET` | `/skins` | Lista todas as skins | `200 OK` |
| `GET` | `/skins/{id}` | Consulta uma skin pelo ID | `200 OK` |
| `DELETE` | `/skins/{id}` | Exclui uma skin | `204 No Content` |

#### Adicionar skin a um player

**Requisição — `POST /skins/player/1`**

```json
{
  "name": "AK-47 | Redline",
  "floatValue": "0.15",
  "price": 45.99,
  "rarity": "Classified",
  "weapon": "AK-47"
}
```

A operação verifica se o player existe e aplica as regras de limite, nome duplicado e arma duplicada antes de persistir a skin.

#### Consultar skins

- `GET /skins` retorna a lista de skins cadastradas.
- `GET /skins/{id}` retorna uma skin específica.
- Se o ID solicitado não existir, a API retorna `404 Not Found`.
- Quando não há registros, a listagem é retornada como uma lista vazia.

### Actuator

| Método | Rota | Descrição |
|---|---|---|
| `GET` | `/actuator/health` | Estado de saúde da aplicação |
| `GET` | `/actuator/info` | Informações da aplicação |

Os endpoints `health` e `info` estão expostos pela configuração atual do Actuator.

## 5. Tratamento de erros e validações

O `GlobalExceptionHandler`, anotado com `@RestControllerAdvice`, centraliza o tratamento das exceções conhecidas.

| Situação | HTTP |
|---|---:|
| Campo obrigatório ausente ou inválido | `400 Bad Request` |
| Limite de cinco skins excedido | `400 Bad Request` |
| Skin com nome duplicado para o player | `400 Bad Request` |
| Skin de arma já existente no inventário | `400 Bad Request` |
| Player não encontrado | `404 Not Found` |
| Skin não encontrada | `404 Not Found` |
| E-mail já cadastrado | `409 Conflict` |
| Exceção não tratada especificamente | `500 Internal Server Error` |

As respostas das exceções de negócio utilizam os campos `timestamp`, `status`, `error` e `message`. Erros de validação de campos utilizam `timestamp`, `status`, `error` e um mapa `errors` com os campos inválidos.

### Exemplo de erro

```json
{
  "timestamp": "2026-10-31T10:35:00",
  "status": 404,
  "error": "Skin Not Found",
  "message": "Skin with ID 999 not found"
}
```

## 6. Requisitos não funcionais do backend

A tabela registra somente características relacionadas à API e à sua infraestrutura. Requisitos gerais do produto e da interface web estão no README da raiz.

| ID | Requisito | Situação observada |
|---|---|---|
| B-RNF01 | Disponibilizar operações por meio de API REST com dados JSON e métodos HTTP adequados. | Implementado |
| B-RNF02 | Persistir players e skins em banco relacional PostgreSQL. | Implementado |
| B-RNF03 | Validar dados de entrada antes de executar as operações. | Implementado com Jakarta Bean Validation |
| B-RNF04 | Disponibilizar documentação interativa dos endpoints por OpenAPI/Swagger. | Dependência configurada |
| B-RNF05 | Disponibilizar endpoint de saúde da aplicação. | Implementado via Actuator |
| B-RNF06 | Possibilitar execução do backend em container Docker. | Dockerfile disponível |
| B-RNF07 | Possuir testes automatizados para regras de negócio, entidades e mapeadores. | Testes unitários disponíveis |
| B-RNF08 | Medir cobertura de testes automatizados. | JaCoCo configurado no Maven |
| B-RNF09 | Não armazenar senhas em texto puro. | **Pendente** — o código atual persiste a senha recebida sem hash |
| B-RNF10 | Externalizar credenciais e configurações sensíveis, evitando valores fixos no código/configuração versionada. | **Pendente de melhoria** — há valores padrão de conexão no `application.properties` e no Compose |

**Observações sobre o estado atual:**

- A API utiliza DTOs para separar os objetos de requisição e resposta das entidades persistidas.
- O `application.properties` configura `spring.jpa.hibernate.ddl-auto=update`, inicialização SQL e logs SQL.
- O arquivo `docker-compose.yml` sobe o PostgreSQL. O serviço da aplicação está comentado; portanto, `docker compose up` não inicia a API nesse arquivo na configuração atual.
- O Dockerfile contém etapas para compilar o projeto com Maven/Java 17 e executar o JAR em uma imagem Java 17 JRE.
- A dependência Springdoc está presente no `pom.xml`; a interface Swagger pode ser acessada em `/swagger-ui.html` quando a aplicação está em execução.

## 7. Como executar localmente

### Pré-requisitos

- Docker Desktop com Docker Compose, para subir o PostgreSQL.
- Java 17, para executar a aplicação localmente.
- Não é necessário instalar Maven separadamente: o projeto inclui Maven Wrapper (`mvnw` e `mvnw.cmd`).

### 7.1 Subir o PostgreSQL

Dentro da pasta `Backend`:

```bash
docker compose up -d db
```

Verifique se o container está saudável:

```bash
docker compose ps
```

A configuração padrão do Compose cria:

| Configuração | Valor |
|---|---|
| Container | `rushbmarket-db` |
| Banco | `rushbmarket` |
| Usuário | `csuser` |
| Porta local | `5432` |

Esses valores são destinados ao ambiente local de desenvolvimento e devem ser substituídos por configurações seguras em ambientes compartilhados ou de produção.

### 7.2 Executar a API

**Windows PowerShell:**

```powershell
.\mvnw.cmd spring-boot:run
```

**Linux/macOS/Git Bash:**

```bash
chmod +x mvnw
./mvnw spring-boot:run
```

A aplicação será iniciada na porta `8080`.

### 7.3 Acessar a documentação e verificar a saúde

- Swagger UI: http://localhost:8080/swagger-ui.html
- OpenAPI JSON: http://localhost:8080/v3/api-docs
- Health: http://localhost:8080/actuator/health
- Info: http://localhost:8080/actuator/info

### 7.4 Encerrar os serviços

Para parar a aplicação, utilize `Ctrl + C` no terminal em que ela está rodando.

Para parar o banco:

```bash
docker compose down
```

Para remover também os dados persistidos no volume local (operação destrutiva):

```bash
docker compose down -v
```

## 8. Testes automatizados

Os testes estão em `src/test/java` e utilizam JUnit 5, Mockito e AssertJ.

| Classe de teste | Escopo |
|---|---|
| `PlayerServiceTest` | Criação, consulta, listagem, exclusão e regras relacionadas a players |
| `SkinServiceTest` | Regras de negócio para adicionar skins |
| `SkinServiceQueryTest` | Listagem, consulta e tratamento de skin inexistente |
| `PlayerEntityTest` | Associação e remoção de skins na entidade Player |
| `PlayerMapperTest` | Conversão de Player para DTOs |
| `SkinMapperTest` | Conversão de Skin para DTOs |

O conjunto de testes presente no repositório contém **23 métodos anotados com `@Test`**.

### Executar os testes

**Windows PowerShell:**

```powershell
.\mvnw.cmd test
```

**Linux/macOS/Git Bash:**

```bash
./mvnw test
```

### Gerar o build

```bash
./mvnw clean package
```

No Windows PowerShell, utilize `.\mvnw.cmd clean package`.

### Relatório JaCoCo

O plugin JaCoCo está configurado no `pom.xml` para instrumentar os testes e gerar o relatório na fase `test`.

Após executar:

```bash
./mvnw clean test
```

O relatório HTML é gerado em:

```text
target/site/jacoco/index.html
```

O relatório XML é gerado em:

```text
target/site/jacoco/jacoco.xml
```

Os relatórios são gerados localmente; sua publicação como artefato ou em um job Jenkins depende da configuração do pipeline.

## 9. Estrutura de diretórios do backend

```text
Backend/
├── .mvn/
│   └── wrapper/                 # Configuração do Maven Wrapper
├── Docs/                        # Guias técnicos complementares
├── src/
│   ├── main/
│   │   ├── java/com/rushbmarket/api/
│   │   │   ├── controller/      # Endpoints REST
│   │   │   ├── exception/       # Exceções e tratamento global
│   │   │   ├── mapper/          # Conversão entre entidades e DTOs
│   │   │   ├── model/
│   │   │   │   ├── dto/         # DTOs de entrada e saída
│   │   │   │   └── entity/      # Entidades JPA
│   │   │   ├── repository/      # Acesso aos dados
│   │   │   └── service/         # Regras de negócio
│   │   └── resources/
│   │       ├── application.properties
│   │       └── data.sql         # Dados iniciais
│   └── test/java/               # Testes automatizados
├── Dockerfile
├── docker-compose.yml
├── mvnw
├── mvnw.cmd
├── pom.xml
└── README.md
```

## 10. Documentação técnica complementar

Os documentos abaixo aprofundam assuntos específicos do backend:

- [Guia de endpoints e exemplos de requisição/resposta](Docs/API_GUIDE.md)
- [Início rápido](Docs/QUICKSTART.md)
- [Configuração e solução de problemas](Docs/SETUP.md)
- [Estrutura interna do projeto](Docs/PROJECT_STRUCTURE.md)

---

**Escopo deste documento:** backend da aplicação. Para informações sobre o produto completo, equipe, requisitos gerais, gestão ágil e frontend, consulte o [README principal](../README.md).
