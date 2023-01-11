const glob = require('glob');
const path = require('path');
const fs = require('fs');
const ROOT_DIR = process.cwd();

function initialize() {
  glob('**/*.localization.ts', {}, function (er, files) {
    const finalList = {};

    files.forEach(localizationFile => {
      let componentName = localizationFile.split('/')[localizationFile.split('/').length - 2];
      if (localizationFile.indexOf('global.localization.ts') > -1) {
        componentName = 'global';
      }
      const readPath = path.join(ROOT_DIR, localizationFile);
      const readFile = fs.readFileSync(readPath, {encoding: 'utf8'}).toString();
      const string = `(export const ${componentName}Localization = {([^>]+)};)`;
      const regex = new RegExp(string, 'g');
      const filteredText = readFile
        .replace(regex, '__start__$1__end__')
        .replace(`export const ${componentName}Localization = `, '');
      const finalText = filteredText
        .substring(filteredText.indexOf('__start__') + 9, filteredText.indexOf('__end__'))
        .replaceAll('{{', '%%%%')
        .replaceAll('}}', '^^^^')
        .replaceAll(',\n', '~')
        .replaceAll(', \n', '~')
        .replaceAll('{', '')
        .replaceAll('}', '')
        .replaceAll(';', '')
        .replaceAll('%%%%', '{{')
        .replaceAll('^^^^', '}}')
        .trim();

      const splitPath = localizationFile.split('/');
      let localizationStartPath = splitPath.slice(splitPath.indexOf('components') + 1, splitPath.length - 1);
      if (localizationFile.indexOf('global.localization.ts') > -1) {
        localizationStartPath = ['global'];
      }

      finalText.split('~').forEach(item => {
        if (item.length < 5) return;
        const tup = item.split(':');
        let key = tup[0] ?? '';
        let val = tup[1] ?? '';
        key = key.trim();
        val = val.replaceAll("'", '').trim();
        if (key !== '') {
          finalList[`${localizationStartPath.join('.')}.${key}`] = val.replaceAll('\\n', '\n');
        }
      });
    });

    const writePath = path.join(ROOT_DIR, 'src', 'assets', 'locales', 'tr.json');
    fs.writeFileSync(writePath, JSON.stringify(finalList), 'utf8');

    console.log('Dil dosyası başarı ile oluşturulmuştur.');
  });
}

initialize();
