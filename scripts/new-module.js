/**
 * This script will create a new module, based on sandbox, rename all objects/classes based on module name, etc
 */

const fs = require('fs-extra');
const path = require('path');

const scriptsFolder = __dirname;
const appFolder = path.resolve(scriptsFolder, '../src/app'); // src/app
const sandboxModulePath = path.resolve(scriptsFolder, '../src/app/sandbox/');

// Input must me layout, layout-data, layout-component etc
const newComponentName = 'layout';

const main = () => {
  // Copy entire folder, with a new name
  const newComponentFolder = path.resolve(appFolder, newComponentName);
  fs.copySync(sandboxModulePath, newComponentFolder);

  renameAllSandboxFilesWithComponentName(newComponentFolder, newComponentName);
  renameAllSandboxFoldersWithComponentName(newComponentFolder, newComponentName);
  replaceAllContentSandboxWithLayout(newComponentFolder, newComponentName);

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
  const foldersToRename = [`sandbox-root/sandbox`, `sandbox-root`, `store-sandbox`];

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

    let componentFirstUppercase = componentName.charAt(0).toUpperCase() + componentName.slice(1);

    // Store
    fileContent = fileContent.replace(
      /sandboxState.sandboxData/g,
      componentName + 'State.' + componentName + 'Data'
    );
    fileContent = fileContent.replace(/sandboxReducer/g, componentName + 'Reducer');
    fileContent = fileContent.replace(/sandboxInitialState/g, componentName + 'InitialState');
    fileContent = fileContent.replace(
      /isSandboxActivated/g,
      'is' + componentFirstUppercase + 'Activated'
    );
    fileContent = fileContent.replace(/sandboxData:/g, componentName + 'Data:');

    fileContent = fileContent.replace(/sandboxState/g, componentName + 'State');
    fileContent = fileContent.replace(/-sandbox/g, '-' + componentName);
    fileContent = fileContent.replace(/sandbox-/g, componentName + '-');
    fileContent = fileContent.replace(/\/sandbox\//g, '/' + componentName + '/');
    fileContent = fileContent.replace(/sandbox./g, componentName + '.');
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

main();
