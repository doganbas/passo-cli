const glob = require('glob');
const path = require('path');
const fs = require('fs');
const ROOT_DIR = process.cwd();

function initialize() {
  glob('**/*.localization.ts', {}, function (er, files) {
    const finalList = {};

    files.forEach(localizationFile => {
      const componentName = localizationFile.split('/')[localizationFile.split('/').length - 2];
      const readPath = path.join(ROOT_DIR, localizationFile);
      const readFile = fs.readFileSync(readPath, {encoding: 'utf8'}).toString();
      const string = `(export const ${componentName}Localization = {([^>]+)};)`;
      const regex = new RegExp(string, 'g');
      const filteredText = readFile
        .replace(regex, '__start__$1__end__')
        .replace(`export const ${componentName}Localization = `, '');
      const finalText = filteredText
        .substring(filteredText.indexOf('__start__') + 9, filteredText.indexOf('__end__'))
        .replaceAll('\n', '')
        .replace('{', '')
        .replace('}', '')
        .replace(';', '')
        .trim();

      const splitPath = localizationFile.split('/');
      const localizationStartPath = splitPath.slice(splitPath.indexOf('components') + 1, splitPath.length - 1);

      finalText.split(',').forEach(item => {
        const tup = item.split(':');
        let key = tup[0] ?? '';
        let val = tup[1] ?? '';
        key = key.trim();
        val = val.replaceAll("'", '').trim();
        if (key !== '') {
          finalList[`${localizationStartPath.join('.')}.${key}`] = val;
        }
      });
    });

    const writePath = path.join(ROOT_DIR, 'src', 'assets', 'locales', 'tr.json');
    fs.writeFileSync(writePath, JSON.stringify(finalList), 'utf8');

    console.log('Dil dosyası başarı ile oluşturulmuştur.');
  });
}

initialize();
