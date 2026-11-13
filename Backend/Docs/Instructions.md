## Vamos lá, preciso construir o um projeto Java + Spring boot, basicamente a stack do projeto será essa que passamos para o nosso monitor da disciplina :
Ideia do projeto: {O que vão fazer, principais funcionalidades da aplicação, quais tecnologias vão utilizar (desenvolvimento, gerenciamento de dependências e testes) e se será mono repo ou não.
Grupo: 4 a 6 membros. Nomes e github de cada um, e a função de cada membro no grupo}

Principais funcionalidades da aplicação:
Integração com API externa de CS para buscar e popular o catálogo de skins.
CRUD completo de skins armazenadas no banco de dados local.
Sistema de carteira virtual para controle de saldo do usuário.
Fluxo de compra, debitando o valor em conta e transferindo a skin para o inventário do usuário.
Visualização e gerenciamento do inventário pessoal do cliente.


Stack do projeto:
Mono-repo
Backend: Java com Spring Boot.
SGBD: PostgreSQL 
Frontend: Next.js (React).
Gerenciamento de dependências: Maven (Backend) e npm/yarn (Frontend).
Testes (QA): JUnit para testes unitários e Karate para testes de API/integração.
CI/CD: Jenkins e Docker para automação de build e deploy.
Documentação: Swagger (OpenAPI).



Grupo: 
Bruno Alvarenga[Product Owner](Backend/QA) - https://github.com/brunoquirino14
Bruce Alvarenga(Backend/QA) - https://github.com/BruceBrAlva/
Samuel Ribeiro(Backend/Devops) - https://github.com/Samu-TimRib 
Gabriel Pivoto(Front-end/QA) - https://github.com/GPivoto
Luís Teles(Front-end/Devops) - https://github.com/LuisTeles
André Araújo(Frond-end/Devops) -  https://github.com/Alves-Araujo

Precisamos ter algo funcional já, para isso, fizemos esse esboço de banco de dados:
Table Skins {
  id integer [primary key]
  name varchar
  float varchar
  price double
  rarity varchar
  player_id integer [note: 'Chave estrangeira apontando para o dono da skin']
}
 
Table Players {
  id integer [primary key]
  email varchar
  password varchar
  created_at timestamp
}
 
// Relacionamento: 1 Player tem N Skins (Skins > Players)
Ref: Skins.player_id > Players.id

Pensamos melhor e não vamos mais fazer conexão com a API por hora, vamos popular o banco com valores fictícios.
A ideia do projeto é começarmos com um crud funcional. vamos subir o banco de dados em um container. 
Use como base esse projeto: PokeFerasAPI que está na raiz da pasta.
essas são as regras de negócio que estamos pensando:

1 - Um player não pode ter skin igual
2 - Um player pode ter no máximo 5 skins
3 - Um player não pode ter mais de uma skin da mesma arma

Me diga o que pensa em fazer. Pois quero o projeto funcional hoje, pelo menos a parte do crud.

Não pense em fazer os teste unitários por hora, pois é algo que faremos no futuro
