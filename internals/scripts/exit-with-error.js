function exitWithError(error) {
  console.log(error);
  process.exit(2);
}

module.exports = exitWithError;
