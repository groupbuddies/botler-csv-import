
module.exports = {
  log: log,
  error: error
};

function log(data) {
  console.log(data);
}

function error(data) {
  console.error(data);
}

