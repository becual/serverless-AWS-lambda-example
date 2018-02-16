'use strict';
var moment = require('moment');
var cep = require('./chupaelpico');

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

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // callback(null, { message: 'Go Serverless v1.0! Your function executed successfully!', event });
};


module.exports.bye = async (event, context, callback) => {
  var data = moment();
  const response = {
    statusCode: 200,
    body: JSON.stringify({
      bye: 'bye ctm',
      cep: await cep()
    }),
  };

  callback(null, response);

};