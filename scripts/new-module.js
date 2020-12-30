/**
 * This script will create a new module, based on sandbox, rename all objects/classes based on module name, etc
 */

const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});
const fs = require('fs-extra');
const path = require('path');

const scriptsFolder = __dirname;
const appFolder = path.resolve(scriptsFolder, '../src/app'); // src/app
const sandboxModulePath = path.resolve(scriptsFolder, './sandbox');

// Input must me layout, layout-data, layout-component etc

const main = (newComponentName) => {
  // Copy entire folder, with a new name
  const newComponentFolder = path.resolve(appFolder, newComponentName);

  fs.copySync(sandboxModulePath, newComponentFolder);
  console.log('[X] Copy sandbox folder');

  renameAllSandboxFilesWithComponentName(newComponentFolder, newComponentName);
  console.log('[X] renameAllSandboxFilesWithComponentName');

  renameAllSandboxFoldersWithComponentName(newComponentFolder, newComponentName);
  console.log('[X] renameAllSandboxFoldersWithComponentName');

  replaceAllContentSandboxWithLayout(newComponentFolder, newComponentName);
  console.log('[X] replaceAllContentSandboxWithLayout');

  return;
};

const renameAllSandboxFilesWithComponentName = (newComponentFolder, componentName) => {
  // Rename all "files", removing sandbox with newComponentName
  const allNewFiles = walkSync(newComponentFolder);

  for (const file of allNewFiles) {
    const folderName = path.dirname(file);
    const justFileName = file.split('/').pop();
    const newFileName = justFileName.replace('sandbox', componentName);

    fs.moveSync(file, path.resolve(folderName, newFileName));
  }
};

const renameAllSandboxFoldersWithComponentName = (newComponentFolder, componentName) => {
  // Rename all "files", removing sandbox with newComponentName
  const foldersToRename = [`sandbox`, `sandbox-root`, `store-sandbox`];

  for (const folder of foldersToRename) {
    const folderName = path.dirname(folder);
    const justFolderName = folder.split('/').pop();
    const newFolderName = justFolderName.replace('sandbox', componentName);

    fs.moveSync(
      path.resolve(newComponentFolder, folder),
      path.resolve(newComponentFolder, folderName, newFolderName)
    );
  }
};

const replaceAllContentSandboxWithLayout = (newComponentFolder, componentName) => {
  const allNewFiles = walkSync(newComponentFolder);

  for (const file of allNewFiles) {
    let fileContent = fs.readFileSync(file, 'utf-8');

    let camelizedComponentName = camelize(componentName);

    let componentFirstUppercase =
      camelizedComponentName.charAt(0).toUpperCase() + camelizedComponentName.slice(1);

    // File
    fileContent = fileContent.replace(
      /sandboxState.sandboxData/g,
      camelizedComponentName + 'State.' + camelizedComponentName + 'Data'
    );

    fileContent = fileContent.replace(
      /SandboxRootComponent/g,
      componentFirstUppercase + 'RootComponent'
    );

    // Store
    fileContent = fileContent.replace(/sandbox-root/g, `${componentName}`);

    fileContent = fileContent.replace(
      /filtersStateFeatureKey/g,
      camelizedComponentName + 'StateFeatureKey'
    );
    fileContent = fileContent.replace(/sandboxReducer/g, camelizedComponentName + 'Reducer');
    fileContent = fileContent.replace(
      /sandboxInitialState/g,
      camelizedComponentName + 'InitialState'
    );
    fileContent = fileContent.replace(
      /isSandboxActivated/g,
      'is' + componentFirstUppercase + 'Activated'
    );
    fileContent = fileContent.replace(/sandboxData:/g, camelizedComponentName + 'Data:');

    fileContent = fileContent.replace(/sandboxState/g, camelizedComponentName + 'State');
    fileContent = fileContent.replace(/-sandbox/g, '-' + camelizedComponentName);
    fileContent = fileContent.replace(/sandbox-/g, camelizedComponentName + '-');
    fileContent = fileContent.replace(/\/sandbox\//g, '/' + camelizedComponentName + '/');
    fileContent = fileContent.replace(/sandbox./g, camelizedComponentName + '.');
    fileContent = fileContent.replace(/[S]andbox/g, componentFirstUppercase);

    fs.writeFileSync(file, fileContent);
  }
};

/**
 * Test
 */
try {
  const oldProjectPath = path.resolve(appFolder, newComponentName);
  console.log('Removing', oldProjectPath);
  fs.removeSync(oldProjectPath);
} catch (ex) {
  console.log('Cannnot unlink');
}

/**
 * Tools
 */

function walkSync(dir, filelist) {
  var path = path || require('path');
  var fs = fs || require('fs'),
    files = fs.readdirSync(dir);
  filelist = filelist || [];
  files.forEach(function (file) {
    if (fs.statSync(path.join(dir, file)).isDirectory()) {
      filelist = walkSync(path.join(dir, file), filelist);
    } else {
      filelist.push(path.join(dir, file));
    }
  });
  return filelist;
}

function camelize(str) {
  let arr = str.split('-');
  let capital = arr.map((item, index) =>
    index ? item.charAt(0).toUpperCase() + item.slice(1).toLowerCase() : item.toLowerCase()
  );
  // ^-- change here.
  let capitalString = capital.join('');

  return capitalString;
}

rl.question('Module Name (all lowercase, no spaces, no - or _) : ', function (name) {
  main(name);
  rl.close();
});
