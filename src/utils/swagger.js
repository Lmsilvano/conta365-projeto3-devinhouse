const swaggerAutogen = require('swagger-autogen')()

const doc = {
    info: {
        title: 'Documentação Conta365',
        description: 'Documentação do projeto de API Conta365, executado como projeto avaliativo do curso de Full Stack Web Developer do DEVinHouse(SENAI).',
    },
    host: 'localhost:5555',
    schemes: ['http'],
};

const outputFile = './src/swagger_output.json';
const endpointsFiles = ['./src/server.js'];


swaggerAutogen(outputFile, endpointsFiles, doc);