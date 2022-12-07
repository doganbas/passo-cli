const glob = require('glob');
const path = require('path');
const fs = require('fs');
const ROOT_DIR = process.cwd();

function initialize() {
  glob('**/*.stories.tsx', {}, function (er, files) {
    const finalList = [];
    files.forEach(storyFile => {
      const readPathSplit = storyFile.split('/');
      const componentName = readPathSplit[readPathSplit.length - 3];
      let finalPathList = readPathSplit.slice(readPathSplit.indexOf('components') + 1, readPathSplit.length - 1);
      finalPathList.push(`${componentName}.stories`);
      finalList.push(`import '${finalPathList.join('/')}';`);
    });

    const writePath = path.join(ROOT_DIR, 'storybook', 'stories.ts');
    fs.writeFileSync(writePath, finalList.join('\n'), 'utf8');

    console.log('Stories dosyası başarı ile oluşturulmuştur.');
  });
}

initialize();
