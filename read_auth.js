var prompt = require('prompt');

var schema = {
  properties: {
    user: {
      message: 'Email',
      required: true
    },
    pass: {
      message: 'Password',
      hidden: true
    }
  }
};

module.exports = readAuth
  
function readAuth(callback) {
  prompt.start();
  prompt.get(schema, callback);
}

