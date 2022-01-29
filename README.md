# Sobre o projeto
 Primeiro projeto avaliativo do segundo módulo(Backend) do curso do DEVInhouse(SENAI).
 O Projeto consiste na elaboração de um api simples(Conta365) de CRUD em dados de usuários e dados financeiros associados a esses usuários, em um banco de dados falso(Dois arquivos JSON), utilizando NodeJS (Com expressJS) entre outras libs do node.
 
 # Instruções para rodar o Projeto.
* Basta clonar, ou fazer donwload deste repositório, e com o Node devidamente instalado, 
* Execute o comando(no terminal de sua preferência) **npm install -y** no diretório raiz deste  projeto. 
* Após concluir a instalação, mantendo-se no diretório raiz do projeto, execute o comando **npm start**. 
* Na sequencia da confirmação da execução do servidor no terminal, que está configurado para rodar na porta 5555, é póssivel gerar a documentação do swagger com o comando **npm run swagger-autogen**
* É possível testar os endpoints através da interface do swagger no browser, que pode ser acessada através do endereço **http://localhost:5555/api-docs/**
* OU os endpoints podem ser testados através de ferramentas cliente API REST como o [INSOMNIA](https://insomnia.rest/download), por exemplo.

## Observações:

* Na pasta assets há arquivos de exemplo para inseração de dados financeiros por arquivos xlsx.
* No controllers e no route de usuários há um endpoint comentando, pronto, para povoação do banco de dados falso
* O serviço está originalmente configurado para rodar na porta 5555


# Tecnologias utilizadas:
#### NodeJS 16.13.1
#### ExpressJS ^4.17.2
#### Swagger ^2.18.8
#### Multer 1.4.4
#### Nodemon ^2.0.15
