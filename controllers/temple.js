const db = require('../models');
const Temple = db.temples;

const apiKey =
  'Ezl0961tEpx2UxTZ5v2uKFK91qdNAr5npRlMT1zLcE3Mg68Xwaj3N8Dyp1R8IvFenrVwHRllOUxF0Og00l0m9NcaYMtH6Bpgdv7N';

exports.create = (req, res) => {
  // #swagger.tags = ['Temples']
  // #swagger.summary = 'Create a temple'
  /* #swagger.parameters['body'] = {
        in: 'body',
        description: 'Temple to create',
        required: true,
        schema: { $ref: '#/definitions/Temple' }
  } */
  // #swagger.responses[200] = { description: 'Success', schema: { $ref: '#/definitions/Temple' } }
  // #swagger.responses[400] = { description: 'Temple name is required' }
  // #swagger.responses[500] = { description: 'Server error while creating the temple' }
  // Validate request
  if (!req.body.name) {
    res.status(400).send({ message: 'Content can not be empty!' });
    return;
  }

  // Create a Temple
  const temple = new Temple({
    temple_id: req.body.temple_id,
    name: req.body.name,
    location: req.body.location,
    dedicated: req.body.dedicated,
    additionalInfo: req.body.additionalInfo,
  });
  // Save Temple in the database
  temple
    .save()
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || 'Some error occurred while creating the Temple.',
      });
    });
};

exports.findAll = (req, res) => {
  // #swagger.tags = ['Temples']
  // #swagger.summary = 'Get all temples'
  // #swagger.security = [{ "apiKey": [] }]
  /* #swagger.parameters['apiKey'] = {
        in: 'header',
        description: 'API key required to read temples',
        required: true,
        type: 'string'
  } */
  // #swagger.responses[200] = { description: 'List of temples', schema: [{ $ref: '#/definitions/Temple' }] }
  // #swagger.responses[401] = { description: 'Invalid or missing API key' }
  // #swagger.responses[500] = { description: 'Server error while retrieving temples' }
  if (req.header('apiKey') === apiKey) {
    Temple.find(
      {},
      {
        temple_id: 1,
        name: 1,
        location: 1,
        dedicated: 1,
        additionalInfo: 1,
        _id: 0,
      }
    )
      .then((data) => {
        res.send(data);
      })
      .catch((err) => {
        res.status(500).send({
          message:
            err.message || 'Some error occurred while retrieving temples.',
        });
      });
  } else {
    res.status(401).send('Invalid apiKey, please read the documentation.');
  }
};

// Find a single Temple with an id
exports.findOne = (req, res) => {
  // #swagger.tags = ['Temples']
  // #swagger.summary = 'Get one temple by temple_id'
  // #swagger.security = [{ "apiKey": [] }]
  /* #swagger.parameters['apiKey'] = {
        in: 'header',
        description: 'API key required to read temples',
        required: true,
        type: 'string'
  } */
  // #swagger.parameters['temple_id'] = { in: 'path', type: 'integer', description: 'Numeric temple_id to retrieve' }
  // #swagger.responses[200] = { description: 'The requested temple', schema: { $ref: '#/definitions/Temple' } }
  // #swagger.responses[404] = { description: 'No temple with that temple_id' }
  // #swagger.responses[401] = { description: 'Invalid or missing API key' }
  // #swagger.responses[500] = { description: 'Server error while retrieving the temple' }
  const temple_id = req.params.temple_id;
  if (req.header('apiKey') === apiKey) {
    Temple.find({ temple_id: temple_id })
      .then((data) => {
        if (!data || data.length === 0)
          res
            .status(404)
            .send({ message: 'Not found Temple with id ' + temple_id });
        else res.send(data[0]);
      })
      .catch((err) => {
        res.status(500).send({
          message: 'Error retrieving Temple with temple_id=' + temple_id,
        });
      });
  } else {
    res.status(401).send('Invalid apiKey, please read the documentation.');
  }
};

exports.update = (req, res) => {
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
  // #swagger.responses[400] = { description: 'Request body is empty' }
  // #swagger.responses[404] = { description: 'No temple with that temple_id' }
  // #swagger.responses[500] = { description: 'Server error while updating the temple' }
  if (!req.body || Object.keys(req.body).length === 0) {
    return res.status(400).send({
      message: 'Data to update can not be empty!',
    });
  }

  const temple_id = req.params.temple_id;

  Temple.findOneAndUpdate({ temple_id: temple_id }, req.body)
    .then((data) => {
      if (!data) {
        res.status(404).send({
          message: `Cannot update Temple with temple_id=${temple_id}. Maybe Temple was not found!`,
        });
      } else res.send({ message: 'Temple was updated successfully.' });
    })
    .catch((err) => {
      res.status(500).send({
        message: 'Error updating Temple with temple_id=' + temple_id,
      });
    });
};

exports.delete = (req, res) => {
  // #swagger.tags = ['Temples']
  // #swagger.summary = 'Delete a temple by temple_id'
  // #swagger.parameters['temple_id'] = { in: 'path', type: 'integer', description: 'Numeric temple_id to delete' }
  // #swagger.responses[200] = { description: 'Success' }
  // #swagger.responses[404] = { description: 'No temple with that temple_id' }
  // #swagger.responses[500] = { description: 'Server error while deleting the temple' }
  const temple_id = req.params.temple_id;

  Temple.findOneAndDelete({ temple_id: temple_id })
    .then((data) => {
      if (!data) {
        res.status(404).send({
          message: `Cannot delete Temple with temple_id=${temple_id}. Maybe Temple was not found!`,
        });
      } else {
        res.send({ message: 'Temple was deleted successfully!' });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: 'Could not delete Temple with temple_id=' + temple_id,
      });
    });
};

// // Delete all Temples from the database.
// exports.deleteAll = (req, res) => {
//   Temple.deleteMany({})
//     .then((data) => {
//       res.send({
//         message: `${data.deletedCount} Temples were deleted successfully!`,
//       });
//     })
//     .catch((err) => {
//       res.status(500).send({
//         message:
//           err.message || 'Some error occurred while removing all temple.',
//       });
//     });
// };

