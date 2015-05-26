var fs = require('fs');
var parse = require('csv-parse');

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
parser.on('readable', function() {
  while(record = parser.read()) {
    console.log(record);
  }
});

function displayHelp() {
  console.log("Usage: node index.js FILE...");
}

function readFile(filename) {
  fs.createReadStream(filename)
    .pipe(parser);
}

if (process.argv.length > 2) {
  process.argv.slice(2).forEach(function(arg, index) {
    readFile(arg);
  });
}
else {
  displayHelp();
}

