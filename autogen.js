const swaggerAutogen = require('swagger-autogen')({ openapi: '3.0.0' });
const options = {
  info: {
    title: 'PlayBridge API',
    description: 'API for PlayBridge',
  },
  servers: [
    {
      url: 'http://braininavet.iptime.org:3000',
      description: 'Test Server'
    }
  ],
  schemes: ['http'],
  securityDefinitions: {
    AccessToken: {
      type: 'apiKey',
      in: 'header',
      name: 'X-Access-Token',
    },
    RefreshToken: {
      type: 'apiKey',
      in: 'header',
      name: 'X-Refresh-Token',
    }
  },
};

const outputFile = './api-docs/swagger-output.json';
const endpointsFiles = ['./src/controllers/*.ts', './app.ts'];
swaggerAutogen(outputFile, endpointsFiles, options);
