/**
 * source: https://github.com/electron-react-boilerplate/electron-react-boilerplate
 */
const chalk = require('chalk');
const shell = require('shelljs');
const ora = require('ora');

module.exports = function init(info) {
  // 模板地址
  const templateUrl = 'https://github.com/electron-react-boilerplate/electron-react-boilerplate.git';
  // 判断是否支持git
  if (!shell.which('git')) {
    // 不支持报异常
    shell.echo(chalk.red('[异常]: 脚本执行需要git环境'));
    shell.exit(1);
  }
  let spinner = ora();
  // 加载
  spinner.start('模板下载中..');
  // 执行clone命令
  const cloneResult = shell.exec(`git clone --depth 1 --single-branch --branch master ${templateUrl} ${info.name}`, {
    silent: true, // 静默
  });
  // 判断运行结果
  if (cloneResult.code !== 0) {
    spinner.error(chalk.red('[异常]:下载失败..'));
    shell.exit(1);
  }
  spinner = spinner.clear();
  // 进入目录
  shell.cd(info.name);
  console.log(chalk.blue('开始安装依赖..'));
  let upload;
  // 判断安装的方式，安装模块
  if (info.upload === 'npm') {
    upload = shell.exec('npm install');
  } else if (info.upload === 'yarn') {
    upload = shell.exec('yarn');
  }
  // 判断结果
  let message = '';
  if (upload.code !== 0) {
    message = chalk.red('[异常]: 安装依赖异常，请自行重新安装');
  }
  message = chalk.green(`[成功]: 依赖安装成功，请运行
    cd ${info.name}
  `);
  shell.echo(message);
  shell.exit(1);
};
