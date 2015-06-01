
var request = require('request');

var botlerUrl = "http://localhost:3000/";

module.exports = {
  createExpenses: createExpenses
};

function createExpenses(expenses, auth, logger, handleError) {
  var requestOptions = {
    url: botlerUrl + "api/expenses", 
    auth: auth
  };
  logger.log("Sending " + expenses.length + " expenses:");
  sendExpenses(requestOptions, expenses, logger, handleError);
}

function sendExpenses(requestOptions, expenses, logger, handleError) {
  expense = expenses.pop();
  request.post(requestOptions)
    .form({ 'expense': expense })
    .on('response', function(response) {
      handleResponse(response, requestOptions, expense, expenses, logger, handleError);
    })
    .on('error', handleError);
}

function handleResponse(response, requestOptions, current_expense, expenses,
                        logger, handleError) {
  if(response.statusCode == 201) {
    logger.log("Sent '" + current_expense.description + "'.");
  }
  else {
    logger.log("Error sending '" + current_expense.description +
                "': " + response.statusCode);
  }
  if(expenses.length > 0) {
    sendExpenses(requestOptions, expenses, logger, handleError);
  }
}

