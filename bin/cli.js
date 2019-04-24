#!/usr/bin/env node
const commander = require('commander');
const package = require('../package.json');

// 解析版本
commander
  .version(package.version)
  .description(package.description)

// hexo发布文章
commander
  .command('hp')
  .description('生成hexo文章的readme文件并提交')
  .option('-p, --pushremote [mode]', '是否推送到远程')
  .option('-c, --change [mode]', '是否要生成readme')
  .option('-m, --message [mode]', '推送的信息')
  .option('-b, --branch [mode]', '推送分支')
  .action(options => {
    if (!options.pushremote && !options.change) {
      commander.help();
      return;
    }
    if (!options.branch) {
      commander.help();
      return;
    }
    const hp = require('../lib/hexo-publish')
    hp(options);
  })
// 解析命令
commander.parse(process.argv);
// 如果没有参数就返回帮助信息
if (!commander.args.length) {
  commander.help()
}