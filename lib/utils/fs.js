
const fs = require('fs');
const os = require('os');
const linebreak = os.EOL;
const chalk = require('chalk');

/**
 * 读取文件
 * @param {*} filename
 * @param {*} encoding
 * @returns
 */
function readFile(filename, encoding) {
  try {
    return fs.readFileSync(filename).toString(encoding);
  }
  catch (err) {
    return null;
  }
}

/**
 * 删除文件
 * @param {*} file
 */
function deleteREADME(file) {
  try {
    fs.unlinkSync(file);
  }
  catch (err) {
    console.log(chalk.yellow('[error]:'), chalk.green('README.md 文件不存在，构建中...'));
  }
}

/**
 * 写标题
 * @param {*} file
 * @param {*} title
 * @param {*} level
 */
function writeTitle(file, title, level) {
  let data = '';
  while (level-- !== 0) {
    data += '#';
  }
  data += ` ${title}${linebreak}`;
  fs.appendFileSync(file, data);
}

/**
 * 写列表
 * @param {*} file
 * @param {*} item
 */
function writeItem(file, item) {
  let data = `* ${item}${linebreak}`;
  fs.appendFileSync(file, data);
}

/**
 * 单纯写内容
 * @param {*} file
 * @param {*} content
 */
function writeContent(file, content) {
  let data = `${content}${linebreak}${linebreak}`;
  fs.appendFileSync(file, data);
}

/**
 * 判断文件是否存在
 * @param {*} file
 * @returns
 */
function fsExistsSync(file) {
  try {
    fs.accessSync(file, fs.F_OK);
  } catch(e) {
    return false;
  }
  return true;
}

module.exports = {
  readFile,
  deleteREADME,
  writeTitle,
  writeItem,
  writeContent,
  fsExistsSync,
};
