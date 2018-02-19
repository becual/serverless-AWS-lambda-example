'use strict';
var moment = require('moment');
var cep = require('./cep');

module.exports.hello = (event, context, callback) => {
  var data = moment();
  const response = {
    statusCode: 200,
    body: JSON.stringify({
      message: 'entregala los enevtos y la fecha!',
      input: event,
      context: context,
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