/**
 * 根据hexo的文章自动生成readme文件，并自动提交到github触发travis构建
 */
const path = require('path');
const fs = require('fs');
const chalk = require('chalk');
const shell = require('shelljs');
const {
  writeTitle,
  deleteREADME,
  writeContent,
  writeItem,
  readFile,
  fsExistsSync,
} = require('./utils/fs');
const { formatTime } = require('./utils/date');

const dir = path.resolve();
const readmeFile = path.join(dir, '/README.md');
// 文件
const articleMark = '/source/_posts';
// 文件地址
const articleDir = path.join(dir, articleMark);
// 博客地址
const blogSitePrefix = 'https://blog.jsonya.com';
// travis地址
const travisGithub = 'https://travis-ci.org/Jsonya/jsonya.github.io';
// 构建的标志
const defaultTitle = `[![Build Status](${travisGithub}.svg?branch=raw)](${travisGithub})`;

function changeReadme() {
  // 先判断下文件夹在不在，不在就提示
  if (!fsExistsSync(articleDir)) {
    console.error(chalk.yellow('[error]:'), chalk.red('不存在文章路径'));
    return;
  }

  // 先去删除旧文件
  deleteREADME(readmeFile);
  // 写入顶部一级标题
  writeTitle(readmeFile, '博客', 1);
  // 写入构建标志
  writeContent(readmeFile, defaultTitle);
  // 写入二级目录
  writeTitle(readmeFile, '目录', 2);

  // 循环读取文件并写入
  function loopReadFile() {
    // 读取这个文件夹下的文件
    const files = fs.readdirSync(articleDir);
    files.forEach((pathname, index) => {
      // md文件才去处理
      if (pathname.indexOf('.md') > -1) {
        // 将md文件的内容读取出来,返回字符串
        const content = readFile(path.join(articleDir, `/${pathname}`), 'utf8');
        // 根据换行符切割
        const dateContent = content.split('\n');
        // 将文件生成的时间拿出来
        const date = dateContent[2].replace('date: ', '');
        // 匹配需要的格式
        const dateFormat = formatTime(date, 'yyyy/MM/dd');
        // 获取标题
        const title = pathname.replace('.md', '');
        // 组合成一个列
        const item = `[${title}](${blogSitePrefix}/${dateFormat}/${title})`;
        // 写入
        writeItem(readmeFile, item);
        console.log(chalk.green(`[创建第${index + 1}条记录]:`), '成功');
      }
    });
  }

  loopReadFile();

  console.log(chalk.blue('[info]:'), 'README创建成功');
}

function pushRemote(cmd) {
  const message = cmd.message || 'docs: add article';
  // 添加文件
  shell.exec('git add .', {
    silent: true,
  });
  // commit信息
  shell.exec(`git commit -m "${String(message)}"`, {
    silent: true,
  });
  console.log(chalk.blue('[info]:'), `推送到远程分支${cmd.branch}`);
  // 推送
  shell.exec(`git push origin ${cmd.branch}`, {
    silent: true,
  });
  console.log(chalk.blue('[info]:'), '成功推送到远程');
}

module.exports = function hexoPublish(cmd) {
  // 看需不需要修改文章链接
  if (cmd.change) {
    changeReadme();
  } else {
    console.log(chalk.blue('[info]:'), '无需修改readme文件');
  }
  // 看需不需要推送远程
  if (cmd.pushremote) {
    pushRemote(cmd);
  } else {
    console.log(chalk.blue('[info]:'), '无需推送远程');
  }
};
