# Controle de Ponto para Funcionários – Aplicação Web

## 📌 Sobre o Projeto

Este projeto tem como objetivo criar uma aplicação web simples e funcional para gerenciar o registro de ponto dos funcionários de uma empresa.

A aplicação permite o cadastro de dados dos funcionários e o registro dos horários de entrada, saída para almoço, retorno e fim de expediente. Para simular uma API REST, foi utilizado o `json-server`, que permite realizar requisições como `POST`, `GET`, entre outras, com dados em formato JSON.

## 🧭 Estrutura da Página

A aplicação é dividida em duas áreas principais:

### 📋 Cadastro de Funcionários

Permite preencher informações como:

- Nome
- E-mail
- Cargo
- Departamento
- Data de admissão

A aplicação faz validações para garantir o preenchimento correto dos campos obrigatórios.

### ⏱️ Registro de Ponto

Após o cadastro do funcionário, é possível registrar seus horários de:

- Entrada
- Saída para almoço
- Retorno
- Fim do expediente

É possível escolher a **data**, **hora** e o **local** (presencial ou remoto).

## 🛠️ Tecnologias Utilizadas

- **HTML5** – Estrutura da página  
- **CSS3** – Estilização dos elementos e formulários  
- **JavaScript (ES6+)** – Lógica de funcionamento e comunicação com a API  
- **json-server** – Simulação de API RESTful local  
- **JSON** – Formato dos dados

## 🚀 Como Executar o Projeto

1. Clone o repositório ou baixe os arquivos:

```bash
git clone https://github.com/paulorribeirojr/RegistrodePonto
```

2. Instale o `json-server` (caso ainda não tenha):

```bash
npm install -g json-server
```

3. Crie ou edite o arquivo `db.json` com os dados iniciais (ou use o fornecido no projeto).

4. Inicie o servidor local com o comando:

```bash
json-server --watch db.json --port 3000
```

5. Abra o arquivo `index.html` em seu navegador.  
   ⚠️ Recomenda-se o uso da extensão **Live Server** no VS Code para evitar problemas de CORS.

> Nenhuma autenticação é necessária para utilizar o sistema.

## 💡 Considerações Finais

Durante o desenvolvimento, enfrentei desafios especialmente na validação dos formulários e na comunicação com a API simulada. O projeto me permitiu praticar a organização de código com JavaScript moderno e a criação de componentes reutilizáveis, como as classes `Funcionario` e `RegistroPonto`.

### 🔮 Melhorias Futuras

- Autenticação de usuários  
- Painel com visualização dos registros em tempo real  
- Interface responsiva para dispositivos móveis

---
