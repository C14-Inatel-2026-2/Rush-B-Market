# Rush-B-Market

Marketplace de skins de **Counter-Strike**. Jogadores (players) se cadastram, montam um inventário de skins respeitando regras de negócio e navegam por uma vitrine web com as skins disponíveis, com imagem, preço, condição e float.

Projeto acadêmico da disciplina **C14 – Engenharia de Software (Inatel)**, organizado com **Scrum**.

- **Gestão ágil (Jira):** https://brunoquirino2020.atlassian.net/jira/software/projects/KAN/boards/1
- **Repositório:** https://github.com/C14-Inatel-2026-2/Rush-B-Market

## Equipe

| Integrante | Papel | GitHub |
| --- | --- | --- |
| Bruno Alvarenga | Product Owner / Backend / QA | [@brunoquirino14](https://github.com/brunoquirino14) |
| Bruce Alvarenga | Backend / QA | [@BruceBrAlva](https://github.com/BruceBrAlva) |
| Samuel Ribeiro | Backend / DevOps | [@Samu-TimRib](https://github.com/Samu-TimRib) |
| Gabriel Pivoto | Frontend / QA | [@GPivoto](https://github.com/GPivoto) |
| Luís Teles | Frontend / DevOps | [@LuisTeles](https://github.com/LuisTeles) |
| André Araújo | Frontend / DevOps | [@Alves-Araujo](https://github.com/Alves-Araujo) |

## Arquitetura

Monorepo com duas aplicações e os pipelines de CI/CD:

```
Rush-B-Market/
├── Backend/    # API REST — Java 17 + Spring Boot 3.4 + PostgreSQL 16
├── Frontend/   # Aplicação web — Next.js 16 + React 19 + TypeScript + Tailwind CSS 4
├── CI-CD/      # Jenkinsfiles dos jobs J2 a J5
├── Jenkinsfile # Build do backend
└── IA/         # Registro do uso de IA no desenvolvimento
```

## Documentação

| Documento | Conteúdo |
| --- | --- |
| [Backend/README.md](Backend/README.md) | Stack, modelo de dados, endpoints e como rodar a API |
| [Backend/Docs/API_GUIDE.md](Backend/Docs/API_GUIDE.md) | Guia detalhado dos endpoints da API |
| [Frontend/README.md](Frontend/README.md) | Setup do frontend com e sem Docker, comandos e solução de problemas |

### Uso de IA

Cada integrante registra como usou IA no projeto (ferramenta, modelo, para que usou e exemplos de prompt):

| Integrante | Registro |
| --- | --- |
| Bruno Alvarenga | [Backend/Docs/PROMPTS_HISTORY.md](Backend/Docs/PROMPTS_HISTORY.md) |
| André Araújo | [IA/Frontend/Andre-Araujo-Claude.md](IA/Frontend/Andre-Araujo-Claude.md) |
| Demais integrantes | Pasta [IA/](IA/) |

## Requisitos funcionais

| ID | Requisito | Status |
| --- | --- | --- |
| RF01 | O sistema deve permitir cadastrar um player com e-mail e senha. | Implementado (API) |
| RF02 | O sistema deve impedir o cadastro de dois players com o mesmo e-mail. | Implementado (API) |
| RF03 | O sistema deve listar todos os players cadastrados. | Implementado (API) |
| RF04 | O sistema deve exibir os dados de um player junto com o seu inventário de skins. | Implementado (API) |
| RF05 | O sistema deve permitir excluir um player. | Implementado (API) |
| RF06 | O sistema deve permitir adicionar uma skin ao inventário de um player, respeitando as regras de negócio (RN01 a RN03). | Implementado (API) |
| RF07 | O sistema deve listar todas as skins. | Implementado (API) |
| RF08 | O sistema deve exibir os dados de uma skin específica. | Implementado (API) |
| RF09 | O sistema deve permitir remover uma skin. | Implementado (API) |
| RF10 | O sistema deve exibir uma vitrine com as skins, mostrando imagem, nome, categoria, condição (FN, MW, FT…), float e preço. | Implementado (web, com dados de exemplo) |
| RF11 | O sistema deve exibir no cabeçalho os indicadores do mercado (valor em stake e quantidade de anúncios). | Parcial (valores fixos) |
| RF12 | O sistema deve permitir filtrar a vitrine por categoria (ALL, COVERT, KNIVES, RIFLES, PISTOLS). | Parcial (botões prontos, filtragem pendente) |
| RF13 | O sistema deve permitir buscar uma skin pelo nome. | Parcial (campo pronto, busca pendente) |
| RF14 | A vitrine deve consumir os dados da API em vez dos dados de exemplo. | Pendente |

### Regras de negócio

| ID | Regra |
| --- | --- |
| RN01 | Um player pode ter no **máximo 5 skins**. |
| RN02 | Um player **não pode ter duas skins com o mesmo nome**. |
| RN03 | Um player **não pode ter mais de uma skin da mesma arma**. |
| RN04 | O e-mail do player deve ser válido e único, e a senha deve ter no mínimo 6 caracteres. |

## Requisitos não funcionais

| ID | Requisito | Status |
| --- | --- | --- |
| RNF01 | A API deve seguir o padrão REST, trocar dados em JSON e responder com códigos HTTP adequados (201, 204, 400, 404, 409) e corpo de erro padronizado. | Atendido |
| RNF02 | Os dados devem ser persistidos em banco relacional PostgreSQL 16. | Atendido |
| RNF03 | Os dados de entrada devem ser validados antes do processamento (Bean Validation). | Atendido |
| RNF04 | A API deve ser documentada com Swagger/OpenAPI. | Atendido |
| RNF05 | A interface deve ser responsiva: a vitrine se adapta de 2 a 6 colunas conforme a largura da tela. | Atendido |
| RNF06 | O código deve ter testes automatizados: JUnit no backend e Jest + Testing Library no frontend. | Atendido |
| RNF07 | A cobertura de testes do backend deve ser medida com JaCoCo. | Atendido |
| RNF08 | Testes, build e deploy devem rodar automaticamente em pipelines de CI/CD no Jenkins. | Atendido |
| RNF09 | As aplicações devem rodar em containers Docker, sem exigir Java ou Node instalados para o desenvolvimento. | Atendido |
| RNF10 | As aplicações devem expor verificação de saúde: Actuator (`/actuator/health`) no backend e healthcheck no container do frontend. | Atendido |
| RNF11 | O container de produção do frontend deve rodar sem privilégios de root. | Atendido |
| RNF12 | As senhas devem ser armazenadas com hash (ex.: BCrypt), nunca em texto puro. | Pendente |
| RNF13 | Toda alteração deve passar por Pull Request revisado antes de entrar na branch `homolog`. | Atendido |

## Como executar

### Backend (API)

Pré-requisito: Docker. Detalhes em [Backend/README.md](Backend/README.md).

```bash
cd Backend
docker-compose up
```

- API: http://localhost:8080
- Swagger: http://localhost:8080/swagger-ui.html
- Health check: http://localhost:8080/actuator/health

### Frontend (web)

Pré-requisito: Docker. Detalhes em [Frontend/README.md](Frontend/README.md).

```bash
cd Frontend
docker compose up
```

- Aplicação: http://localhost:3000

## Testes

```bash
# Backend
cd Backend && ./mvnw test

# Frontend
cd Frontend && npm install && npm test
```

## CI/CD (Jenkins)

| Job | Arquivo | O que faz |
| --- | --- | --- |
| Build Backend | `Jenkinsfile` | Compila e empacota a API |
| J2 – Testes Backend | `CI-CD/J2-Testes-Backend.Jenkinsfile` | Roda os testes JUnit |
| J2 – Testes Frontend | `CI-CD/J2-Testes-Frontend.Jenkinsfile` | Roda os testes Jest e publica o relatório |
| J3 – Cobertura Backend | `CI-CD/J3-Cobertura-Backend.Jenkinsfile` | Gera o relatório de cobertura JaCoCo |
| J4 – Build Frontend | `CI-CD/J4-Build-Frontend.Jenkinsfile` | Gera e valida o build de produção do Next.js |
| J5 – Deploy Frontend | `CI-CD/J5-Deploy-Frontend.Jenkinsfile` | Gera a imagem Docker de produção e sobe o container |

## Fluxo de trabalho

1. Cada tarefa vem de uma história do backlog no Jira.
2. O desenvolvimento acontece numa branch própria (`feat/…`, `test/…`, `ci/…`, `fix/…`, `docs/…`) criada a partir da `homolog`.
3. A branch é enviada ao GitHub e um **Pull Request para a `homolog`** é aberto e revisado antes do merge.
