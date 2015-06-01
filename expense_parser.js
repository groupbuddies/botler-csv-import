
var parse = require('csv-parse');

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

module.exports = parser;

