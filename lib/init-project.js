/**
 * 项目初始化
 */
const inquirer = require('inquirer');
const elReact = require('./template/electron-react');
// 项目类型
const typeMap = {
  elReact: {
    choice: 'electron-react',
    init: elReact,
  },
};
const uploadHub = {
  yarn: 'yarn',
  npm: 'npm',
};

async function initProject() {
  const typeList = Object.keys(typeMap).map(item => typeMap[item].choice);
  const step = await inquirer.prompt([{
    type: 'input',
    message: '请输入项目名',
    name: 'name',
  }, {
    type: 'list',
    message: '请输入构建的项目类型',
    name: 'type',
    choices: typeList,
  }, {
    type: 'list',
    message: '请输入安装方式',
    name: 'upload',
    choices: Object.values(uploadHub),
  }]);
  switch (step.list) {
  case typeMap.elReact.chioce:
    typeMap.elReact.init(step);
    break;
  default:
    break;
  }
}

module.exports = initProject;
