# Histórico de Prompts - Rush-B-Market API

---

## Prompt 1

```text
Instructions.md Leia todo esse arquivo e me pense em como vai começar.
```

---

## Prompt 2

```text
manda bala, me avise quando eu puder testar
```

---

## Prompt 3

```text
Me explica uma coisa? o que tem aqui:src\main\java\Inatel\C14\ProjetoCS

E o que tem aqui: src\main\java\com\rushbmarket ? qual a diferença, em qual trabalhou? posso apagar um deles?
```

---

## Prompt 4

```text
me explique agora o que tem dentro de cada arquivo .md? dentro da pasta BACKEND(raiz)?
```

---

## Prompt 5 — Configuração das variáveis de ambiente

```text
Preciso preparar o backend para funcionar tanto localmente quanto em produção. Analise o application.properties e me ajude a configurar as variáveis de ambiente necessárias para conexão com o banco de dados PostgreSQL, sem deixar credenciais sensíveis expostas no código.
```

---

## Prompt 6 — Preparação do deploy

```text
Quero publicar o backend do Rush-B-Market na Render. Analise a estrutura do projeto, o Dockerfile e as configurações do Spring Boot. Me oriente passo a passo para realizar o deploy, considerando que utilizamos Java 17, Spring Boot e PostgreSQL.
```

---

## Prompt 7 — Configuração do PostgreSQL na Render

```text
Me ajude a configurar o banco PostgreSQL na Render e conectar o backend a ele. Explique como configurar a URL JDBC, usuário e senha através das variáveis de ambiente, sem compartilhar credenciais no repositório.
```

---

## Prompt 8 — Validação do deploy

```text
O backend já foi publicado na Render. Quero validar se a aplicação iniciou corretamente, se conseguiu estabelecer conexão com o banco de dados e se o endpoint /actuator/health está respondendo. Analise os logs e me oriente sobre como verificar cada etapa.
```

---

## Prompt 9 — Testes automatizados

```text
Vamos validar os testes automatizados do backend antes de configurar a integração contínua. Analise os testes existentes e me ajude a executar a suíte com Maven, verificar os resultados e gerar o relatório de cobertura utilizando JaCoCo.
```

---

## Prompt 10 — Validação do Docker

```text
Me ajude a validar a construção da imagem Docker do backend. Quero entender o funcionamento do Dockerfile, executar o build localmente e verificar se a aplicação está preparada para ser executada em um container.
```

---

## Prompt 11 — Organização do Git e Pull Requests

```text
Preciso organizar as alterações realizadas no backend utilizando Git. Me oriente na criação de uma branch específica para as configurações de ambiente, revisão das alterações, commits, push e abertura de Pull Request para a branch main. Quero evitar enviar credenciais ou arquivos desnecessários.
```

---

## Prompt 12 — Planejamento do CI/CD com Jenkins

```text
Quero implementar uma pipeline CI/CD utilizando Jenkins para o Rush-B-Market. Considere que o projeto utiliza Java 17, Maven, Spring Boot, Docker e PostgreSQL, e que o backend já está publicado na Render.

A pipeline deverá contemplar:
- Build da aplicação;
- Execução dos testes automatizados;
- Geração e apresentação do relatório de cobertura;
- Deploy da aplicação na Render somente quando as etapas anteriores forem concluídas com sucesso;
- Verificação da disponibilidade da aplicação após o deploy.

Analise também os arquivos de referência Jenkinsfile.ci, Jenkinsfile.cd e docker-compose.cd.yml. Utilize-os como referência conceitual, adaptando a solução à arquitetura real do Rush-B-Market, sem copiar configurações de outros projetos que não se aplicam ao nosso cenário.

Não utilize GitHub Actions, pois o projeto exige Jenkins.
```

---

## Prompt 13 — Preparação do ambiente Jenkins na WSL

```text
Preciso instalar e configurar o Jenkins na WSL do Windows. Antes de iniciar a instalação, verifique o ambiente disponível, a distribuição Linux, a versão do Java, a integração com o Docker Desktop e os recursos necessários para executar a pipeline CI/CD do Rush-B-Market.

Quero realizar a configuração passo a passo, entendendo cada comando executado e validando cada etapa antes de prosseguir.
```

---

## Prompt 14 — Planejamento da integração com a Render

```text
Analise a melhor maneira de integrar o Jenkins ao deploy já realizado na Render. Quero que o Jenkins execute os testes e, somente se tudo passar, acione o deploy por meio de um Deploy Hook da Render.

Explique como armazenar o Deploy Hook com segurança nas credenciais do Jenkins e como realizar uma verificação de saúde da aplicação após a publicação.
```

---

**Fim do histórico de prompts.**