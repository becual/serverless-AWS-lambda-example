'use strict';
var moment = require('moment');
var cep = require('./cep');

module.exports.hello = (event, context, callback) => {
  var data = moment();
  const response = {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Go Serverless v1.0! Your function executed successfully!',
      input: event,
      data: data.toDate()
    }),
  };

  callback(null, response);
};


module.exports.bye = async (event, context, callback) => {
  var data = moment();
  const response = {
    statusCode: 200,
    body: JSON.stringify({
      bye: 'adios amiguito!',
      cep: await cep()
    }),
  };

  callback(null, response);
};