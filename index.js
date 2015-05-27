var fs = require('fs');
var parse = require('csv-parse');
var _ = require('underscore');
var through2 = require('through2');

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

function displayHelp() {
  console.log("Usage: node index.js FILE...");
}

function readFile(filename) {
  fs.createReadStream(filename)
    .pipe(parser)
    .pipe(expenseTransformer())
    .on('data', function(data) {
      console.log(data);
    });
}

function expenseTransformer() {
  return through2.obj(function(expense, enc, callback) {
    filteredExpense = _.omit(expense, ['id', 'amount_w_vat']);
    this.push(filteredExpense);
    callback();
  });
}

if (process.argv.length > 2) {
  process.argv.slice(2).forEach(function(arg, index) {
    readFile(arg);
  });
}
else {
  displayHelp();
}

