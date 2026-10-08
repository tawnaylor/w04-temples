const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'Temple API',
    description: 'LDS Temple API for CSE 341 (Swagger documentation activity)',
  },
  host: 'localhost:8080',
  schemes: ['http'],
  securityDefinitions: {
    apiKey: {
      type: 'apiKey',
      in: 'header',
      name: 'apiKey',
      description: 'API key required by the temple read routes',
    },
  },
  definitions: {
    Temple: {
      temple_id: 1,
      name: 'Aba Nigeria Temple',
      location: 'Aba, Abia, Nigeria',
      dedicated: '7 August 2005',
      additionalInfo: false,
    },
  },
};

const outputFile = './swagger.json';
const endpointsFiles = ['./routes/index.js'];

swaggerAutogen(outputFile, endpointsFiles, doc);