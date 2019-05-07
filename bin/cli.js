#!/usr/bin/env node
const commander = require('commander');
const mypackage = require('../package.json');
const hp = require('../lib/commander/hexo-publish');
const gitSSH = require('../lib/commander/git-ssh');
const initProject = require('../lib/commander/init-project');

// 解析版本
commander
  .version(mypackage.version)
  .description(mypackage.description);

// hexo发布文章
commander
  .command('hp')
  .description('生成hexo文章的readme文件并提交')
  .option('-p, --pushremote [mode]', '是否推送到远程')
  .option('-c, --change [mode]', '是否要生成readme')
  .option('-m, --message [mode]', '推送的信息')
  .option('-b, --branch [mode]', '推送分支')
  .action((options) => {
    if (!options.pushremote && !options.change) {
      commander.help();
      return;
    }
    if (!options.branch) {
      commander.help();
      return;
    }
    hp(options);
  });

commander
  .command('gsm')
  .description('git 多公钥管理')
  .action(() => {
    gitSSH();
  });

commander
  .command('init')
  .description('项目初始化')
  .action(() => {
    initProject();
  });

commander
  .command('server')
  .description('本地构建项目');

// 解析命令
commander.parse(process.argv);
// 如果没有参数就返回帮助信息
if (!commander.args.length) {
  commander.help();
}
