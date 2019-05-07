/**
 * 项目初始化
 */
const inquirer = require('inquirer');
const elReact = require('../template/electron-react');
const simple = require('../template/simple');
// 项目类型
const typeMap = {
  elReact: {
    choice: 'electron-react',
    init: elReact,
  },
  simple: {
    choice: 'simple',
    init: simple,
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
  switch (step.type) {
  case typeMap.elReact.choice:
    typeMap.elReact.init(step);
    break;
  case typeMap.simple.choice:
    typeMap.simple.init(step);
    break;
  default:
    break;
  }
}

module.exports = initProject;
