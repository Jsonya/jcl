/**
 * git 的多公钥管理工具
 */
const inquirer = require('inquirer');
const os = require('os');
const chalk = require('chalk');
const shell = require('shelljs');
const path = require('path');
const ora = require('ora');
const {
  fsExistsSync,
  writeContent,
  readFile,
  deleteFile,
  dirExists,
} = require('./utils/fs');
// 默认的配置模板
const template = function template(values) {
  return `# ${values.host}\nHost ${values.host}\n    HostName ${values.host}\n    PreferredAuthentications publickey\n    IdentityFile ${values.address}\n    User git`;
};
// 路径选择
const dirChoise = {
  current: '当前路径',
  home: '根路径',
  diy: '自定义路径',
};

async function gitSSHManager() {
  // 当前执行路径
  const dir = path.resolve();
  // 默认的管理文件夹
  const defaultSshDirectoryName = '.ssh';
  // 公钥存放地址，后面会覆写
  let publishKeyPath = '';
  // 配置存放地址，后面会覆写
  let configPath = '';
  // 获取host已经存放地址
  const step1 = await inquirer.prompt([{
    type: 'input',
    message: '请输入邮件',
    name: 'email',
  }, {
    type: 'input',
    message: '请输入HOST',
    name: 'host',
  }, {
    type: 'list',
    message: '请输入公钥保存地址的地址',
    name: 'dir',
    choices: Object.values(dirChoise),
  }]);
  // 如果选择的是自定义路径，那么需要再次询问
  const selfDir = await inquirer.prompt([{
    type: 'input',
    message: '请输入自定义路径',
    name: 'selfDir',
    // 自定义路径的时候才需要执行
    when: step1.dir === dirChoise.diy,
    // 需要检验自定义的文件路径存不存在
    validate: value => (fsExistsSync(value) ? true : '请输入正确的路径'),
  }]);
  // 路径字典
  const lastDir = {
    [dirChoise.current]: dir,
    [dirChoise.home]: os.homedir(),
    [dirChoise.diy]: selfDir.selfDir,
  };
  // 保存的顶层文件夹
  const saveDir = lastDir[step1.dir] || dir;
  // 判断是否存在ssh文件夹，没有就同时递归创建
  await dirExists(path.join(saveDir, `/${defaultSshDirectoryName}`));

  // 获取公钥名
  await inquirer.prompt({
    type: 'input',
    message: '请输入公钥名',
    name: 'publish_key',
    validate: async (value) => {
      // 如果路径是已经存在的该文件，提示重新输入
      publishKeyPath = path.join(saveDir, `/${defaultSshDirectoryName}/${value}`);
      // 配置路径
      configPath = path.join(saveDir, `/${defaultSshDirectoryName}/config`);
      // 判断文件夹中有没有同名的密钥
      if (fsExistsSync(publishKeyPath)) {
        return '已经存在同名的公钥，请重新输入';
      }
      return true;
    },
  });

  // 执行公密钥的生成操作
  shell.exec(`ssh-keygen -t rsa -C "${step1.email}" -f ${publishKeyPath}`, {
    silent: true,
  });
  // 读取生成的公钥
  const content = readFile(`${publishKeyPath}.pub`, 'utf8');
  // 提示将公钥添加到仓库
  console.log(chalk.blue('请把下方的密钥添加到对应仓库的ssh设置中:'));
  // 公钥打印
  console.log(content);

  // 追加生成config
  const obj = {
    address: publishKeyPath,
    host: step1.host,
    email: step1.email,
  };
  // config模板
  const tem = template(obj);
  // 写入内容
  writeContent(configPath, tem);
  // 设置用户可读写，其他人不可读写
  shell.chmod(600, configPath);

  // 尝试连接的次数
  let connectCount = 0;
  const spinner = ora('验证链接中');
  // 询问是否已经添加
  await inquirer.prompt({
    type: 'Confirm',
    message: '是否将密钥加到仓库中',
    name: 'isupdate',
    default: true,
    validate: () => {
      // 把密钥添加到ssh-agent的高速缓存中
      shell.exec(`ssh-add ${publishKeyPath}`, {
        silent: true,
      });
      // 显示验证加载效果
      spinner.start();
      // 测试连接效果
      const re = shell.exec(`ssh -T git@${step1.host}`, {
        silent: true,
      });
      // 查看验证返回的结果
      const isConnect = re.stderr && re.stderr.indexOf('successfully authenticated') > -1;
      connectCount += 1;
      // 如果不是成功的
      if (!isConnect) {
        // 加载停止
        spinner.clear();
        // 大于三次尝试就中断验证
        return connectCount > 3 ? true : '请再次确认是否已经添加';
      }
      return true;
    },
  });
  // 大于三次时
  if (connectCount > 3) {
    // 显示异常信息
    spinner.fail(chalk.red('[error]: 验证失败，尝试删除生成的文件，请稍后重试'));
    // 删除公钥文件
    deleteFile(`${publishKeyPath}.pub`);
    deleteFile(publishKeyPath);
    return;
  }
  // 提示成功
  spinner.succeed('连接成功');
  // 将一些信息打印
  console.log(chalk.green('******公钥添加成功*******'));
  console.log(chalk.blue('公钥存放地址:'), publishKeyPath);
  console.log(chalk.blue('公钥配置地址:'), configPath);
  console.log(chalk.green('***********************'));
}

module.exports = gitSSHManager;
