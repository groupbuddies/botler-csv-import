var fs = require('fs');
var parse = require('csv-parse');
var through2 = require('through2');
var request = require('request');
var _ = require('underscore');

var readAuth = require('./read_auth');

var botlerUrl = "http://localhost:3000/";

var columns = [
  'id',
  'date',
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
    filteredExpense = _.omit(expense, ['id', 'amount_w_vat']);
    this.push(filteredExpense);
    callback();
  });
}

function sendExpenses(auth, expenses) {
  var requestOptions = {
    url: botlerUrl + "api/expenses", 
    auth: auth
  };
  expense = expenses.pop();
  request.post(requestOptions)
    .form({ 'expense': expense })
    .on('response', handleResponse);
}

function handleResponse(err, response) {
  if(err) handleError(err);
  if(response.statusCode == 201) {
    sendExpenses(auth, expenses);
  }
  else {
    console.log("Error sending " + expense.description + ": " + response.statusCode);
  }
}

function displayHelp() {
  console.log("Usage: node index.js FILE...");
}

function handleError(error) {
  console.log(error);
  process.exit(1);
}

if (process.argv.length > 2) {
  process.argv.slice(2).forEach(function(arg, index) {
    readAuth(function(err, auth) {
      if(err) handleError(err);
      readExpenseFile(arg, function(expenses) {
        sendExpenses(auth, expenses);
      });
    });
  });
}
else {
  displayHelp();
}

