
const shell = require('shelljs');
const path = require('path');

module.exports = function init(info) {
  console.log(info);
  const dir = path.resolve();
  shell.mkdir('-p', path.join(dir, `/${info.name}`));
  shell.cp('-Rf', path.join(dir, '/lib/cli-template/simple/*'), path.join(dir, `/${info.name}`));
};
