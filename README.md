# API de Marcação de Consultas - Documentação

## Tecnologias Utilizadas

- **Linguagens:** Node.js + Express.

- **Gerenciamento de banco:** MongoDb com Mongoose

- **JWT para Autenticação:** JSON Web Token.

## Instalação e Execução

⚠️ **Atenção: Antes de prosseguir, certifique-se de ter o Node, npm, MongoDb e Mongosh instalados em sua máquina.**

1. Clone o projeto na sua máquina.

2. Entre na pasta do projeto.

3. rode "npm install" para instalar as dependencias

4. abra o terminal e rode 'mongosh' para interagir com o banco de dados e em seguida rode 'use desafio-backend' para criar o banco

5. rode 'npm start dev' para iniciar o projeto

## Rotas Disponíveis

### Usuários

- **POST /users/register**

  - Registra um novo usuário.
  - **Exemplo de Entrada:**
    {
    "name": "Miguel Angelo",
    "email": "miguel@gmail.com",
    "password": "senha",
    "confirmpassword": "senha"
    }
  - **Exemplo de Resposta:**
    {
    message: "Autenticado",
    token,
    userId,
    }

- **POST /users/login**

  - Realiza o login de um usuário.
  - **Exemplo de Entrada:**
    {
    "email": "miguel@gmail.com",
    "password": "senha",
    }
  - **Exemplo de Resposta:**
    {
    message: "Autenticado",
    token,
    userId,
    }

    - **GET /users/user/:id**

  - Recebe usuario pelo id.
  - **Exemplo de Resposta:**
    {
    user
    }

    - **GET /users/checkuser**

  - Recebe usuario autenticado.
  - **Exemplo de Resposta:**
    {
    user
    }

    ### Consultas

    - **POST /appointments/create**

  - Cria uma novo consulta.
  - **Exemplo de Entrada:**
    {
    "time": "13:00",
    "date": "01/13",
    "description": "consulta médica"
    }

    - **GET /appointments/myappointments**

  - Retorna consultas do usuario registrado.

    - **GET /appointments/createlink/:appointmentId**

  - Cria link criptografado de acesso único para ver dados da consulta.
  - **Exemplo de Saida:**
    {
    link
    }

    - **GET /appointments/getappointment/:token**

  - Retorna dados da consulta atravez do token criptografado de acesso unico.
  - **Exemplo de Saida:**
    {
    consulta
    }

    - **GET /appointments/getappointment/:token**

  - Retorna dados da consulta atravez do token criptografado de acesso unico.
  - **Exemplo de Saida:**
    {
    consulta
    }

  - **DELETE /appointments/delete/:id**

  - Deleta consulta.

  - **PATCH /appointments/update/:id**

  - Edita consulta.
  - **Exemplo de Entrada:**
    {
    "time": "13:00",
    "date": "01/13",
    "description": "consulta médica"
    }
