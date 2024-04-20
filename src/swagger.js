const swaggerJSDoc = require("swagger-jsdoc");
const path = require("path");

const swaggerOptions = {
  swaggerDefinition: {
    info: {
      title: "Routes Microservice API",
      version: "1.0.0",
      description: "Route Microservice API Documentation",
    },
  },
  apis: [path.join(__dirname, "./interface_adapters/routes/*.js")],
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

module.exports = swaggerSpec;
