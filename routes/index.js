const routes = require('express').Router();
const temple = require('./temple');

routes.use('/temples', temple);
routes.get('/', (req, res) => {
  res.send({
    documentationURL: 'https://nathanbirch.github.io/nathan-byui-api-docs',
  });
});

module.exports = routes;