// // Find all published Temples
// exports.findAllPublished = (req, res) => {
//   Temple.find({ published: true })
//     .then((data) => {
//       res.send(data);
//     })
//     .catch((err) => {
//       res.status(500).send({
//         message:
//           err.message || 'Some error occurred while retrieving temple.',
//       });
//     });
// };
[
  {
    "temple_id": 1,
    "additionalInfo": false,
    "name": "Aba Nigeria Temple",
    "location": "Aba, Abia, Nigeria",
    "dedicated": "August 7, 2005"
  },
  {
    "temple_id": 2,
    "additionalInfo": false,
    "name": "Abidjan Ivory Coast Temple",
    "location": "Abidjan, Côte d'Ivoire",
    "dedicated": "May 25, 2025"
  },
  {
    "temple_id": 3,
    "additionalInfo": false,
    "name": "Abuja Nigeria Temple",
    "location": "Nigeria",
    "dedicated": "Announced"
  },
  {
    "temple_id": 4,
    "additionalInfo": false,
    "name": "Accra Ghana Temple",
    "location": "Accra, Greater Accra, Ghana",
    "dedicated": "January 11, 2004"
  },
  {
    "temple_id": 5,
    "additionalInfo": false,
    "name": "Adelaide Australia Temple",
    "location": "Marden, South Australia, Australia",
    "dedicated": "June 15, 2000"
  },
  {
    "temple_id": 6,
    "additionalInfo": false,
    "name": "Alabang Philippines Temple",
    "location": "Philippines",
    "dedicated": "January 18, 2026"
  },
  {
    "temple_id": 7,
    "additionalInfo": false,
    "name": "Albuquerque New Mexico Temple",
    "location": "Albuquerque, New Mexico, United States",
    "dedicated": "March 5, 2000"
  },
  {
    "temple_id": 8,
    "additionalInfo": false,
    "name": "Anchorage Alaska Temple",
    "location": "Anchorage, Alaska, United States",
    "dedicated": "January 9, 1999"
  },
  {
    "temple_id": 9,
    "additionalInfo": false,
    "name": "Antananarivo Madagascar Temple",
    "location": "Madagascar",
    "dedicated": "Construction"
  },
  {
    "temple_id": 10,
    "additionalInfo": false,
    "name": "Antofagasta Chile Temple",
    "location": "Antofagasta, Chile",
    "dedicated": "June 15, 2025"
  },
  {
    "temple_id": 11,
    "additionalInfo": false,
    "name": "Apia Samoa Temple",
    "location": "Apia, Pesega, Samoa",
    "dedicated": "August 5, 1983"
  },
  {
    "temple_id": 12,
    "additionalInfo": false,
    "name": "Arequipa Peru Temple",
    "location": "Arequipa, Peru",
    "dedicated": "December 15, 2019"
  },
  {
    "temple_id": 13,
    "additionalInfo": false,
    "name": "Asunción Paraguay Temple",
    "location": "Asunción, Alto Paraguay, Paraguay",
    "dedicated": "May 19, 2002"
  },
  {
    "temple_id": 14,
    "additionalInfo": false,
    "name": "Atlanta Georgia Temple",
    "location": "Sandy Springs, Georgia, United States",
    "dedicated": "June 1, 1983"
  },
  {
    "temple_id": 15,
    "additionalInfo": false,
    "name": "Auckland New Zealand Temple",
    "location": "Auckland, New Zealand",
    "dedicated": "April 13, 2025"
  },
  {
    "temple_id": 16,
    "additionalInfo": false,
    "name": "Austin Texas Temple",
    "location": "Texas, United States",
    "dedicated": "Construction"
  },
  {
    "temple_id": 17,
    "additionalInfo": false,
    "name": "Bacolod Philippines Temple",
    "location": "Lanao Del Norte, Philippines",
    "dedicated": "May 31, 2026"
  },
  {
    "temple_id": 18,
    "additionalInfo": false,
    "name": "Bahía Blanca Argentina Temple",
    "location": "Argentina",
    "dedicated": "November 23, 2025"
  },
  {
    "temple_id": 19,
    "additionalInfo": false,
    "name": "Bakersfield California Temple",
    "location": "California, United States",
    "dedicated": "Announced"
  },
  {
    "temple_id": 20,
    "additionalInfo": false,
    "name": "Bangkok Thailand Temple",
    "location": "Bangkok, Thailand",
    "dedicated": "October 22, 2023"
  },
  {
    "temple_id": 21,
    "additionalInfo": false,
    "name": "Barcelona Spain Temple",
    "location": "Spain",
    "dedicated": "Construction"
  },
  {
    "temple_id": 22,
    "additionalInfo": false,
    "name": "Barranquilla Colombia Temple",
    "location": "Barranquilla, Colombia",
    "dedicated": "December 9, 2018"
  },
  {
    "temple_id": 23,
    "additionalInfo": false,
    "name": "Baton Rouge Louisiana Temple",
    "location": "Baton Rouge, Louisiana, United States",
    "dedicated": "July 16, 2000"
  },
  {
    "temple_id": 24,
    "additionalInfo": false,
    "name": "Beira Mozambique Temple",
    "location": "Mozambique",
    "dedicated": "Announced"
  },
  {
    "temple_id": 25,
    "additionalInfo": false,
    "name": "Belém Brazil Temple",
    "location": "Belém, Para, Brazil",
    "dedicated": "November 20, 2022"
  },
  {
    "temple_id": 26,
    "additionalInfo": false,
    "name": "Belo Horizonte Brazil Temple",
    "location": "Brazil",
    "dedicated": "August 16, 2026"
  },
  {
    "temple_id": 27,
    "additionalInfo": false,
    "name": "Bengaluru India Temple",
    "location": "Bangalore, India",
    "dedicated": "Construction"
  },
  {
    "temple_id": 28,
    "additionalInfo": false,
    "name": "Benin City Nigeria Temple",
    "location": "Nigeria",
    "dedicated": "Construction"
  },
  {
    "temple_id": 29,
    "additionalInfo": false,
    "name": "Bentonville Arkansas Temple",
    "location": "Bentonville, Arkansas, United States",
    "dedicated": "September 17, 2023"
  },
  {
    "temple_id": 30,
    "additionalInfo": false,
    "name": "Bern Switzerland Temple",
    "location": "Zollikofen, Bern, Switzerland",
    "dedicated": "September 11, 1955"
  },
  {
    "temple_id": 31,
    "additionalInfo": false,
    "name": "Billings Montana Temple",
    "location": "Billings, Montana, United States",
    "dedicated": "November 20, 1999"
  },
  {
    "temple_id": 32,
    "additionalInfo": false,
    "name": "Birmingham Alabama Temple",
    "location": "Gardendale, Alabama, United States",
    "dedicated": "September 3, 2000"
  },
  {
    "temple_id": 33,
    "additionalInfo": false,
    "name": "Birmingham England Temple",
    "location": "United Kingdom",
    "dedicated": "Construction"
  },
  {
    "temple_id": 34,
    "additionalInfo": false,
    "name": "Bismarck North Dakota Temple",
    "location": "Bismarck, North Dakota, United States",
    "dedicated": "September 19, 1999"
  },
  {
    "temple_id": 35,
    "additionalInfo": false,
    "name": "Bogotá Colombia Temple",
    "location": "Bogotá, Distrito Capital, Colombia",
    "dedicated": "April 24, 1999"
  },
  {
    "temple_id": 36,
    "additionalInfo": false,
    "name": "Boise Idaho Temple",
    "location": "Boise, Idaho, United States",
    "dedicated": "May 25, 1984"
  },
  {
    "temple_id": 37,
    "additionalInfo": false,
    "name": "Boston Massachusetts Temple",
    "location": "Belmont, Massachusetts, United States",
    "dedicated": "October 1, 2000"
  },
  {
    "temple_id": 38,
    "additionalInfo": false,
    "name": "Bountiful Utah Temple",
    "location": "Bountiful, Utah, United States",
    "dedicated": "January 8, 1995"
  },
  {
    "temple_id": 39,
    "additionalInfo": false,
    "name": "Brasília Brazil Temple",
    "location": "Brasilia, Brazil",
    "dedicated": "September 17, 2023"
  },
  {
    "temple_id": 40,
    "additionalInfo": false,
    "name": "Brazzaville Republic of the Congo Temple",
    "location": "Republic of the Congo",
    "dedicated": "Construction"
  },
  {
    "temple_id": 41,
    "additionalInfo": false,
    "name": "Brigham City Utah Temple",
    "location": "Brigham City, Utah, United States",
    "dedicated": "September 23, 2012"
  },
  {
    "temple_id": 42,
    "additionalInfo": false,
    "name": "Brisbane Australia South Temple",
    "location": "Australia",
    "dedicated": "Announced"
  },
  {
    "temple_id": 43,
    "additionalInfo": false,
    "name": "Brisbane Australia Temple",
    "location": "Kangaroo Point, Queensland, Australia",
    "dedicated": "June 15, 2003"
  },
  {
    "temple_id": 44,
    "additionalInfo": false,
    "name": "Brussels Belgium Temple",
    "location": "Belgium",
    "dedicated": "Construction"
  },
  {
    "temple_id": 45,
    "additionalInfo": false,
    "name": "Budapest Hungary Temple",
    "location": "Hungary",
    "dedicated": "Construction"
  },
  {
    "temple_id": 46,
    "additionalInfo": false,
    "name": "Buenos Aires Argentina Temple",
    "location": "Ciudad Evita, Buenos Aires, Argentina",
    "dedicated": "January 17, 1986"
  },
  {
    "temple_id": 47,
    "additionalInfo": false,
    "name": "Buenos Aires City Center Argentina Temple",
    "location": "Argentina",
    "dedicated": "Announced"
  },
  {
    "temple_id": 48,
    "additionalInfo": false,
    "name": "Burley Idaho Temple",
    "location": "Burley, Idaho, United States",
    "dedicated": "January 11, 2026"
  },
  {
    "temple_id": 49,
    "additionalInfo": false,
    "name": "Busan Korea Temple",
    "location": "South Korea",
    "dedicated": "Announced"
  },
  {
    "temple_id": 50,
    "additionalInfo": false,
    "name": "Cagayan de Oro Philippines Temple",
    "location": "Philippines",
    "dedicated": "Construction"
  },
  {
    "temple_id": 51,
    "additionalInfo": false,
    "name": "Calabar Nigeria Temple",
    "location": "Nigeria",
    "dedicated": "Announced"
  },
  {
    "temple_id": 52,
    "additionalInfo": false,
    "name": "Caldwell Idaho Temple",
    "location": "Idaho, United States",
    "dedicated": "Announced"
  },
  {
    "temple_id": 53,
    "additionalInfo": false,
    "name": "Calgary Alberta Temple",
    "location": "Calgary, Alberta, Canada",
    "dedicated": "October 28, 2012"
  },
  {
    "temple_id": 54,
    "additionalInfo": false,
    "name": "Cali Colombia Temple",
    "location": "Colombia",
    "dedicated": "Construction"
  },
  {
    "temple_id": 55,
    "additionalInfo": false,
    "name": "Campinas Brazil Temple",
    "location": "Campinas, Sao Paulo, Brazil",
    "dedicated": "May 17, 2002"
  },
  {
    "temple_id": 56,
    "additionalInfo": false,
    "name": "Campo Grande Brazil Temple",
    "location": "Brazil",
    "dedicated": "Announced"
  },
  {
    "temple_id": 57,
    "additionalInfo": false,
    "name": "Cancún Mexico Temple",
    "location": "Mexico",
    "dedicated": "Announced"
  },
  {
    "temple_id": 58,
    "additionalInfo": false,
    "name": "Cape Coast Ghana Temple",
    "location": "Ghana",
    "dedicated": "Announced"
  },
  {
    "temple_id": 59,
    "additionalInfo": false,
    "name": "Cape Town South Africa Temple",
    "location": "South Africa",
    "dedicated": "Construction"
  },
  {
    "temple_id": 60,
    "additionalInfo": false,
    "name": "Caracas Venezuela Temple",
    "location": "Caracas, Dependencias Federales, Venezuela",
    "dedicated": "August 20, 2000"
  },
  {
    "temple_id": 61,
    "additionalInfo": false,
    "name": "Cardston Alberta Temple",
    "location": "Cardston, Alberta, Canada",
    "dedicated": "August 26, 1923"
  },
  {
    "temple_id": 62,
    "additionalInfo": false,
    "name": "Casper Wyoming Temple",
    "location": "Casper, Wyoming, United States",
    "dedicated": "November 24, 2024"
  },
  {
    "temple_id": 63,
    "additionalInfo": false,
    "name": "Cebu City Philippines Temple",
    "location": "Cebu City, Cebu, Philippines",
    "dedicated": "June 13, 2010"
  },
  {
    "temple_id": 64,
    "additionalInfo": false,
    "name": "Cedar City Utah Temple",
    "location": "Cedar City, Utah, United States",
    "dedicated": "December 10, 2017"
  },
  {
    "temple_id": 65,
    "additionalInfo": false,
    "name": "Charlotte North Carolina Temple",
    "location": "North Carolina, United States",
    "dedicated": "Announced"
  },
  {
    "temple_id": 66,
    "additionalInfo": false,
    "name": "Chicago Illinois Temple",
    "location": "Glenview, Illinois, United States",
    "dedicated": "August 9, 1985"
  },
  {
    "temple_id": 67,
    "additionalInfo": false,
    "name": "Chiclayo Peru Temple",
    "location": "Peru",
    "dedicated": "Announced"
  },
  {
    "temple_id": 68,
    "additionalInfo": false,
    "name": "Chihuahua Mexico Temple",
    "location": "Mexico",
    "dedicated": "Announced"
  },
  {
    "temple_id": 69,
    "additionalInfo": false,
    "name": "Chorrillos Peru Temple",
    "location": "Peru",
    "dedicated": "Announced"
  },
  {
    "temple_id": 70,
    "additionalInfo": false,
    "name": "Cincinnati Ohio Temple",
    "location": "Ohio, United States",
    "dedicated": "Announced"
  },
  {
    "temple_id": 71,
    "additionalInfo": false,
    "name": "Ciudad Juárez Mexico Temple",
    "location": "Ciudad Juárez, Chihuahua, Mexico",
    "dedicated": "February 26, 2000"
  },
  {
    "temple_id": 72,
    "additionalInfo": false,
    "name": "Cleveland Ohio Temple",
    "location": "Ohio, United States",
    "dedicated": "August 16, 2026"
  },
  {
    "temple_id": 73,
    "additionalInfo": false,
    "name": "Cobán Guatemala Temple",
    "location": "Coban, Guatemala",
    "dedicated": "June 9, 2024"
  },
  {
    "temple_id": 74,
    "additionalInfo": false,
    "name": "Cochabamba Bolivia Temple",
    "location": "Alto Queru Queru, Cochabamba, Bolivia",
    "dedicated": "April 30, 2000"
  },
  {
    "temple_id": 75,
    "additionalInfo": false,
    "name": "Cody Wyoming Temple",
    "location": "Wyoming, United States",
    "dedicated": "Opening Soon"
  },
  {
    "temple_id": 76,
    "additionalInfo": false,
    "name": "Coeur d'Alene Idaho Temple",
    "location": "Idaho, United States",
    "dedicated": "Construction"
  },
  {
    "temple_id": 77,
    "additionalInfo": false,
    "name": "Colonia Juárez Chihuahua Mexico Temple",
    "location": "Colonia Juárez, Chihuahua, Mexico",
    "dedicated": "March 6, 1999"
  },
  {
    "temple_id": 78,
    "additionalInfo": false,
    "name": "Colorado Springs Colorado Temple",
    "location": "Colorado, United States",
    "dedicated": "Construction"
  },
  {
    "temple_id": 79,
    "additionalInfo": false,
    "name": "Columbia River Washington Temple",
    "location": "Richland, Washington, United States",
    "dedicated": "November 18, 2001"
  },
  {
    "temple_id": 80,
    "additionalInfo": false,
    "name": "Columbia South Carolina Temple",
    "location": "Hopkins, South Carolina, United States",
    "dedicated": "October 16, 1999"
  },
  {
    "temple_id": 81,
    "additionalInfo": false,
    "name": "Columbus Ohio Temple",
    "location": "Columbus, Ohio, United States",
    "dedicated": "September 4, 1999"
  },
  {
    "temple_id": 82,
    "additionalInfo": false,
    "name": "Concepción Chile Temple",
    "location": "Concepcion, Chile",
    "dedicated": "October 28, 2018"
  },
  {
    "temple_id": 83,
    "additionalInfo": false,
    "name": "Copenhagen Denmark Temple",
    "location": "Frederiksberg, Hovedstaden, Denmark",
    "dedicated": "May 23, 2004"
  },
  {
    "temple_id": 84,
    "additionalInfo": false,
    "name": "Córdoba Argentina Temple",
    "location": "Córdoba, Argentina",
    "dedicated": "May 17, 2015"
  },
  {
    "temple_id": 85,
    "additionalInfo": false,
    "name": "Cuernavaca Mexico Temple",
    "location": "Mexico",
    "dedicated": "Announced"
  },
  {
    "temple_id": 86,
    "additionalInfo": false,
    "name": "Culiacán Mexico Temple",
    "location": "Mexico",
    "dedicated": "Announced"
  },
  {
    "temple_id": 87,
    "additionalInfo": false,
    "name": "Curitiba Brazil Temple",
    "location": "Curitiba, Parana, Brazil",
    "dedicated": "June 1, 2008"
  },
  {
    "temple_id": 88,
    "additionalInfo": false,
    "name": "Cusco Peru Temple",
    "location": "Peru",
    "dedicated": "Announced"
  },
  {
    "temple_id": 89,
    "additionalInfo": false,
    "name": "Dallas Texas Temple",
    "location": "Dallas, Texas, United States",
    "dedicated": "October 19, 1984"
  },
  {
    "temple_id": 90,
    "additionalInfo": false,
    "name": "Davao Philippines Temple",
    "location": "Davao, Philippines",
    "dedicated": "May 3, 2026"
  },
  {
    "temple_id": 91,
    "additionalInfo": false,
    "name": "Denver Colorado Temple",
    "location": "Centennial, Colorado, United States",
    "dedicated": "October 24, 1986"
  },
  {
    "temple_id": 92,
    "additionalInfo": false,
    "name": "Des Moines Iowa Temple",
    "location": "Iowa, United States",
    "dedicated": "Announced"
  },
  {
    "temple_id": 93,
    "additionalInfo": false,
    "name": "Deseret Peak Utah Temple",
    "location": "Tooele, Utah, United States",
    "dedicated": "November 10, 2024"
  },
  {
    "temple_id": 94,
    "additionalInfo": false,
    "name": "Detroit Michigan Temple",
    "location": "Bloomfield Hills, Michigan, United States",
    "dedicated": "October 23, 1999"
  },
  {
    "temple_id": 95,
    "additionalInfo": false,
    "name": "Draper Utah Temple",
    "location": "Draper, Utah, United States",
    "dedicated": "March 20, 2009"
  },
  {
    "temple_id": 96,
    "additionalInfo": false,
    "name": "Dubai United Arab Emirates Temple",
    "location": "United Arab Emirates",
    "dedicated": "Announced"
  },
  {
    "temple_id": 97,
    "additionalInfo": false,
    "name": "Dublin Ireland Temple",
    "location": "Ireland",
    "dedicated": "Announced"
  },
  {
    "temple_id": 98,
    "additionalInfo": false,
    "name": "Durban South Africa Temple",
    "location": "Durban, South Africa",
    "dedicated": "February 16, 2020"
  },
  {
    "temple_id": 99,
    "additionalInfo": false,
    "name": "Edinburgh Scotland Temple",
    "location": "United Kingdom",
    "dedicated": "Announced"
  },
  {
    "temple_id": 100,
    "additionalInfo": false,
    "name": "Edmonton Alberta Temple",
    "location": "Edmonton, Alberta, Canada",
    "dedicated": "December 11, 1999"
  },
  {
    "temple_id": 101,
    "additionalInfo": false,
    "name": "Eket Nigeria Temple",
    "location": "Nigeria",
    "dedicated": "Announced"
  },
  {
    "temple_id": 102,
    "additionalInfo": false,
    "name": "El Paso Texas Temple",
    "location": "Texas, United States",
    "dedicated": "Announced"
  },
  {
    "temple_id": 103,
    "additionalInfo": false,
    "name": "Elko Nevada Temple",
    "location": "Nevada, United States",
    "dedicated": "October 12, 2025"
  },
  {
    "temple_id": 104,
    "additionalInfo": false,
    "name": "Ephraim Utah Temple",
    "location": "Utah, United States",
    "dedicated": "Opening Soon"
  },
  {
    "temple_id": 105,
    "additionalInfo": false,
    "name": "Fairbanks Alaska Temple",
    "location": "Alaska, United States",
    "dedicated": "Construction"
  },
  {
    "temple_id": 106,
    "additionalInfo": false,
    "name": "Fairview Texas Temple",
    "location": "Texas, United States",
    "dedicated": "Construction"
  },
  {
    "temple_id": 107,
    "additionalInfo": false,
    "name": "Farmington New Mexico Temple",
    "location": "New Mexico, United States",
    "dedicated": "August 17, 2025"
  },
  {
    "temple_id": 108,
    "additionalInfo": false,
    "name": "Feather River California Temple",
    "location": "Yuba City, California, United States",
    "dedicated": "October 8, 2023"
  },
  {
    "temple_id": 109,
    "additionalInfo": false,
    "name": "Flagstaff Arizona Temple",
    "location": "Arizona, United States",
    "dedicated": "Announced"
  },
  {
    "temple_id": 110,
    "additionalInfo": false,
    "name": "Florianopolis Brazil Temple",
    "location": "Brazil",
    "dedicated": "Announced"
  },
  {
    "temple_id": 111,
    "additionalInfo": false,
    "name": "Fort Bend Texas Temple",
    "location": "Texas, United States",
    "dedicated": "Announced"
  },
  {
    "temple_id": 112,
    "additionalInfo": false,
    "name": "Fort Collins Colorado Temple",
    "location": "Fort Collins, Colorado, United States",
    "dedicated": "October 16, 2016"
  },
  {
    "temple_id": 113,
    "additionalInfo": false,
    "name": "Fort Lauderdale Florida Temple",
    "location": "Davie, Florida, United States",
    "dedicated": "May 4, 2014"
  },
  {
    "temple_id": 114,
    "additionalInfo": false,
    "name": "Fort Worth Texas Temple",
    "location": "Texas, United States",
    "dedicated": "Opening Soon"
  },
  {
    "temple_id": 115,
    "additionalInfo": false,
    "name": "Fortaleza Brazil Temple",
    "location": "Fortaleza, Ceara, Brazil",
    "dedicated": "June 2, 2019"
  },
  {
    "temple_id": 116,
    "additionalInfo": false,
    "name": "Frankfurt Germany Temple",
    "location": "Friedrichsdorf, Hessen, Germany",
    "dedicated": "August 28, 1987"
  },
  {
    "temple_id": 117,
    "additionalInfo": false,
    "name": "Freetown Sierra Leone Temple",
    "location": "Sierra Leone",
    "dedicated": "Construction"
  },
  {
    "temple_id": 118,
    "additionalInfo": false,
    "name": "Freiberg Germany Temple",
    "location": "Freiberg, Sachsen, Germany",
    "dedicated": "June 29, 1985"
  },
  {
    "temple_id": 119,
    "additionalInfo": false,
    "name": "Fresno California Temple",
    "location": "Fresno, California, United States",
    "dedicated": "April 9, 2000"
  },
  {
    "temple_id": 120,
    "additionalInfo": false,
    "name": "Fukuoka Japan Temple",
    "location": "Fukuoka-shi, Fukuoka, Japan",
    "dedicated": "June 11, 2000"
  },
  {
    "temple_id": 121,
    "additionalInfo": false,
    "name": "Gilbert Arizona Temple",
    "location": "Gilbert, Arizona, United States",
    "dedicated": "March 2, 2014"
  },
  {
    "temple_id": 122,
    "additionalInfo": false,
    "name": "Goiânia Brazil Temple",
    "location": "Brazil",
    "dedicated": "Announced"
  },
  {
    "temple_id": 123,
    "additionalInfo": false,
    "name": "Grand Junction Colorado Temple",
    "location": "Grand Junction, Colorado, United States",
    "dedicated": "October 19, 2025"
  },
  {
    "temple_id": 124,
    "additionalInfo": false,
    "name": "Grand Rapids Michigan Temple",
    "location": "Michigan, United States",
    "dedicated": "Construction"
  },
  {
    "temple_id": 125,
    "additionalInfo": false,
    "name": "Greenville South Carolina Temple",
    "location": "South Carolina, United States",
    "dedicated": "Announced"
  },
  {
    "temple_id": 126,
    "additionalInfo": false,
    "name": "Guadalajara Mexico Temple",
    "location": "Zapopan, Jalisco, Mexico",
    "dedicated": "April 29, 2001"
  },
  {
    "temple_id": 127,
    "additionalInfo": false,
    "name": "Guatemala City Guatemala Temple",
    "location": "Guatemala City, Guatemala",
    "dedicated": "December 14, 1984"
  },
  {
    "temple_id": 128,
    "additionalInfo": false,
    "name": "Guayaquil Ecuador Temple",
    "location": "Guayaquil, Guayas, Ecuador",
    "dedicated": "August 1, 1999"
  },
  {
    "temple_id": 129,
    "additionalInfo": false,
    "name": "Halifax Nova Scotia Temple",
    "location": "Dartmouth, Nova Scotia, Canada",
    "dedicated": "November 14, 1999"
  },
  {
    "temple_id": 130,
    "additionalInfo": false,
    "name": "Hamburg Germany Temple",
    "location": "Germany",
    "dedicated": "Announced"
  },
  {
    "temple_id": 131,
    "additionalInfo": false,
    "name": "Hamilton New Zealand Temple",
    "location": "Hamilton, Auckland, New Zealand",
    "dedicated": "April 20, 1958"
  },
  {
    "temple_id": 132,
    "additionalInfo": false,
    "name": "Harare Zimbabwe Temple",
    "location": "Highlands, Harare, Zimbabwe",
    "dedicated": "March 1, 2026"
  },
  {
    "temple_id": 133,
    "additionalInfo": false,
    "name": "Harrisburg Pennsylvania Temple",
    "location": "Pennsylvania, United States",
    "dedicated": "Announced"
  },
  {
    "temple_id": 134,
    "additionalInfo": false,
    "name": "Hartford Connecticut Temple",
    "location": "Farmington, Connecticut, United States",
    "dedicated": "November 20, 2016"
  },
  {
    "temple_id": 135,
    "additionalInfo": false,
    "name": "Heber Valley Utah Temple",
    "location": "Utah, United States",
    "dedicated": "Construction"
  },
  {
    "temple_id": 136,
    "additionalInfo": false,
    "name": "Helena Montana Temple",
    "location": "Helena, Montana, United States",
    "dedicated": "June 18, 2023"
  },
  {
    "temple_id": 137,
    "additionalInfo": false,
    "name": "Helsinki Finland Temple",
    "location": "Espoo, Uusimaa, Finland",
    "dedicated": "October 22, 2006"
  },
  {
    "temple_id": 138,
    "additionalInfo": false,
    "name": "Hermosillo Sonora Mexico Temple",
    "location": "Hermosillo, Sonora, Mexico",
    "dedicated": "February 27, 2000"
  },
  {
    "temple_id": 139,
    "additionalInfo": false,
    "name": "Hong Kong China Temple",
    "location": "Kowloon Tong, Kowloon City, Hong Kong",
    "dedicated": "May 26, 1996"
  },
  {
    "temple_id": 140,
    "additionalInfo": false,
    "name": "Honolulu Hawaii Temple",
    "location": "Hawaii, United States",
    "dedicated": "Announced"
  },
  {
    "temple_id": 141,
    "additionalInfo": false,
    "name": "Houston Texas Temple",
    "location": "Spring, Texas, United States",
    "dedicated": "August 26, 2000"
  },
  {
    "temple_id": 142,
    "additionalInfo": false,
    "name": "Huancayo Peru Temple",
    "location": "Peru",
    "dedicated": "Announced"
  },
  {
    "temple_id": 143,
    "additionalInfo": false,
    "name": "Huehuetenango Guatemala Temple",
    "location": "Guatemala",
    "dedicated": "Construction"
  },
  {
    "temple_id": 144,
    "additionalInfo": false,
    "name": "Huntsville Alabama Temple",
    "location": "Alabama, United States",
    "dedicated": "Construction"
  },
  {
    "temple_id": 145,
    "additionalInfo": false,
    "name": "Idaho Falls Idaho Temple",
    "location": "Idaho Falls, Idaho, United States",
    "dedicated": "September 23, 1945"
  },
  {
    "temple_id": 146,
    "additionalInfo": false,
    "name": "Iloilo Philippines Temple",
    "location": "Philippines",
    "dedicated": "Announced"
  },
  {
    "temple_id": 147,
    "additionalInfo": false,
    "name": "Indianapolis Indiana Temple",
    "location": "Carmel, Indiana, United States",
    "dedicated": "August 23, 2015"
  },
  {
    "temple_id": 148,
    "additionalInfo": false,
    "name": "Iquitos Peru Temple",
    "location": "Peru",
    "dedicated": "Announced"
  },
  {
    "temple_id": 149,
    "additionalInfo": false,
    "name": "Jacksonville Florida Temple",
    "location": "Florida, United States",
    "dedicated": "Construction"
  },
  {
    "temple_id": 150,
    "additionalInfo": false,
    "name": "Jakarta Indonesia Temple",
    "location": "Indonesia",
    "dedicated": "Announced"
  },
  {
    "temple_id": 151,
    "additionalInfo": false,
    "name": "João Pessoa Brazil Temple",
    "location": "Brazil",
    "dedicated": "Construction"
  },
  {
    "temple_id": 152,
    "additionalInfo": false,
    "name": "Johannesburg South Africa Temple",
    "location": "Johannesburg, Gauteng, South Africa",
    "dedicated": "August 24, 1985"
  },
  {
    "temple_id": 153,
    "additionalInfo": false,
    "name": "Jordan River Utah Temple",
    "location": "South Jordan, Utah, United States",
    "dedicated": "November 16, 1981"
  },
  {
    "temple_id": 154,
    "additionalInfo": false,
    "name": "Juchitán de Zaragoza Mexico Temple",
    "location": "Mexico",
    "dedicated": "Announced"
  },
  {
    "temple_id": 155,
    "additionalInfo": false,
    "name": "Kahului Hawaii Temple",
    "location": "Hawaii, United States",
    "dedicated": "Announced"
  },
  {
    "temple_id": 156,
    "additionalInfo": false,
    "name": "Kampala Uganda Temple",
    "location": "Uganda",
    "dedicated": "Announced"
  },
  {
    "temple_id": 157,
    "additionalInfo": false,
    "name": "Kananga Democratic Republic of the Congo Temple",
    "location": "Democratic Republic of the Congo",
    "dedicated": "Announced"
  },
  {
    "temple_id": 158,
    "additionalInfo": false,
    "name": "Kansas City Missouri Temple",
    "location": "Kansas City, Missouri, United States",
    "dedicated": "May 6, 2012"
  },
  {
    "temple_id": 159,
    "additionalInfo": false,
    "name": "Kaohsiung Taiwan Temple",
    "location": "Taiwan",
    "dedicated": "Construction"
  },
  {
    "temple_id": 160,
    "additionalInfo": false,
    "name": "Kinshasa Democratic Republic of the Congo Temple",
    "location": "Kinshasa, Democratic Republic of the Congo",
    "dedicated": "April 14, 2019"
  },
  {
    "temple_id": 161,
    "additionalInfo": false,
    "name": "Knoxville Tennessee Temple",
    "location": "Tennessee, United States",
    "dedicated": "Opening Soon"
  },
  {
    "temple_id": 162,
    "additionalInfo": false,
    "name": "Kona Hawaii Temple",
    "location": "Kailua-Kona, Hawaii, United States",
    "dedicated": "Renovation"
  },
  {
    "temple_id": 163,
    "additionalInfo": false,
    "name": "Kumasi Ghana Temple",
    "location": "Ghana",
    "dedicated": "Construction"
  },
  {
    "temple_id": 164,
    "additionalInfo": false,
    "name": "Kyiv Ukraine Temple",
    "location": "Kyevo-Sviatoshyns'ky Rayon, Kyiv, Ukraine",
    "dedicated": "August 29, 2010"
  },
  {
    "temple_id": 165,
    "additionalInfo": false,
    "name": "La Paz Bolivia Temple",
    "location": "Bolivia",
    "dedicated": "Announced"
  },
  {
    "temple_id": 166,
    "additionalInfo": false,
    "name": "Lagos Nigeria Temple",
    "location": "Nigeria",
    "dedicated": "Construction"
  },
  {
    "temple_id": 167,
    "additionalInfo": false,
    "name": "Laie Hawaii Temple",
    "location": "Laie, Hawaii, United States",
    "dedicated": "November 27, 1919"
  },
  {
    "temple_id": 168,
    "additionalInfo": false,
    "name": "Laoag Philippines Temple",
    "location": "Philippines",
    "dedicated": "Announced"
  },
  {
    "temple_id": 169,
    "additionalInfo": false,
    "name": "Las Vegas Nevada Temple",
    "location": "Las Vegas, Nevada, United States",
    "dedicated": "December 16, 1989"
  },
  {
    "temple_id": 170,
    "additionalInfo": false,
    "name": "Layton Utah Temple",
    "location": "Layton, Utah, United States",
    "dedicated": "June 16, 2024"
  },
  {
    "temple_id": 171,
    "additionalInfo": false,
    "name": "Lehi Utah Temple",
    "location": "Utah, United States",
    "dedicated": "Announced"
  },
  {
    "temple_id": 172,
    "additionalInfo": false,
    "name": "Lethbridge Alberta Temple",
    "location": "Alberta, Canada",
    "dedicated": "Construction"
  },
  {
    "temple_id": 173,
    "additionalInfo": false,
    "name": "Lima Peru Los Olivos Temple",
    "location": "Los Olivos, Lima, Peru",
    "dedicated": "January 14, 2024"
  },
  {
    "temple_id": 174,
    "additionalInfo": false,
    "name": "Lima Peru Temple",
    "location": "La Molina, Lima, Peru",
    "dedicated": "January 10, 1986"
  },
  {
    "temple_id": 175,
    "additionalInfo": false,
    "name": "Lindon Utah Temple",
    "location": "Lindon, Utah, United States",
    "dedicated": "May 3, 2026"
  },
  {
    "temple_id": 176,
    "additionalInfo": false,
    "name": "Lisbon Portugal Temple",
    "location": "Lisbon, Portugal",
    "dedicated": "September 15, 2019"
  },
  {
    "temple_id": 177,
    "additionalInfo": false,
    "name": "Liverpool Australia Temple",
    "location": "Australia",
    "dedicated": "Announced"
  },
  {
    "temple_id": 178,
    "additionalInfo": false,
    "name": "Logan Utah Temple",
    "location": "Logan, Utah, United States",
    "dedicated": "May 17, 1884"
  },
  {
    "temple_id": 179,
    "additionalInfo": false,
    "name": "London England Temple",
    "location": "Newchapel, Surrey, England",
    "dedicated": "September 7, 1958"
  },
  {
    "temple_id": 180,
    "additionalInfo": false,
    "name": "Londrina Brazil Temple",
    "location": "Brazil",
    "dedicated": "Construction"
  },
  {
    "temple_id": 181,
    "additionalInfo": false,
    "name": "Lone Mountain Nevada Temple",
    "location": "Nevada, United States",
    "dedicated": "Construction"
  },
  {
    "temple_id": 182,
    "additionalInfo": false,
    "name": "Los Angeles California Temple",
    "location": "Los Angeles, California, United States",
    "dedicated": "March 11, 1956"
  },
  {
    "temple_id": 183,
    "additionalInfo": false,
    "name": "Louisville Kentucky Temple",
    "location": "Crestwood, Kentucky, United States",
    "dedicated": "March 19, 2000"
  },
  {
    "temple_id": 184,
    "additionalInfo": false,
    "name": "Luanda Angola Temple",
    "location": "Angola",
    "dedicated": "Announced"
  },
  {
    "temple_id": 185,
    "additionalInfo": false,
    "name": "Lubbock Texas Temple",
    "location": "Lubbock, Texas, United States",
    "dedicated": "April 21, 2002"
  },
  {
    "temple_id": 186,
    "additionalInfo": false,
    "name": "Lubumbashi Democratic Republic of the Congo Temple",
    "location": "Democratic Republic of the Congo",
    "dedicated": "Construction"
  },
  {
    "temple_id": 187,
    "additionalInfo": false,
    "name": "Maceió Brazil Temple",
    "location": "Brazil",
    "dedicated": "Announced"
  },
  {
    "temple_id": 188,
    "additionalInfo": false,
    "name": "Madrid Spain Temple",
    "location": "Madrid, Madrid, Spain",
    "dedicated": "March 19, 1999"
  },
  {
    "temple_id": 189,
    "additionalInfo": false,
    "name": "Managua Nicaragua Temple",
    "location": "Nicaragua",
    "dedicated": "Opening Soon"
  },
  {
    "temple_id": 190,
    "additionalInfo": false,
    "name": "Manaus Brazil Temple",
    "location": "Manaus, Amazonas, Brazil",
    "dedicated": "June 10, 2012"
  },
  {
    "temple_id": 191,
    "additionalInfo": false,
    "name": "Manhattan New York Temple",
    "location": "New York, New York, United States",
    "dedicated": "Renovation"
  },
  {
    "temple_id": 192,
    "additionalInfo": false,
    "name": "Manila Philippines Temple",
    "location": "Quezon City, Metro Manila, Philippines",
    "dedicated": "September 25, 1984"
  },
  {
    "temple_id": 193,
    "additionalInfo": false,
    "name": "Manti Utah Temple",
    "location": "Manti, Utah, United States",
    "dedicated": "May 21, 1888"
  },
  {
    "temple_id": 194,
    "additionalInfo": false,
    "name": "Maputo Mozambique Temple",
    "location": "Mozambique",
    "dedicated": "Announced"
  },
  {
    "temple_id": 195,
    "additionalInfo": false,
    "name": "Maracaibo Venezuela Temple",
    "location": "Venezuela",
    "dedicated": "Announced"
  },
  {
    "temple_id": 196,
    "additionalInfo": false,
    "name": "Marysville Washington Temple",
    "location": "Marysville, Washington, United States",
    "dedicated": "Announced"
  },
  {
    "temple_id": 197,
    "additionalInfo": false,
    "name": "Mbuji-Mayi Democratic Republic of the Congo Temple",
    "location": "Democratic Republic of the Congo",
    "dedicated": "Announced"
  },
  {
    "temple_id": 198,
    "additionalInfo": false,
    "name": "McAllen Texas Temple",
    "location": "McAllen, Texas, United States",
    "dedicated": "October 8, 2023"
  },
  {
    "temple_id": 199,
    "additionalInfo": false,
    "name": "Medellín Colombia Temple",
    "location": "Colombia",
    "dedicated": "Announced"
  },
  {
    "temple_id": 200,
    "additionalInfo": false,
    "name": "Medford Oregon Temple",
    "location": "Central Point, Oregon, United States",
    "dedicated": "April 16, 2000"
  },
  {
    "temple_id": 201,
    "additionalInfo": false,
    "name": "Melbourne Australia Temple",
    "location": "Wantirna South, Victoria, Australia",
    "dedicated": "June 16, 2000"
  },
  {
    "temple_id": 202,
    "additionalInfo": false,
    "name": "Memphis Tennessee Temple",
    "location": "Bartlett, Tennessee, United States",
    "dedicated": "April 23, 2000"
  },
  {
    "temple_id": 203,
    "additionalInfo": false,
    "name": "Mendoza Argentina Temple",
    "location": "Mendoza, Argentina",
    "dedicated": "September 22, 2024"
  },
  {
    "temple_id": 204,
    "additionalInfo": false,
    "name": "Mérida Mexico Temple",
    "location": "Mérida, Yucatan, Mexico",
    "dedicated": "July 8, 2000"
  },
  {
    "temple_id": 205,
    "additionalInfo": false,
    "name": "Meridian Idaho Temple",
    "location": "Meridian, Idaho, United States",
    "dedicated": "November 19, 2017"
  },
  {
    "temple_id": 206,
    "additionalInfo": false,
    "name": "Mesa Arizona Temple",
    "location": "Mesa, Arizona, United States",
    "dedicated": "October 23, 1927"
  },
  {
    "temple_id": 207,
    "additionalInfo": false,
    "name": "Mexico City Benemérito Mexico Temple",
    "location": "Mexico",
    "dedicated": "Announced"
  },
  {
    "temple_id": 208,
    "additionalInfo": false,
    "name": "Mexico City Mexico Temple",
    "location": "México, Distrito Federal, Mexico",
    "dedicated": "December 2, 1983"
  },
  {
    "temple_id": 209,
    "additionalInfo": false,
    "name": "Milan Italy Temple",
    "location": "Italy",
    "dedicated": "Announced"
  },
  {
    "temple_id": 210,
    "additionalInfo": false,
    "name": "Milwaukee Wisconsin Temple",
    "location": "Wisconsin, United States",
    "dedicated": "Announced"
  },
  {
    "temple_id": 211,
    "additionalInfo": false,
    "name": "Miraflores Guatemala City Guatemala Temple",
    "location": "Guatemala",
    "dedicated": "Opening Soon"
  },
  {
    "temple_id": 212,
    "additionalInfo": false,
    "name": "Missoula Montana Temple",
    "location": "Montana, United States",
    "dedicated": "Construction"
  },
  {
    "temple_id": 213,
    "additionalInfo": false,
    "name": "Modesto California Temple",
    "location": "California, United States",
    "dedicated": "Opening Soon"
  },
  {
    "temple_id": 214,
    "additionalInfo": false,
    "name": "Monrovia Liberia Temple",
    "location": "Liberia",
    "dedicated": "Announced"
  },
  {
    "temple_id": 215,
    "additionalInfo": false,
    "name": "Monterrey Mexico Temple",
    "location": "Monterrey, Nuevo Leon, Mexico",
    "dedicated": "April 28, 2002"
  },
  {
    "temple_id": 216,
    "additionalInfo": false,
    "name": "Montevideo Uruguay Temple",
    "location": "Carrasco, Montevideo, Uruguay",
    "dedicated": "March 18, 2001"
  },
  {
    "temple_id": 217,
    "additionalInfo": false,
    "name": "Monticello Utah Temple",
    "location": "Monticello, Utah, United States",
    "dedicated": "July 26, 1998"
  },
  {
    "temple_id": 218,
    "additionalInfo": false,
    "name": "Montpelier Idaho Temple",
    "location": "Idaho, United States",
    "dedicated": "Opening Soon"
  },
  {
    "temple_id": 219,
    "additionalInfo": false,
    "name": "Montreal Quebec Temple",
    "location": "Longueuil, Quebec, Canada",
    "dedicated": "June 4, 2000"
  },
  {
    "temple_id": 220,
    "additionalInfo": false,
    "name": "Moses Lake Washington Temple",
    "location": "Moses Lake, Washington, United States",
    "dedicated": "September 17, 2023"
  },
  {
    "temple_id": 221,
    "additionalInfo": false,
    "name": "Mount Timpanogos Utah Temple",
    "location": "American Fork, Utah, United States",
    "dedicated": "October 13, 1996"
  },
  {
    "temple_id": 222,
    "additionalInfo": false,
    "name": "Naga Philippines Temple",
    "location": "Philippines",
    "dedicated": "Construction"
  },
  {
    "temple_id": 223,
    "additionalInfo": false,
    "name": "Nairobi Kenya Temple",
    "location": "Nairobi, Kenya",
    "dedicated": "May 18, 2025"
  },
  {
    "temple_id": 224,
    "additionalInfo": false,
    "name": "Nashville Tennessee Temple",
    "location": "Franklin, Tennessee, United States",
    "dedicated": "May 21, 2000"
  },
  {
    "temple_id": 225,
    "additionalInfo": false,
    "name": "Natal Brazil Temple",
    "location": "Brazil",
    "dedicated": "Construction"
  },
  {
    "temple_id": 226,
    "additionalInfo": false,
    "name": "Nauvoo Illinois Temple",
    "location": "Nauvoo, Illinois, United States",
    "dedicated": "June 27, 2002"
  },
  {
    "temple_id": 227,
    "additionalInfo": false,
    "name": "Neiafu Tonga Temple",
    "location": "Neiafu Vava'u, Tonga",
    "dedicated": "Construction"
  },
  {
    "temple_id": 228,
    "additionalInfo": false,
    "name": "Newport Beach California Temple",
    "location": "Newport Beach, California, United States",
    "dedicated": "August 28, 2005"
  },
  {
    "temple_id": 229,
    "additionalInfo": false,
    "name": "Norfolk Virginia Temple",
    "location": "Virginia, United States",
    "dedicated": "Announced"
  },
  {
    "temple_id": 230,
    "additionalInfo": false,
    "name": "Nouméa New Caledonia Temple",
    "location": "New Caledonia",
    "dedicated": "Announced"
  },
  {
    "temple_id": 231,
    "additionalInfo": false,
    "name": "Nuku'alofa Tonga Temple",
    "location": "Liahona, Tongatapu, Tonga",
    "dedicated": "August 9, 1983"
  },
  {
    "temple_id": 232,
    "additionalInfo": false,
    "name": "Oakland California Temple",
    "location": "Oakland, California, United States",
    "dedicated": "November 17, 1964"
  },
  {
    "temple_id": 233,
    "additionalInfo": false,
    "name": "Oaxaca Mexico Temple",
    "location": "Oaxaca, Oaxaca, Mexico",
    "dedicated": "March 11, 2000"
  },
  {
    "temple_id": 234,
    "additionalInfo": false,
    "name": "Ogden Utah Temple",
    "location": "Ogden, Utah, United States",
    "dedicated": "January 18, 1972"
  },
  {
    "temple_id": 235,
    "additionalInfo": false,
    "name": "Okinawa Japan Temple",
    "location": "Okinawa, Japan",
    "dedicated": "November 12, 2023"
  },
  {
    "temple_id": 236,
    "additionalInfo": false,
    "name": "Oklahoma City Oklahoma Temple",
    "location": "Yukon, Oklahoma, United States",
    "dedicated": "July 30, 2000"
  },
  {
    "temple_id": 237,
    "additionalInfo": false,
    "name": "Oquirrh Mountain Utah Temple",
    "location": "South Jordan, Utah, United States",
    "dedicated": "August 21, 2009"
  },
  {
    "temple_id": 238,
    "additionalInfo": false,
    "name": "Orem Utah Temple",
    "location": "Orem, Utah, United States",
    "dedicated": "January 21, 2024"
  },
  {
    "temple_id": 239,
    "additionalInfo": false,
    "name": "Orlando Florida Temple",
    "location": "Windermere, Florida, United States",
    "dedicated": "Renovation"
  },
  {
    "temple_id": 240,
    "additionalInfo": false,
    "name": "Osaka Japan Temple",
    "location": "Japan",
    "dedicated": "Announced"
  },
  {
    "temple_id": 241,
    "additionalInfo": false,
    "name": "Oslo Norway Temple",
    "location": "Norway",
    "dedicated": "Announced"
  },
  {
    "temple_id": 242,
    "additionalInfo": false,
    "name": "Otavalo Ecuador Temple",
    "location": "Otavalo, Imbabura, Ecuador",
    "dedicated": "Announced"
  },
  {
    "temple_id": 243,
    "additionalInfo": false,
    "name": "Pachuca Mexico Temple",
    "location": "Mexico",
    "dedicated": "Announced"
  },
  {
    "temple_id": 244,
    "additionalInfo": false,
    "name": "Pago Pago American Samoa Temple",
    "location": "Tafuna, Western District, American Samoa",
    "dedicated": "Opening Soon"
  },
  {
    "temple_id": 245,
    "additionalInfo": false,
    "name": "Palmyra New York Temple",
    "location": "Palmyra, New York, United States",
    "dedicated": "April 6, 2000"
  },
  {
    "temple_id": 246,
    "additionalInfo": false,
    "name": "Panama City Panama Temple",
    "location": "Corozal, Ancon, Panamá, Panama",
    "dedicated": "August 10, 2008"
  },
  {
    "temple_id": 247,
    "additionalInfo": false,
    "name": "Papeete Tahiti Temple",
    "location": "Papeete, Tahiti, French Polynesia",
    "dedicated": "October 27, 1983"
  },
  {
    "temple_id": 248,
    "additionalInfo": false,
    "name": "Paris France Temple",
    "location": "Le Chesnay, France",
    "dedicated": "May 21, 2017"
  },
  {
    "temple_id": 249,
    "additionalInfo": false,
    "name": "Payson Utah Temple",
    "location": "Payson, Utah, United States",
    "dedicated": "June 7, 2015"
  },
  {
    "temple_id": 250,
    "additionalInfo": false,
    "name": "Perth Australia Temple",
    "location": "Yokine, Western Australia, Australia",
    "dedicated": "May 20, 2001"
  },
  {
    "temple_id": 251,
    "additionalInfo": false,
    "name": "Philadelphia Pennsylvania Temple",
    "location": "Philadelphia, Pennsylvania, United States",
    "dedicated": "September 18, 2016"
  },
  {
    "temple_id": 252,
    "additionalInfo": false,
    "name": "Phnom Penh Cambodia Temple",
    "location": "Phnom Penh, Cambodia",
    "dedicated": "August 30, 2026"
  },
  {
    "temple_id": 253,
    "additionalInfo": false,
    "name": "Phoenix Arizona Temple",
    "location": "Phoenix, Arizona, United States",
    "dedicated": "November 16, 2014"
  },
  {
    "temple_id": 254,
    "additionalInfo": false,
    "name": "Pittsburgh Pennsylvania Temple",
    "location": "Cranberry Township, Pennsylvania, United States",
    "dedicated": "September 15, 2024"
  },
  {
    "temple_id": 255,
    "additionalInfo": false,
    "name": "Piura Peru Temple",
    "location": "Peru",
    "dedicated": "Announced"
  },
  {
    "temple_id": 256,
    "additionalInfo": false,
    "name": "Pocatello Idaho Temple",
    "location": "Pocatello, Idaho, United States",
    "dedicated": "November 7, 2021"
  },
  {
    "temple_id": 257,
    "additionalInfo": false,
    "name": "Port Moresby Papua New Guinea Temple",
    "location": "Papua New Guinea",
    "dedicated": "Construction"
  },
  {
    "temple_id": 258,
    "additionalInfo": false,
    "name": "Port Vila Vanuatu Temple",
    "location": "Vanuatu",
    "dedicated": "Construction"
  },
  {
    "temple_id": 259,
    "additionalInfo": false,
    "name": "Port-au-Prince Haiti Temple",
    "location": "Port-au-Prince, Haiti",
    "dedicated": "September 1, 2019"
  },
  {
    "temple_id": 260,
    "additionalInfo": false,
    "name": "Portland Maine Temple",
    "location": "Portland, Maine, United States",
    "dedicated": "Announced"
  },
  {
    "temple_id": 261,
    "additionalInfo": false,
    "name": "Portland Oregon Temple",
    "location": "Lake Oswego, Oregon, United States",
    "dedicated": "August 19, 1989"
  },
  {
    "temple_id": 262,
    "additionalInfo": false,
    "name": "Porto Alegre Brazil Temple",
    "location": "Porto Alegre, Rio Grande do Sul, Brazil",
    "dedicated": "December 17, 2000"
  },
  {
    "temple_id": 263,
    "additionalInfo": false,
    "name": "Porto Portugal Temple",
    "location": "Portugal",
    "dedicated": "Announced"
  },
  {
    "temple_id": 264,
    "additionalInfo": false,
    "name": "Praia Cape Verde Temple",
    "location": "Praia, Cape Verde",
    "dedicated": "June 19, 2022"
  },
  {
    "temple_id": 265,
    "additionalInfo": false,
    "name": "Preston England Temple",
    "location": "Chorley, Lancashire, England",
    "dedicated": "June 7, 1998"
  },
  {
    "temple_id": 266,
    "additionalInfo": false,
    "name": "Price Utah Temple",
    "location": "Utah, United States",
    "dedicated": "Announced"
  },
  {
    "temple_id": 267,
    "additionalInfo": false,
    "name": "Provo City Center Temple",
    "location": "Provo, Utah, United States",
    "dedicated": "March 20, 2016"
  },
  {
    "temple_id": 268,
    "additionalInfo": false,
    "name": "Provo Utah Rock Canyon Temple",
    "location": "Provo, Utah, United States",
    "dedicated": "Renovation"
  },
  {
    "temple_id": 269,
    "additionalInfo": false,
    "name": "Puebla Mexico Temple",
    "location": "Puebla, Puebla, Mexico",
    "dedicated": "May 19, 2024"
  },
  {
    "temple_id": 270,
    "additionalInfo": false,
    "name": "Puerto Montt Chile Temple",
    "location": "Chile",
    "dedicated": "Announced"
  },
  {
    "temple_id": 271,
    "additionalInfo": false,
    "name": "Queen Creek Arizona Temple",
    "location": "Arizona, United States",
    "dedicated": "Announced"
  },
  {
    "temple_id": 272,
    "additionalInfo": false,
    "name": "Querétaro Mexico Temple",
    "location": "Mexico",
    "dedicated": "Construction"
  },
  {
    "temple_id": 273,
    "additionalInfo": false,
    "name": "Quetzaltenango Guatemala Temple",
    "location": "Quetzaltenango, Quezaltenango, Guatemala",
    "dedicated": "December 11, 2011"
  },
  {
    "temple_id": 274,
    "additionalInfo": false,
    "name": "Quito Ecuador Temple",
    "location": "Quito, Ecuador",
    "dedicated": "November 20, 2022"
  },
  {
    "temple_id": 275,
    "additionalInfo": false,
    "name": "Raleigh North Carolina Temple",
    "location": "Apex, North Carolina, United States",
    "dedicated": "December 18, 1999"
  },
  {
    "temple_id": 276,
    "additionalInfo": false,
    "name": "Rapid City South Dakota Temple",
    "location": "South Dakota, United States",
    "dedicated": "Announced"
  },
  {
    "temple_id": 277,
    "additionalInfo": false,
    "name": "Recife Brazil Temple",
    "location": "Recife, Pernambuco, Brazil",
    "dedicated": "December 15, 2000"
  },
  {
    "temple_id": 278,
    "additionalInfo": false,
    "name": "Red Cliffs Utah Temple",
    "location": "St. George, Utah, United States",
    "dedicated": "March 24, 2024"
  },
  {
    "temple_id": 279,
    "additionalInfo": false,
    "name": "Redlands California Temple",
    "location": "Redlands, California, United States",
    "dedicated": "September 14, 2003"
  },
  {
    "temple_id": 280,
    "additionalInfo": false,
    "name": "Regina Saskatchewan Temple",
    "location": "Regina, Saskatchewan, Canada",
    "dedicated": "November 14, 1999"
  },
  {
    "temple_id": 281,
    "additionalInfo": false,
    "name": "Reno Nevada Temple",
    "location": "Reno, Nevada, United States",
    "dedicated": "April 23, 2000"
  },
  {
    "temple_id": 282,
    "additionalInfo": false,
    "name": "Retalhuleu Guatemala Temple",
    "location": "Guatemala",
    "dedicated": "Announced"
  },
  {
    "temple_id": 283,
    "additionalInfo": false,
    "name": "Rexburg Idaho Temple",
    "location": "Rexburg, Idaho, United States",
    "dedicated": "February 10, 2008"
  },
  {
    "temple_id": 284,
    "additionalInfo": false,
    "name": "Reynosa Mexico Temple",
    "location": "Mexico",
    "dedicated": "Announced"
  },
  {
    "temple_id": 285,
    "additionalInfo": false,
    "name": "Ribeirão Prêto Brazil Temple",
    "location": "Brazil",
    "dedicated": "Construction"
  },
  {
    "temple_id": 286,
    "additionalInfo": false,
    "name": "Richmond Virginia Temple",
    "location": "Glen Allen, Virginia, United States",
    "dedicated": "May 7, 2023"
  },
  {
    "temple_id": 287,
    "additionalInfo": false,
    "name": "Rio de Janeiro Brazil Temple",
    "location": "Rio de Janeiro, Brazil",
    "dedicated": "May 8, 2022"
  },
  {
    "temple_id": 288,
    "additionalInfo": false,
    "name": "Rivera Uruguay Temple",
    "location": "Uruguay",
    "dedicated": "Announced"
  },
  {
    "temple_id": 289,
    "additionalInfo": false,
    "name": "Roanoke Virginia Temple",
    "location": "Virginia, United States",
    "dedicated": "Announced"
  },
  {
    "temple_id": 290,
    "additionalInfo": false,
    "name": "Rome Italy Temple",
    "location": "Rome, Roma, Italy",
    "dedicated": "March 10, 2019"
  },
  {
    "temple_id": 291,
    "additionalInfo": false,
    "name": "Rosario Argentina Temple",
    "location": "Argentina",
    "dedicated": "Announced"
  },
  {
    "temple_id": 292,
    "additionalInfo": false,
    "name": "Russia Temple",
    "location": "Russia",
    "dedicated": "Announced"
  },
  {
    "temple_id": 293,
    "additionalInfo": false,
    "name": "Sacramento California Temple",
    "location": "Rancho Cordova, California, United States",
    "dedicated": "September 3, 2006"
  },
  {
    "temple_id": 294,
    "additionalInfo": false,
    "name": "Salt Lake Temple",
    "location": "Salt Lake City, Utah, United States",
    "dedicated": "Renovation"
  },
  {
    "temple_id": 295,
    "additionalInfo": false,
    "name": "Salta Argentina Temple",
    "location": "Salta, Argentina",
    "dedicated": "June 16, 2024"
  },
  {
    "temple_id": 296,
    "additionalInfo": false,
    "name": "Salvador Brazil Temple",
    "location": "Salvador, Bahia, Brazil",
    "dedicated": "October 20, 2024"
  },
  {
    "temple_id": 297,
    "additionalInfo": false,
    "name": "San Antonio Texas Temple",
    "location": "San Antonio, Texas, United States",
    "dedicated": "May 22, 2005"
  },
  {
    "temple_id": 298,
    "additionalInfo": false,
    "name": "San Diego California Temple",
    "location": "San Diego, California, United States",
    "dedicated": "April 25, 1993"
  },
  {
    "temple_id": 299,
    "additionalInfo": false,
    "name": "San José Costa Rica Temple",
    "location": "Belén, Heredia, Costa Rica",
    "dedicated": "June 4, 2000"
  },
  {
    "temple_id": 300,
    "additionalInfo": false,
    "name": "San Jose del Monte Philippines Temple",
    "location": "Philippines",
    "dedicated": "Announced"
  },
  {
    "temple_id": 301,
    "additionalInfo": false,
    "name": "San Juan Puerto Rico Temple",
    "location": "San Juan, Puerto Rico",
    "dedicated": "January 15, 2023"
  },
  {
    "temple_id": 302,
    "additionalInfo": false,
    "name": "San Luis Potosí Mexico Temple",
    "location": "Mexico",
    "dedicated": "Opening Soon"
  },
  {
    "temple_id": 303,
    "additionalInfo": false,
    "name": "San Pedro Sula Honduras Temple",
    "location": "San Pedro Sula, Honduras",
    "dedicated": "October 13, 2024"
  },
  {
    "temple_id": 304,
    "additionalInfo": false,
    "name": "San Salvador El Salvador Temple",
    "location": "Antiguo Cuscatlán, La Libertad, El Salvador",
    "dedicated": "August 21, 2011"
  },
  {
    "temple_id": 305,
    "additionalInfo": false,
    "name": "Santa Ana El Salvador Temple",
    "location": "El Salvador",
    "dedicated": "Announced"
  },
  {
    "temple_id": 306,
    "additionalInfo": false,
    "name": "Santa Cruz Bolivia Temple",
    "location": "Bolivia",
    "dedicated": "Construction"
  },
  {
    "temple_id": 307,
    "additionalInfo": false,
    "name": "Santiago Chile Temple",
    "location": "Providencia, Santiago, Chile",
    "dedicated": "September 15, 1983"
  },
  {
    "temple_id": 308,
    "additionalInfo": false,
    "name": "Santiago Dominican Republic Temple",
    "location": "Dominican Republic",
    "dedicated": "Announced"
  },
  {
    "temple_id": 309,
    "additionalInfo": false,
    "name": "Santiago Philippines Temple",
    "location": "Philippines",
    "dedicated": "Announced"
  },
  {
    "temple_id": 310,
    "additionalInfo": false,
    "name": "Santiago West Chile Temple",
    "location": "Chile",
    "dedicated": "Construction"
  },
  {
    "temple_id": 311,
    "additionalInfo": false,
    "name": "Santo Domingo Dominican Republic Temple",
    "location": "Santo Domingo, Distrito Nacional, Dominican Republic",
    "dedicated": "September 17, 2000"
  },
  {
    "temple_id": 312,
    "additionalInfo": false,
    "name": "Santos Brazil Temple",
    "location": "Brazil",
    "dedicated": "Construction"
  },
  {
    "temple_id": 313,
    "additionalInfo": false,
    "name": "São Paulo Brazil Temple",
    "location": "São Paulo, Sao Paulo, Brazil",
    "dedicated": "October 30, 1978"
  },
  {
    "temple_id": 314,
    "additionalInfo": false,
    "name": "São Paulo East Brazil Temple",
    "location": "Brazil",
    "dedicated": "Announced"
  },
  {
    "temple_id": 315,
    "additionalInfo": false,
    "name": "Sapporo Japan Temple",
    "location": "Atsubetsu-ku Sapporo, Hokkaido, Japan",
    "dedicated": "August 21, 2016"
  },
  {
    "temple_id": 316,
    "additionalInfo": false,
    "name": "Saratoga Springs Utah Temple",
    "location": "Saratoga Springs, Utah, United States",
    "dedicated": "August 13, 2023"
  },
  {
    "temple_id": 317,
    "additionalInfo": false,
    "name": "Savai'i Samoa Temple",
    "location": "Samoa",
    "dedicated": "Announced"
  },
  {
    "temple_id": 318,
    "additionalInfo": false,
    "name": "Seattle Washington Temple",
    "location": "Bellevue, Washington, United States",
    "dedicated": "November 17, 1980"
  },
  {
    "temple_id": 319,
    "additionalInfo": false,
    "name": "Seoul Korea Temple",
    "location": "Seoul, Seoul-teukbyeolsi, South Korea",
    "dedicated": "December 14, 1985"
  },
  {
    "temple_id": 320,
    "additionalInfo": false,
    "name": "Shanghai People's Republic of China Temple",
    "location": "China",
    "dedicated": "Announced"
  },
  {
    "temple_id": 321,
    "additionalInfo": false,
    "name": "Singapore Temple",
    "location": "Singapore",
    "dedicated": "Construction"
  },
  {
    "temple_id": 322,
    "additionalInfo": false,
    "name": "Smithfield Utah Temple",
    "location": "Utah, United States",
    "dedicated": "Construction"
  },
  {
    "temple_id": 323,
    "additionalInfo": false,
    "name": "Snowflake Arizona Temple",
    "location": "Snowflake, Arizona, United States",
    "dedicated": "March 3, 2002"
  },
  {
    "temple_id": 324,
    "additionalInfo": false,
    "name": "Spanish Fork Utah Temple",
    "location": "Utah, United States",
    "dedicated": "Announced"
  },
  {
    "temple_id": 325,
    "additionalInfo": false,
    "name": "Spokane Washington Temple",
    "location": "Spokane, Washington, United States",
    "dedicated": "August 21, 1999"
  },
  {
    "temple_id": 326,
    "additionalInfo": false,
    "name": "Springfield Missouri Temple",
    "location": "Missouri, United States",
    "dedicated": "Construction"
  },
  {
    "temple_id": 327,
    "additionalInfo": false,
    "name": "St. George Utah Temple",
    "location": "St. George, Utah, United States",
    "dedicated": "April 6, 1877"
  },
  {
    "temple_id": 328,
    "additionalInfo": false,
    "name": "St. Louis Missouri Temple",
    "location": "St. Louis, Missouri, United States",
    "dedicated": "June 1, 1997"
  },
  {
    "temple_id": 329,
    "additionalInfo": false,
    "name": "St. Paul Minnesota Temple",
    "location": "Oakdale, Minnesota, United States",
    "dedicated": "January 9, 2000"
  },
  {
    "temple_id": 330,
    "additionalInfo": false,
    "name": "Star Valley Wyoming Temple",
    "location": "Afton, Wyoming, United States",
    "dedicated": "October 30, 2016"
  },
  {
    "temple_id": 331,
    "additionalInfo": false,
    "name": "Stockholm Sweden Temple",
    "location": "Vasterhaninge, Sweden",
    "dedicated": "Renovation"
  },
  {
    "temple_id": 332,
    "additionalInfo": false,
    "name": "Summit New Jersey Temple",
    "location": "New Jersey, United States",
    "dedicated": "Announced"
  },
  {
    "temple_id": 333,
    "additionalInfo": false,
    "name": "Sunnyvale California Temple",
    "location": "California, United States",
    "dedicated": "Announced"
  },
  {
    "temple_id": 334,
    "additionalInfo": false,
    "name": "Suva Fiji Temple",
    "location": "Samabula, Suva, Fiji",
    "dedicated": "June 18, 2000"
  },
  {
    "temple_id": 335,
    "additionalInfo": false,
    "name": "Sydney Australia Temple",
    "location": "Carlingford, New South Wales, Australia",
    "dedicated": "September 20, 1984"
  },
  {
    "temple_id": 336,
    "additionalInfo": false,
    "name": "Syracuse Utah Temple",
    "location": "Syracuse, Utah, United States",
    "dedicated": "June 8, 2025"
  },
  {
    "temple_id": 337,
    "additionalInfo": false,
    "name": "Tacloban City Philippines Temple",
    "location": "Philippines",
    "dedicated": "Construction"
  },
  {
    "temple_id": 338,
    "additionalInfo": false,
    "name": "Tacoma Washington Temple",
    "location": "Washington, United States",
    "dedicated": "Announced"
  },
  {
    "temple_id": 339,
    "additionalInfo": false,
    "name": "Taipei Taiwan Temple",
    "location": "Taipei, Taipei, Taiwan",
    "dedicated": "November 17, 1984"
  },
  {
    "temple_id": 340,
    "additionalInfo": false,
    "name": "Tallahassee Florida Temple",
    "location": "Tallahassee, Florida, United States",
    "dedicated": "December 8, 2024"
  },
  {
    "temple_id": 341,
    "additionalInfo": false,
    "name": "Tampa Florida Temple",
    "location": "Florida, United States",
    "dedicated": "Construction"
  },
  {
    "temple_id": 342,
    "additionalInfo": false,
    "name": "Tampico Mexico Temple",
    "location": "Ciudad Madero, Tamaulipas, Mexico",
    "dedicated": "May 20, 2000"
  },
  {
    "temple_id": 343,
    "additionalInfo": false,
    "name": "Tarawa Kiribati Temple",
    "location": "Kiribati",
    "dedicated": "Construction"
  },
  {
    "temple_id": 344,
    "additionalInfo": false,
    "name": "Taylorsville Utah Temple",
    "location": "Taylorsville, Utah, United States",
    "dedicated": "June 2, 2024"
  },
  {
    "temple_id": 345,
    "additionalInfo": false,
    "name": "Tegucigalpa Honduras Temple",
    "location": "Comayagüela, Francisco Morazán, Honduras",
    "dedicated": "March 17, 2013"
  },
  {
    "temple_id": 346,
    "additionalInfo": false,
    "name": "Teresina Brazil Temple",
    "location": "Brazil",
    "dedicated": "Construction"
  },
  {
    "temple_id": 347,
    "additionalInfo": false,
    "name": "Teton River Idaho Temple",
    "location": "Idaho, United States",
    "dedicated": "Construction"
  },
  {
    "temple_id": 348,
    "additionalInfo": false,
    "name": "The Gila Valley Arizona Temple",
    "location": "Central, Arizona, United States",
    "dedicated": "May 23, 2010"
  },
  {
    "temple_id": 349,
    "additionalInfo": false,
    "name": "The Hague Netherlands Temple",
    "location": "Zoetermeer, Zuid-Holland, Netherlands",
    "dedicated": "September 8, 2002"
  },
  {
    "temple_id": 350,
    "additionalInfo": false,
    "name": "Tijuana Mexico Temple",
    "location": "Tijuana, Baja California, Mexico",
    "dedicated": "December 13, 2015"
  },
  {
    "temple_id": 351,
    "additionalInfo": false,
    "name": "Tokyo Japan Temple",
    "location": "Minato-ku, Tokyo, Japan",
    "dedicated": "October 27, 1980"
  },
  {
    "temple_id": 352,
    "additionalInfo": false,
    "name": "Toluca Mexico Temple",
    "location": "Mexico",
    "dedicated": "Announced"
  },
  {
    "temple_id": 353,
    "additionalInfo": false,
    "name": "Toronto Ontario Temple",
    "location": "Brampton, Ontario, Canada",
    "dedicated": "August 25, 1990"
  },
  {
    "temple_id": 354,
    "additionalInfo": false,
    "name": "Torreón Mexico Temple",
    "location": "Mexico",
    "dedicated": "Opening Soon"
  },
  {
    "temple_id": 355,
    "additionalInfo": false,
    "name": "Trujillo Peru Temple",
    "location": "Trujillo, La Libertad, Peru",
    "dedicated": "June 21, 2015"
  },
  {
    "temple_id": 356,
    "additionalInfo": false,
    "name": "Tucson Arizona Temple",
    "location": "Tucson, Arizona, United States",
    "dedicated": "August 13, 2017"
  },
  {
    "temple_id": 357,
    "additionalInfo": false,
    "name": "Tuguegarao City Philippines Temple",
    "location": "Philippines",
    "dedicated": "Announced"
  },
  {
    "temple_id": 358,
    "additionalInfo": false,
    "name": "Tula Mexico Temple",
    "location": "Mexico",
    "dedicated": "Announced"
  },
  {
    "temple_id": 359,
    "additionalInfo": false,
    "name": "Tulsa Oklahoma Temple",
    "location": "Oklahoma, United States",
    "dedicated": "Construction"
  },
  {
    "temple_id": 360,
    "additionalInfo": false,
    "name": "Tuxtla Gutiérrez Mexico Temple",
    "location": "Tuxtla Gutiérrez, Chiapas, Mexico",
    "dedicated": "March 12, 2000"
  },
  {
    "temple_id": 361,
    "additionalInfo": false,
    "name": "Twin Falls Idaho Temple",
    "location": "Twin Falls, Idaho, United States",
    "dedicated": "August 24, 2008"
  },
  {
    "temple_id": 362,
    "additionalInfo": false,
    "name": "Ulaanbaatar Mongolia Temple",
    "location": "Mongolia",
    "dedicated": "Announced"
  },
  {
    "temple_id": 363,
    "additionalInfo": false,
    "name": "Urdaneta Philippines Temple",
    "location": "Urdaneta, Pangasinan, Philippines",
    "dedicated": "April 28, 2024"
  },
  {
    "temple_id": 364,
    "additionalInfo": false,
    "name": "Uturoa French Polynesia Temple",
    "location": "French Polynesia",
    "dedicated": "Announced"
  },
  {
    "temple_id": 365,
    "additionalInfo": false,
    "name": "Uyo Nigeria Temple",
    "location": "Nigeria",
    "dedicated": "Announced"
  },
  {
    "temple_id": 366,
    "additionalInfo": false,
    "name": "Vancouver British Columbia Temple",
    "location": "Langley, British Columbia, Canada",
    "dedicated": "May 2, 2010"
  },
  {
    "temple_id": 367,
    "additionalInfo": false,
    "name": "Vancouver Washington Temple",
    "location": "Washington, United States",
    "dedicated": "Construction"
  },
  {
    "temple_id": 368,
    "additionalInfo": false,
    "name": "Veracruz Mexico Temple",
    "location": "Boca del Rio, Veracruz, Mexico",
    "dedicated": "July 9, 2000"
  },
  {
    "temple_id": 369,
    "additionalInfo": false,
    "name": "Vernal Utah Temple",
    "location": "Vernal, Utah, United States",
    "dedicated": "November 2, 1997"
  },
  {
    "temple_id": 370,
    "additionalInfo": false,
    "name": "Victoria British Columbia Temple",
    "location": "Canada",
    "dedicated": "Construction"
  },
  {
    "temple_id": 371,
    "additionalInfo": false,
    "name": "Vienna Austria Temple",
    "location": "Austria",
    "dedicated": "Announced"
  },
  {
    "temple_id": 372,
    "additionalInfo": false,
    "name": "Villahermosa Mexico Temple",
    "location": "Villahermosa, Tabasco, Mexico",
    "dedicated": "May 21, 2000"
  },
  {
    "temple_id": 373,
    "additionalInfo": false,
    "name": "Viña del Mar Chile Temple",
    "location": "Chile",
    "dedicated": "Announced"
  },
  {
    "temple_id": 374,
    "additionalInfo": false,
    "name": "Vitória Brazil Temple",
    "location": "Brazil",
    "dedicated": "Announced"
  },
  {
    "temple_id": 375,
    "additionalInfo": false,
    "name": "Washington D.C. Temple",
    "location": "Kensington, Maryland, United States",
    "dedicated": "November 19, 1974"
  },
  {
    "temple_id": 376,
    "additionalInfo": false,
    "name": "Wellington New Zealand Temple",
    "location": "New Zealand",
    "dedicated": "Construction"
  },
  {
    "temple_id": 377,
    "additionalInfo": false,
    "name": "West Jordan Utah Temple",
    "location": "Utah, United States",
    "dedicated": "Announced"
  },
  {
    "temple_id": 378,
    "additionalInfo": false,
    "name": "Wichita Kansas Temple",
    "location": "Kansas, United States",
    "dedicated": "Opening Soon"
  },
  {
    "temple_id": 379,
    "additionalInfo": false,
    "name": "Willamette Valley Oregon Temple",
    "location": "Oregon, United States",
    "dedicated": "June 7, 2026"
  },
  {
    "temple_id": 380,
    "additionalInfo": false,
    "name": "Winchester Virginia Temple",
    "location": "Virginia, United States",
    "dedicated": "Construction"
  },
  {
    "temple_id": 381,
    "additionalInfo": false,
    "name": "Winnipeg Manitoba Temple",
    "location": "Winnipeg, Manitoba, Canada",
    "dedicated": "October 31, 2021"
  },
  {
    "temple_id": 382,
    "additionalInfo": false,
    "name": "Winter Quarters Nebraska Temple",
    "location": "Omaha, Nebraska, United States",
    "dedicated": "April 22, 2001"
  },
  {
    "temple_id": 383,
    "additionalInfo": false,
    "name": "Yigo Guam Temple",
    "location": "Yigo, Guam",
    "dedicated": "May 22, 2022"
  },
  {
    "temple_id": 384,
    "additionalInfo": false,
    "name": "Yorba Linda California Temple",
    "location": "California, United States",
    "dedicated": "June 7, 2026"
  },
  {
    "temple_id": 385,
    "additionalInfo": false,
    "name": "Yuma Arizona Temple",
    "location": "Arizona, United States",
    "dedicated": "Announced"
  }
]