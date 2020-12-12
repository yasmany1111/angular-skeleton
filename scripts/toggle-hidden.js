const { readFileSync, writeFileSync } = require('fs-extra');

function main() {
  //

  const vsCodeFileLocation = '.vscode/settings.json';
  const readFile = readFileSync(vsCodeFileLocation, 'utf-8');

  const jsonParsed = JSON.parse(readFile);

  console.log(jsonParsed['files.exclude']);

  const hiddenKeys = Object.keys(jsonParsed['files.exclude']);
  const newState = !jsonParsed['files.exclude'][hiddenKeys[0]];

  for (const key of hiddenKeys) {
    jsonParsed['files.exclude'][key] = newState;
  }

  writeFileSync(vsCodeFileLocation, JSON.stringify(jsonParsed, null, 2));
}

main();
