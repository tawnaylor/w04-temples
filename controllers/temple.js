const { matchedData } = require('express-validator');
const db = require('../models');
const { HttpError } = require('../middleware/errors');

const Temple = db.temples;

const PUBLIC_FIELDS = {
  temple_id: 1,
  name: 1,
  location: 1,
  dedicated: 1,
  additionalInfo: 1,
  _id: 0,
};

exports.create = async (req, res) => {
  // #swagger.tags = ['Temples']
  // #swagger.summary = 'Create a temple'
  /* #swagger.parameters['body'] = {
        in: 'body',
        description: 'Temple to create',
        required: true,
        schema: { $ref: '#/definitions/Temple' }
  } */
  // #swagger.responses[201] = { description: 'Created', schema: { $ref: '#/definitions/Temple' } }
  // #swagger.responses[400] = { description: 'Validation failed' }
  // #swagger.responses[409] = { description: 'A temple with that temple_id already exists' }
  // #swagger.responses[500] = { description: 'Server error while creating the temple' }
  const fields = matchedData(req, { locations: ['body'] });
  if (await Temple.exists({ temple_id: fields.temple_id })) {
    throw new HttpError(
      409,
      `A temple with temple_id=${fields.temple_id} already exists`
    );
  }
  const data = await new Temple(fields).save();
  res.status(201).send(data);
};

exports.findAll = async (req, res) => {
  // #swagger.tags = ['Temples']
  // #swagger.summary = 'Get all temples'
  // #swagger.security = [{ "apiKey": [] }]
  // #swagger.responses[200] = { description: 'List of temples', schema: [{ $ref: '#/definitions/Temple' }] }
  // #swagger.responses[401] = { description: 'Invalid or missing API key' }
  // #swagger.responses[500] = { description: 'Server error while retrieving temples' }
  const data = await Temple.find({}, PUBLIC_FIELDS).sort({ temple_id: 1 }).lean();
  res.json(data);
};

exports.findOne = async (req, res) => {
  // #swagger.tags = ['Temples']
  // #swagger.summary = 'Get one temple by temple_id'
  // #swagger.security = [{ "apiKey": [] }]
  // #swagger.parameters['temple_id'] = { in: 'path', type: 'integer', description: 'Numeric temple_id to retrieve' }
  // #swagger.responses[200] = { description: 'The requested temple', schema: { $ref: '#/definitions/Temple' } }
  // #swagger.responses[400] = { description: 'temple_id must be a positive integer' }
  // #swagger.responses[401] = { description: 'Invalid or missing API key' }
  // #swagger.responses[404] = { description: 'No temple with that temple_id' }
  // #swagger.responses[500] = { description: 'Server error while retrieving the temple' }
  const { temple_id } = req.params;
  const data = await Temple.findOne({ temple_id }, PUBLIC_FIELDS).lean();
  if (!data) {
    throw new HttpError(404, `Not found Temple with temple_id=${temple_id}`);
  }
  res.send(data);
};

exports.update = async (req, res) => {
  // #swagger.tags = ['Temples']
  // #swagger.summary = 'Update a temple by temple_id'
  // #swagger.parameters['temple_id'] = { in: 'path', type: 'integer', description: 'Numeric temple_id to update' }
  /* #swagger.parameters['body'] = {
        in: 'body',
        description: 'Temple fields to update',
        required: true,
        schema: { $ref: '#/definitions/Temple' }
  } */
  // #swagger.responses[200] = { description: 'Success' }
  // #swagger.responses[400] = { description: 'Validation failed' }
  // #swagger.responses[404] = { description: 'No temple with that temple_id' }
  // #swagger.responses[500] = { description: 'Server error while updating the temple' }
  const { temple_id } = req.params;
  const updates = matchedData(req, { locations: ['body'] });
  const data = await Temple.findOneAndUpdate({ temple_id }, updates, {
    new: true,
    runValidators: true,
  });
  if (!data) {
    throw new HttpError(
      404,
      `Cannot update Temple with temple_id=${temple_id}. Temple was not found.`
    );
  }
  res.send({ message: 'Temple was updated successfully.' });
};

exports.delete = async (req, res) => {
  // #swagger.tags = ['Temples']
  // #swagger.summary = 'Delete a temple by temple_id'
  // #swagger.parameters['temple_id'] = { in: 'path', type: 'integer', description: 'Numeric temple_id to delete' }
  // #swagger.responses[200] = { description: 'Success' }
  // #swagger.responses[400] = { description: 'temple_id must be a positive integer' }
  // #swagger.responses[404] = { description: 'No temple with that temple_id' }
  // #swagger.responses[500] = { description: 'Server error while deleting the temple' }
  const { temple_id } = req.params;
  const data = await Temple.findOneAndDelete({ temple_id });
  if (!data) {
    throw new HttpError(
      404,
      `Cannot delete Temple with temple_id=${temple_id}. Temple was not found.`
    );
  }
  res.send({ message: 'Temple was deleted successfully!' });
};
