var fs = require('fs');
var parse = require('csv-parse');
var through2 = require('through2');
var request = require('request');
var _ = require('underscore');

var logger = require('./logger');
var readAuth = require('./read_auth');

var botlerUrl = "http://localhost:3000/";

var columns = [
  'id',
  'paid_on',
  'category',
  'subcategory',
  'description',
  'supplier',
  'amount',
  'vat',
  'amount_w_vat',
  'cost_center',
  'payment_method'
];
var parser = parse({ 'columns': columns });

function readExpenseFile(filename, callback) {
  var expenses = [];

  fs.createReadStream(filename)
    .on('error', handleError)
    .pipe(parser)
    .pipe(expenseTransformer())
    .on('data', function(expense) {
      expenses.push(expense);
    })
    .on('end', function() {
      callback(expenses);
    })
    .on('error', handleError);
}

function expenseTransformer() {
  return through2.obj(function(expense, enc, callback) {
    filteredExpense = _.omit(expense, ['id', 'category', 'amount_w_vat']);
    filteredExpense.user_id = 1;
    this.push(filteredExpense);
    callback();
  });
}

function sendExpenses(requestOptions, expenses) {
  expense = expenses.pop();
  request.post(requestOptions)
    .form({ 'expense': expense })
    .on('response', function(response) {
      handleResponse(response, requestOptions, expense, expenses);
    })
    .on('error', handleError);
}

function handleResponse(response, requestOptions, current_expense, expenses) {
  if(response.statusCode == 201) {
    logger.log("Sent '" + current_expense.description + "'.");
  }
  else {
    logger.log("Error sending '" + current_expense.description +
                "': " + response.statusCode);
  }
  if(expenses.length > 0) {
    sendExpenses(requestOptions, expenses);
  }
}

function displayHelp() {
  logger.log("Usage: node index.js FILE...");
}

function handleError(error) {
  logger.error(error);
  process.exit(1);
}

if (process.argv.length > 2) {
  readAuth(function(err, auth) {
    if(err) {
      handleError(err);
      return;
    }
    process.argv.slice(2).forEach(function(arg, index) {
      readExpenseFile(arg, function(expenses) {
        logger.log("Sending " + expenses.length + " expenses:");
        var requestOptions = {
          url: botlerUrl + "api/expenses", 
          auth: auth
        };
        sendExpenses(requestOptions, expenses);
      });
    });
  });
}
else {
  displayHelp();
}

