const glob = require('glob');
const path = require('path');
const fs = require('fs');
const {componentNameWithoutSpecialCharacter} = require('./utils/stringHelper');
const ROOT_DIR = process.cwd();

function createIndexFile(pathPattern, ignorePattern, writeFolder, finalMessage, isIcon = false) {
  glob(pathPattern, {ignore: ignorePattern}, function (er, files) {
    const finalList = [];
    const exportList = [];

    files.forEach(storyFile => {
      if (!storyFile) return;
      const readPathSplit = storyFile.split('/');
      const assetNameFull = readPathSplit[readPathSplit.length - 1];
      const assetName = assetNameFull.split('.')[0].trim();

      let finalPathList = readPathSplit.slice(readPathSplit.indexOf('assets'), readPathSplit.length - 1);
      finalPathList.push(assetNameFull);

      if (isIcon) {
        finalList.push(`import ${componentNameWithoutSpecialCharacter(assetName)} from './${assetNameFull}';`);
      } else {
        finalList.push(`import ${componentNameWithoutSpecialCharacter(assetName)} from '${finalPathList.join('/')}';`);
      }
      exportList.push(componentNameWithoutSpecialCharacter(assetName));
    });

    if (finalList.length <= 0) return;

    const writePath = path.join(ROOT_DIR, 'src', 'assets', writeFolder, 'index.ts');
    const fileContent = finalList.join('\n') + '\n\n' + `export {\n  ${exportList.join(',\n  ')},\n};\n`;
    fs.writeFileSync(writePath, fileContent, 'utf8');
    console.log(finalMessage);
  });
}

function initialize() {
  //Create SVG
  createIndexFile(
    '**/assets/svg/**/*.svg',
    ['**/assets/svg/icons/*.svg'],
    'svg',
    'SVG listesi başarı ile oluşturulmulştur.',
  );

  //Create Icon
  createIndexFile('**/assets/svg/icons/*.svg', [], 'svg/icons', 'Icon listesi başarı ile oluşturulmulştur.', true);

  //Create Png
  createIndexFile('**/assets/png/**/*.png', [''], 'png', 'PNG listesi başarı ile oluşturulmulştur.');

  //Create Lottie
  createIndexFile('**/assets/lottie/**/*.js', [''], 'lottie', 'Animasyon listesi başarı ile oluşturulmulştur.');
}

initialize();
