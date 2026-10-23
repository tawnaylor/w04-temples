require('dotenv').config();

const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
const { notFound, errorHandler } = require('./middleware/errors');

const app = express();

app
  .use(cors())
  .use(express.json())
  .use(express.urlencoded({ extended: true }))
  .use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))
  .use('/', require('./routes'))
  .use(notFound)
  .use(errorHandler);

module.exports = app;

if (require.main === module) {
  const db = require('./models');
  const PORT = process.env.PORT || 8080;

  if (!db.url) {
    console.error('MONGODB_URI is not set. Add it to your .env file.');
    process.exitCode = 1;
  } else {
    if (!process.env.API_KEY) {
      console.warn('API_KEY is not set. GET /temples routes will return 500.');
    }

    db.mongoose
      .connect(db.url)
      .then(() => {
        console.log('Connected to the database!');
        app.listen(PORT, () => {
          console.log(`Server is running on port ${PORT}.`);
        });
      })
      .catch((err) => {
        console.error('Cannot connect to the database!', err.message);
        process.exitCode = 1;
      });
  }
}
