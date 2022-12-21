const path = require('path');
const fs = require('fs');
const Handlebars = require('handlebars');
const removeOptionsFromArgs = require('./utils/removeOptionsFromArgs');
const stringHelper = require('./utils/stringHelper');

const ROOT_DIR = process.cwd();
const [, , ...args] = process.argv;
const componentNames = removeOptionsFromArgs(args);
const defaultTempPath = path.join('node_modules/passo-cli');
const templatePaths = {
  component: path.join(defaultTempPath, 'templates', 'componentContent.hbs'),
  style: path.join(defaultTempPath, 'templates', 'componentStyle.hbs'),
  type: path.join(defaultTempPath, 'templates', 'componentType.hbs'),
  default: path.join(defaultTempPath, 'templates', 'componentDefault.hbs'),
  index: path.join(defaultTempPath, 'templates', 'componentIndex.hbs'),
  test: path.join(defaultTempPath, 'templates', 'componentTest.hbs'),
  story: path.join(defaultTempPath, 'templates', 'componentStory.hbs'),
  localization: path.join(defaultTempPath, 'templates', 'componentLocalization.hbs'),
};

function getComponentType() {
  const paramArg = args.find(nq => nq.startsWith('--'));
  const param = paramArg ? paramArg.replace('--', '') : 'atom';
  switch (param) {
    case 'molecule':
      return 'molecules';
    case 'organism':
      return 'organisms';
    case 'page':
      return 'pages';
    case 'layout':
      return 'layouts';
    default:
      return 'atoms';
  }
}

function createComponentFile(componentType, folderPath, componentName) {
  const filePath = path.join(folderPath, `${componentName}.component.tsx`);
  const name = stringHelper.componentNameWithoutSpecialCharacter(componentName);
  const templateFile = fs.readFileSync(templatePaths.component, {encoding: 'utf8'});
  const template = Handlebars.compile(templateFile.toString());
  const fileContent = template({name, nameLowerCase: componentName, customCharacter: '{'});
  fs.writeFileSync(filePath, fileContent, 'utf8');
}

function createStyleFile(componentType, folderPath, componentName) {
  const filePath = path.join(folderPath, `${componentName}.style.ts`);
  const name = stringHelper.componentNameWithoutSpecialCharacter(componentName);
  const templateFile = fs.readFileSync(templatePaths.style, {encoding: 'utf8'});
  const template = Handlebars.compile(templateFile.toString());
  const fileContent = template({name, nameLowerCase: componentName});
  fs.writeFileSync(filePath, fileContent, 'utf8');
}

function createTypeFile(componentType, folderPath, componentName) {
  const filePath = path.join(folderPath, `${componentName}.type.ts`);
  const name = stringHelper.componentNameWithoutSpecialCharacter(componentName);
  const templateFile = fs.readFileSync(templatePaths.type, {encoding: 'utf8'});
  const template = Handlebars.compile(templateFile.toString());
  const fileContent = template({name, nameLowerCase: componentName});
  fs.writeFileSync(filePath, fileContent, 'utf8');
}

function createDefaultFile(componentType, folderPath, componentName) {
  const filePath = path.join(folderPath, `${componentName}.default.ts`);
  const name = stringHelper.componentNameWithoutSpecialCharacter(componentName);
  const templateFile = fs.readFileSync(templatePaths.default, {encoding: 'utf8'});
  const template = Handlebars.compile(templateFile.toString());
  const fileContent = template({name, nameLowerCase: componentName, customCharacter: '{', customCharacterAfter: '}'});
  fs.writeFileSync(filePath, fileContent, 'utf8');
}

function createLocalizationFile(componentType, folderPath, componentName, customLocalizationPath) {
  const filePath = path.join(folderPath, `${componentName}.localization.ts`);
  const name = stringHelper.componentNameWithoutSpecialCharacter(componentName);
  const templateFile = fs.readFileSync(templatePaths.localization, {encoding: 'utf8'});
  const template = Handlebars.compile(templateFile.toString());
  const fileContent = template({name, nameLowerCase: componentName, customLocalizationPath});
  fs.writeFileSync(filePath, fileContent, 'utf8');
}

function createIndexFile(componentType, folderPath, componentName) {
  const filePath = path.join(folderPath, 'index.ts');
  const name = stringHelper.componentNameWithoutSpecialCharacter(componentName);
  const templateFile = fs.readFileSync(templatePaths.index, {encoding: 'utf8'});
  const template = Handlebars.compile(templateFile.toString());
  const fileContent = template({name, nameLowerCase: componentName, customCharacter: '{', customCharacterAfter: '}'});
  fs.writeFileSync(filePath, fileContent, 'utf8');
}

function createTestFile(componentType, folderPath, componentName) {
  const filePath = path.join(folderPath, `${componentName}.test.tsx`);
  const name = stringHelper.componentNameWithoutSpecialCharacter(componentName);
  const templateFile = fs.readFileSync(templatePaths.test, {encoding: 'utf8'});
  const template = Handlebars.compile(templateFile.toString());
  const fileContent = template({name, nameLowerCase: name});
  fs.writeFileSync(filePath, fileContent, 'utf8');
}

function createStoryFile(componentType, folderPath, componentName) {
  const filePath = path.join(folderPath, `${componentName}.stories.tsx`);
  const name = stringHelper.componentNameWithoutSpecialCharacter(componentName);
  const templateFile = fs.readFileSync(templatePaths.story, {encoding: 'utf8'});
  const template = Handlebars.compile(templateFile.toString());
  const fileContent = template({name, nameLowerCase: name});
  fs.writeFileSync(filePath, fileContent, 'utf8');
}

function initialize() {
  const componentType = getComponentType();
  const baseDir = path.join(ROOT_DIR, 'src');

  componentNames.forEach(item => {
    const fullNamePath = item.split('/');
    const componentName = fullNamePath[fullNamePath.length - 1];
    let componentPath = path.join(baseDir, 'components', componentType, componentName);
    let customLocalizationPath = `${componentType}.${componentName}`;
    if (fullNamePath.length > 1) {
      const customFolder = item.replace('/' + componentName, '');
      customLocalizationPath = `${componentType}.${fullNamePath.join('.')}`;
      componentPath = path.join(baseDir, 'components', componentType, customFolder, componentName);
    }

    const testPath = path.join(componentPath, '__tests__');
    const storyPath = path.join(componentPath, '__stories__');

    if (fs.existsSync(componentPath)) {
      console.error(`'${componentName}' isimli component zaten mevcut.`);
      return;
    }

    fs.mkdirSync(componentPath);
    fs.mkdirSync(testPath);
    fs.mkdirSync(storyPath);

    createComponentFile(componentType, componentPath, componentName);
    createStyleFile(componentType, componentPath, componentName);
    createTypeFile(componentType, componentPath, componentName);
    createDefaultFile(componentType, componentPath, componentName);
    createIndexFile(componentType, componentPath, componentName);
    createTestFile(componentType, testPath, componentName);
    createStoryFile(componentType, storyPath, componentName);
    createLocalizationFile(componentType, componentPath, componentName, customLocalizationPath);

    console.log('Component başarı ile oluşturulmuştur.');
  });
}

initialize();
