## Prompt 1

```text
Instructions.md Leia todo esse arquivo e me pense em como vai começar.
```

## Prompt 2

```text
manda bala, me avise quando eu puder testar
```

## Prompt 3

```text
Me explica uma coisa? o que tem aqui:src\main\java\Inatel\C14\ProjetoCS

E o que tem aqui: src\main\java\com\rushbmarket ? qual a diferença, em qual trabalhou? posso apagar um deles?
```

## Prompt 4

```text
me explique agora o que tem dentro de cada arquivo .md? dentro da pasta BACKEND(raiz)?
```

## Prompt 5

```text
Preciso preparar o backend para funcionar tanto localmente quanto em produção. Analise o application.properties e me ajude a configurar as variáveis de ambiente necessárias para conexão com o banco de dados PostgreSQL, sem deixar credenciais sensíveis expostas no código.
```

## Prompt 6

```text
Quero publicar o backend do Rush-B-Market na Render. Analise a estrutura do projeto, o Dockerfile e as configurações do Spring Boot. Me oriente passo a passo para realizar o deploy, considerando que utilizamos Java 17, Spring Boot e PostgreSQL.
```

## Prompt 7

```text
Me ajude a configurar o banco PostgreSQL na Render e conectar o backend a ele. Explique como configurar a URL JDBC, usuário e senha através das variáveis de ambiente, sem compartilhar credenciais no repositório.
```

## Prompt 8

```text
O backend já foi publicado na Render. Quero validar se a aplicação iniciou corretamente, se conseguiu estabelecer conexão com o banco de dados e se o endpoint /actuator/health está respondendo. Analise os logs e me oriente sobre como verificar cada etapa.
```

## Prompt 9

```text
Vamos validar os testes automatizados do backend antes de configurar a integração contínua. Analise os testes existentes e me ajude a executar a suíte com Maven, verificar os resultados e gerar o relatório de cobertura utilizando JaCoCo.
```

## Prompt 10

```text
Me ajude a validar a construção da imagem Docker do backend. Quero entender o funcionamento do Dockerfile, executar o build localmente e verificar se a aplicação está preparada para ser executada em um container.
```

## Prompt 11

```text
Preciso organizar as alterações realizadas no backend utilizando Git. Me oriente na criação de uma branch específica para as configurações de ambiente, revisão das alterações, commits, push e abertura de Pull Request para a branch main. Quero evitar enviar credenciais ou arquivos desnecessários.
```

## Prompt 12

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

## Prompt 13

```text
Preciso instalar e configurar o Jenkins na WSL do Windows. Antes de iniciar a instalação, verifique o ambiente disponível, a distribuição Linux, a versão do Java, a integração com o Docker Desktop e os recursos necessários para executar a pipeline CI/CD do Rush-B-Market.

Quero realizar a configuração passo a passo, entendendo cada comando executado e validando cada etapa antes de prosseguir.
```

## Prompt 14

```text
Analise a melhor maneira de integrar o Jenkins ao deploy já realizado na Render. Quero que o Jenkins execute os testes e, somente se tudo passar, acione o deploy por meio de um Deploy Hook da Render.

Explique como armazenar o Deploy Hook com segurança nas credenciais do Jenkins e como realizar uma verificação de saúde da aplicação após a publicação.
```

## Prompt 15

```text
Estou configurando o Jenkins para o projeto Rush-B-Market utilizando WSL Ubuntu e Docker Desktop no Windows.

Analise os problemas apresentados durante a configuração dos jobs e me ajude a:
- Configurar corretamente JDK, Maven e Node.js nas ferramentas do Jenkins;
- Configurar o repositório GitHub e as credenciais necessárias;
- Configurar os caminhos dos Jenkinsfiles;
- Entender os erros apresentados no Console Output;
- Garantir que o workspace seja limpo após cada execução.

Explique os procedimentos e os comandos necessários, validando cada etapa.
```

## Prompt 16

