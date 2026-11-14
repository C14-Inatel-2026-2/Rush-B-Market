# Uso de IA — Samuel Timóteo Ribeiroibeiro

**Ferramenta:** Kiro (extensão do VS Code), modelo Claude

## Testes unitários das regras de negócio do SkinService (PRs das branches test/rule-2 e test/skin-max-limit)

- **Pedi:** testes unitários para as regras de negócio do `SkinService`, cobrindo os cenários definidos no `BUSINESS_RULES.md`.
- **Resultado:** testes na classe `SkinServiceTest.java` para a Regra 1 (limite de 5 skins) e Regra 2 (sem skins duplicadas por nome, incluindo validação case-insensitive).
- **Prompt (resumido):** solicitei os testes baseando-me nas regras do `BUSINESS_RULES.md`, pedindo planejamento antes da implementação e confirmando cada etapa.
- **Ajuste:** o ambiente estava com JDK 25 instalado, o que causava incompatibilidade com o Lombok; a IA identificou o problema, localizou o JDK 21 instalado em paralelo e ajustou o script de execução.

## Testes unitários da entidade Player e do PlayerService (branch test/Player-entity)

- **Pedi:** testes sem mock para os métodos `addSkin` e `removeSkin` da entidade `Player`, e testes com mock para operações de deleção do `PlayerService`.
- **Resultado:** `PlayerEntityTest.java` com 2 testes de domínio puro, e 2 novos casos no `PlayerServiceTest.java` cobrindo `deletePlayer` com sucesso e com ID inexistente.
- **Prompt (resumido):** pedi os testes separados em duas categorias — sem mock (entidade) e com mock (serviço) — com planejamento prévio à implementação.

## Job de build de produção do Frontend no Jenkins (branch ci/J4-build-frontend)

- **Pedi:** a criação do job J4 de build do frontend no Jenkins, alinhando o nome da instalação do Node.js com o colega responsável pelo job de testes do frontend.
- **Resultado:** `CI-CD/J4-Build-Frontend.Jenkinsfile` com quatro stages: configuração do Node.js via plugin `NodeJS-24`, instalação de dependências com `npm ci`, build de produção com `npm run build` e validação do artefato gerado.
- **Prompt (resumido):** pedi a criação do Jenkinsfile seguindo o padrão dos jobs já existentes no projeto, com o plugin correto e validando o diretório `.next` ao final.

## Testes de integração HTTP dos controllers (branch test/controller-player-skin)

- **Pedi:** testes de integração para a camada HTTP do `PlayerController` e do `SkinController`, cobrindo todos os endpoints e os cenários de erro mapeados no `GlobalExceptionHandler`.
- **Resultado:** `PlayerControllerTest.java` (9 testes) e `SkinControllerTest.java` (10 testes), usando `@WebMvcTest` com `@MockitoBean`. A suíte completa passou com 42 testes e 0 falhas, e a cobertura dos controllers saiu de 0% para 100% no JaCoCo.
- **Prompt (resumido):** pedi que a IA lesse os controllers, o handler de exceções e os DTOs antes de escrever qualquer código, e que rodasse os testes localmente para validar antes de commitar.
- **Ajuste:** o `pom.xml` estava sem a versão do Lombok fixada; a IA adicionou `1.18.36` para garantir compatibilidade com JDK 21.

## Hábitos de uso

- Peço planejamento antes de qualquer implementação; só autorizo a execução após validar o plano.
- Todo trabalho é feito em branch separada a partir da `homolog`; nunca direto na branch principal.
- Solicito que a IA rode os testes localmente e mostre o resultado antes de considerar a tarefa concluída.
- Commits são separados por responsabilidade (ex: fix de build separado dos testes).
