const routes = require('express').Router();
const temples = require('../controllers/temple.js');
const {
  validateTempleId,
  validateCreate,
  validateUpdate,
} = require('../middleware/validate');
const {
  asyncHandler,
  requireApiKey,
} = require('../middleware/errors');

routes.get('/', requireApiKey, asyncHandler(temples.findAll));
routes.get(
  '/:temple_id',
  requireApiKey,
  validateTempleId,
  asyncHandler(temples.findOne)
);

routes.post('/', validateCreate, asyncHandler(temples.create));
routes.put(
  '/:temple_id',
  validateUpdate,
  asyncHandler(temples.update)
);
routes.delete(
  '/:temple_id',
  validateTempleId,
  asyncHandler(temples.delete)
);

module.exports = routes;
