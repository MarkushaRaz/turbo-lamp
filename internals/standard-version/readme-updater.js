const regex = /(version-)(\d+\.\d+.\d+(?:\.\w+\.\d+)?)(-)/g;

module.exports.readVersion = (contents) => {
  const matches = regex.exec(contents);
  return matches[2];
};

module.exports.writeVersion = (contents, version) => contents.replace(regex, `$1${version.replace('-', '.')}$3`);
