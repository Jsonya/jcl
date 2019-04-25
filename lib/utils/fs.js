
const fs = require('fs');
const os = require('os');
const path = require('path');

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
  } catch (err) {
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
  } catch (err) {
    console.log(chalk.yellow('[error]:'), chalk.green('README.md 文件不存在，构建中...'));
  }
}

function deleteFile(file) {
  try {
    fs.unlinkSync(file);
    return true;
  } catch (err) {
    return null;
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
  let newLevel = level;
  newLevel -= 1;
  while (newLevel !== 0) {
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
  const data = `* ${item}${linebreak}`;
  fs.appendFileSync(file, data);
}

/**
 * 单纯写内容
 * @param {*} file
 * @param {*} content
 */
function writeContent(file, content) {
  const data = `${content}${linebreak}${linebreak}`;
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
  } catch (e) {
    return false;
  }
  return true;
}

/**
 * 获取文件
 * @param {*} newPath
 * @returns
 */
function getStat(newPath) {
  return new Promise((resolve) => {
    fs.stat(newPath, (err, stats) => {
      if (err) {
        resolve(false);
      } else {
        resolve(stats);
      }
    });
  });
}

/**
 * 创建一个文件夹
 * @param {*} dir
 * @returns
 */
function mkdir(dir) {
  return new Promise((resolve) => {
    fs.mkdir(dir, (err) => {
      if (err) {
        resolve(false);
      } else {
        resolve(true);
      }
    });
  });
}

/**
 * 判断文件夹是否存在，不存在就创建
 * @param {*} dir
 * @returns
 */
async function dirExists(dir) {
  // 判断有没有这个文件夹
  const isExists = await getStat(dir);
  // 如果是一个文件夹，就告知
  if (isExists && isExists.isDirectory()) {
    return true;
  }
  // 如果不是个文件夹，不处理
  if (isExists) {
    return false;
  }
  // 获取到父层路径
  const tempDir = path.parse(dir).dir;
  // 递归, 你可以理解成洋葱模型，从外层开始执行逐层添加文件夹
  const status = await dirExists(tempDir);
  let mkdirStatus;
  if (status) {
    // 如果最后一层创建完就返回
    mkdirStatus = await mkdir(dir);
  }
  // 将创建后的信息返回
  return mkdirStatus;
}

module.exports = {
  readFile,
  deleteREADME,
  writeTitle,
  writeItem,
  writeContent,
  fsExistsSync,
  deleteFile,
  dirExists,
};
