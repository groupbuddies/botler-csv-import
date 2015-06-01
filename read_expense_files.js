
var fs = require('fs');

module.exports = readFiles;

function readFiles(filenames, parser, transformer, logger, handleError, callback) {
  filenames.forEach(function(filename, index) {
    readExpenseFile(filename, parser, transformer, logger, handleError, callback);
  });
}

function readExpenseFile(filename, parser, transformer, logger, handleError, callback) {
  var expenses = [];

  logger.log("Reading: " + filename);
  fs.createReadStream(filename)
    .on('error', handleError)
    .pipe(parser)
    .pipe(transformer)
    .on('data', function(expense) {
      expenses.push(expense);
    })
    .on('end', function() {
      callback(expenses);
    })
    .on('error', handleError);
}