```text
Analise a estrutura do monorepo Rush-B-Market e me ajude a implementar um pipeline de CI no Jenkins que contemple Backend e Frontend.

O pipeline deve permitir:
- Executar testes automatizados do Backend com Maven e JUnit;
- Executar testes automatizados do Frontend;
- Gerar relatórios de testes;
- Gerar e publicar a cobertura do Backend com JaCoCo;
- Realizar os builds de produção;
- Permitir selecionar qual parte do projeto será executada;
- Permitir selecionar o modo de execução.

Quero uma solução organizada, com stages independentes e tratamento adequado de falhas.
```

## Prompt 17

```text
Quero consolidar o pipeline de CD do Rush-B-Market utilizando Jenkins.

Considere que:
- O Backend está publicado na Render;
- O Frontend está publicado na Vercel;
- As credenciais devem ser armazenadas no Jenkins;
- O CD deve ser iniciado somente após o CI terminar com sucesso na branch main;
- O Backend deve ser validado pelo endpoint /actuator/health;
- O Frontend deve ser validado por uma requisição HTTP.

Analise os Jenkinsfiles existentes e proponha uma implementação que publique as duas aplicações, permita selecionar qual projeto será implantado e valide o resultado de cada publicação.
```

## Prompt 18

```text
Analise a implementação de CI/CD do Rush-B-Market considerando o critério de avaliação do professor.

O deploy precisa deixar a aplicação efetivamente executando e acessível fora do Jenkins. Apenas publicar uma imagem Docker em um registry não atende ao requisito.

Avalie nossa estratégia de publicação e me ajude a validar:
- Onde a aplicação será executada;
- Como ficará acessível externamente;
- Como o Jenkins iniciará a publicação;
- Como será feita a verificação de disponibilidade após o deploy.

Quero garantir que a solução cumpra o requisito de entrega contínua.
```

## Prompt 19

```text
Quero configurar a integração entre GitHub e Jenkins para que novos commits e pushes disparem automaticamente o pipeline de CI.

O Jenkins está instalado na WSL e não possui um endereço público permanente. Estou utilizando ngrok para disponibilizar temporariamente o serviço.

Me ajude a:
- Configurar o webhook no GitHub;
- Configurar o endpoint de recebimento de eventos do Jenkins;
- Validar se as notificações estão chegando;
- Investigar falhas de entrega;
- Entender o comportamento do webhook quando o ngrok é reiniciado;
- Verificar como reenviar eventos que falharam.
```

## Prompt 20

```text
Estou realizando refatorações no Backend do Rush-B-Market como parte de uma atividade acadêmica de Engenharia de Software.

Analise os serviços PlayerService e SkinService e identifique oportunidades de melhoria relacionadas a código duplicado.

Quero aplicar a técnica Extract Method para centralizar as buscas de entidades por ID e o tratamento das exceções correspondentes.

Explique:
- Qual é o code smell identificado;
- Por que a alteração caracteriza uma refatoração;
- Como extrair os métodos sem modificar o comportamento;
- Quais testes devem ser executados para garantir que nada foi quebrado.

Preserve as mensagens das exceções e as regras de negócio existentes.
```

## Prompt 21

```text
Estou trabalhando no repositório Rush-B-Market e preciso organizar minhas alterações utilizando boas práticas de Git.

Me ajude a:
- Atualizar a branch main local;
- Criar branches específicas para cada atividade;
- Verificar alterações antes de realizar commits;
- Criar mensagens de commit padronizadas;
- Fazer push e abrir Pull Requests;
- Atualizar o README com as alterações realizadas;
- Documentar refatorações, pipelines e atividades de desenvolvimento.

Oriente os comandos considerando meu ambiente Windows com PowerShell e Git.
```

## Prompt 22

```text
como abandono alteração local e faço pull?
```

## Prompt 23

```text
preciso limpar meu local e pegar a main atualizada, me ajuda?
```

## Prompt 24

```text
esse é meu histórico de prompts, registre atambém nossas conversas e me disponibilize o arquivo pra download. quero que mantenha também somente prompts, nada mais alem disso
```
