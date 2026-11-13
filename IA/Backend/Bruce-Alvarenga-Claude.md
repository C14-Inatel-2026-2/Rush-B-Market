# Uso de IA — Bruce Alvarenga

**Ferramentas:** Claude Code e Claude (chat), modelo Claude Opus

## Testes do SkinService e do SkinMapper (PR #33)

- **Pedi:** testes unitários de consulta e remoção do SkinService e de conversão do SkinMapper.
- **Resultado:** `SkinServiceQueryTest.java` e `SkinMapperTest.java`.
- **Prompt:** "Pode tirar os comentários, por favor? Isso é uma conduta errada de engenharia de software. Esse código tem que ser profissional."

## Cobertura de testes com JaCoCo e job J3 (PR #53)

- **Pedi:** implementar a issue #48 — Cobertura de testes.
- **Resultado:** plugin JaCoCo no `Backend/pom.xml` e `CI-CD/J3-Cobertura-Backend.Jenkinsfile`.
- **Prompt (resumido):** pedi para ler a issue #48, implementar seguindo os padrões do projeto e confirmar se a minha etapa estava concluída.
- **Ajuste:** pedi para remover os comentários que a IA colocou no `pom.xml` e no Jenkinsfile.

## Avaliação do projeto com o agente "professor"

- **Pedi:** uma avaliação do projeto comparando com o enunciado e os slides da disciplina.
- **Resultado:** lista de pendências da entrega (pipeline completo, cobertura publicada, seções do README da NP2, main desatualizada).
- **Prompts:** "Use o professor para avaliar o projeto." / "Roda ele sobre a homolog, para somente ler a homolog e não alterar literalmente NADA."
- **Descartado:** a primeira avaliação, porque leu a `main` local, que estava desatualizada; refeita sobre a `homolog`, só em modo leitura.

## História de usuário US-02 — Cadastrar um jogador

- **Pedi:** a US-02 no mesmo formato da US-01 (Consultar skins).
- **Resultado:** história com regras de negócio e critérios de aceite em "Dado que / quando / então".
- **Prompt:** "Com os dados que você já tem do meu projeto Rush B Market de outros chats, me ajuda a criar a história de usuário para o Rush B Market: US-02 — Cadastrar um jogador. Usa isso como base." (com a US-01 colada como modelo)

## Refactoring dos testes do SkinService (PR #66)

- **Pedi:** um refactoring para remover a criação de skins repetida nos testes.
- **Resultado:** método auxiliar `novaSkin` no `SkinServiceQueryTest.java`.
- **Prompt:** "Me ajuda a fazer os 2 refactorings."

## Refactoring do SkinService (PR #67)

- **Pedi:** extrair as validações do `addSkinToPlayer` em métodos e abrir o PR sem commitar direto na homolog.
- **Resultado:** `findPlayerOrThrow`, `validateSkinLimit`, `validateUniqueName` e `validateUniqueWeapon` no `SkinService.java`.
- **Prompt:** "Eu tenho que abrir uma PR, nunca jogar direto na HOMOLOG igual da última vez. Me ajuda a fazer isso: criar uma branch para o refactor, para não dar problema."

## Agentes criados (Claude Code)

- **professor** (`.claude/agents/professor.md`): avalia o projeto comparando com o enunciado e os slides de C14. Só tem ferramentas de leitura, sem permissão para alterar arquivos.
