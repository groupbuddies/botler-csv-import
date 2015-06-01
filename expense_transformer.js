
var through2 = require('through2');
var _ = require('underscore');

function expenseTransformer() {
  return through2.obj(function(expense, enc, callback) {
    filteredExpense = _.omit(expense, ['id', 'category', 'amount_w_vat']);
    filteredExpense.user_id = 1;
    this.push(filteredExpense);
    callback();
  });
}

var transformer = expenseTransformer();

module.exports = transformer;

