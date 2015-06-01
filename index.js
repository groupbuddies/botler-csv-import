var readFiles = require('./read_expense_files.js');
var parser = require('./expense_parser');
var transformer = require('./expense_transformer');
var api = require('./botler_api');
var logger = require('./logger');
var readAuth = require('./read_auth');

function displayHelp() {
  logger.log("Usage: node index.js FILE...");
}

function handleError(error) {
  logger.error(error);
  process.exit(1);
}

function parseAndSend(err, auth) {
  if(err) {
    handleError(err);
    return;
  }
  readFiles(process.argv.slice(2), parser, transformer, logger, handleError,
            function(expenses) {
    api.createExpenses(expenses, auth, logger, handleError);
  });
}

function main(args) {
  if (args.length > 2) {
    readAuth(parseAndSend);
  }
  else {
    displayHelp();
  }
}

main(process.argv);

