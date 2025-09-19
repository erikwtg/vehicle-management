# Vehicle Management Platform

![GitHub](https://img.shields.io/github/license/erikwtg/vehicle-management)
![Docker](https://img.shields.io/badge/Docker-✓-blue)
![Node.js](https://img.shields.io/badge/Node.js-✓-green)
![NestJS](https://img.shields.io/badge/NestJS-✓-green)
![TypeScript](https://img.shields.io/badge/TypeScript-✓-blue)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-✓-blue)
![Redis](https://img.shields.io/badge/Redis-✓-red)
![RabbitMQ](https://img.shields.io/badge/RabbitMQ-✓-orange)
![Angular.js](https://img.shields.io/badge/Angular.js-✓-purple)

## O projeto foi feito com a estrutura em containers Docker e é estruturado como um monorepo. Este projeto inclui vários serviços interconectados, como uma API, um broker de mensagens (RabbitMQ), um banco de dados PostgreSQL, e um frontend. Abaixo estão as instruções para configurar e rodar o ambiente de desenvolvimento.

## Tecnologias Utilizadas

- **Node.js** e **Nest.js** e **TypeScript** para o desenvolvimento da API.
- **PostgreSQL** como banco de dados.
- **Redis** como cache.
- **RabbitMQ** para gerenciamento de filas de mensagens.
- **Angular.js** no frontend (WebApp).
- **Docker** e **Docker Compose** para facilitar a execução de todos os serviços em containers.
- **Monorepo** para organizar múltiplos serviços no mesmo repositório.

## Estrutura do Projeto

O projeto segue uma estrutura de monorepo, com cada serviço dentro de uma pasta separada. Abaixo está a lista de serviços incluídos:

- **server**: API backend RESTful.
- **vehicles-microservice**: Microserviço backend para gerenciamento de veículos.
- **webapp**: Frontend da aplicação.

## Requisitos

- **Docker** (com Docker Compose) instalado.
- **Node.js**

## Instalação e Execução

### 1. Clonar o Repositório

Primeiro, clone este repositório para sua máquina local:

```bash
git clone https://github.com/erikwtg/vehicle-management.git
cd vehicle-management
```

### 2. Construção e Execução em Modo Desenvolvimento

O projeto já possui um arquivo docker-compose.yml configurado para orquestrar os serviços.

### 3. Build e Start dos Containers

Para rodar os serviços em modo desenvolvimento, execute o seguinte comando:

```bash
./deployment.sh
```

ou

```bash
docker network create vehicle_management_network

docker-compose -f docker-compose.yml up -d --build
```

Esse comando irá:
Criar a rede vehicle_management_network.

Construir os containers necessários.

Rodar os serviços na porta configuradas no docker-compose.yml.

Criar o banco de dados PostgreSQL.

Inicializar os serviços RabbitMQ e o consumo das filas.

### ARQUITETURA

- **Broker de Mensagens (RabbitMQ)**: Utilizado para gerenciar e processar as requisições entre microserviços.
- **Circuit Breaker Opossum**: Utilizado para gerenciar chamadas a serviços externos, prevenindo cascata de falhas.
- **Idempotência**: Para garantir que as requisições idempotentes sejam processadas apenas uma vez, mesmo em caso de falhas ou retentativas.

## Acesso às Aplicações

Depois de executar o comando de inicialização, você pode acessar as aplicações através dos seguintes endereços:

- **WebApp**: http://localhost:4200
- **API**: http://localhost:3000
- **RabbitMQ**: http://localhost:15672
- **PostgreSQL**: http://localhost:5432

## Funcionalidades Implementadas

- Cadastro de veículos.
- Listagem de veículos.
- Edição de veículos.
- Exclusão de veículos.

## Melhorias (Coisas que gostaria de ter feito)

Embora o projeto tenha sido desenvolvido com as melhores práticas disponíveis dentro do tempo e dos requisitos do desafio, há algumas melhorias que gostaria de ter implementado:

### SERVER

1. Utilizar .env para configuração de variáveis de ambiente
2. Testes Unitários: Gostaria de melhorar a implementação dos testes unitários, garantindo uma cobertura mais abrangente e a confiança na estabilidade do sistema.
3. Observabilidade: A inclusão de logs e métricas mais detalhadas ajudaria a entender melhor o comportamento da aplicação.
4. Tratamento de Erros e Validações: Embora o tratamento de erros no backend tenha sido abordado, gostaria de ter implementado uma validação de dados mais robusta e um sistema de feedback mais amigável para o usuário final.
5. Validação de entrada de dados: Gostaria de ter implementado uma melhor validação de dados utilizando lib como zod para ter uma validação mais robusta.
6. Gostaria também de ter implementado uma estrutura de login para autenticação de usuários.
7. Documentação: Gostaria de ter documentado usando Swagger ou similar, facilitando a compreensão e o uso por parte de desenvolvedores e consumidores da API.

## Tecnologias e Estruturas Utilizadas

A escolha das tecnologias e das estruturas foi feita com base no desafio proposto.

1. Node.js e TypeScript com NestJS: foi escolhido pela sua performance e pela familiaridade com o ecossistema JavaScript. É uma tecnologia excelente suporte para APIs assíncronas e alto desempenho em sistemas que exigem escalabilidade.

2. PostgreSQL: foi escolhido por ser uma base de dados relacional, garantindo a consistência e a integridade dos dados.

3. RabbitMQ: foi escolhido para gerenciar as filas de mensagens, permitindo que o projeto seja escalável e flexível de acordo com a característica do projeto.

4. Redis: foi escolhido como cache utilizado na implementação de idempotência para melhorar o desempenho da aplicação, reduzindo a carga no banco de dados.

5. Angular.js: pela especificidade do projeto e pela sua performance.

6. Docker e Docker Compose: foi escolhido para facilitar a execução de todos os serviços em containers.

7. Monorepo: foi escolhido para organizar todos os serviços em um único repositório, facilitando a manutenção e o desenvolvimento.
