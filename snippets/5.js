const fs = require('fs');
const R = require('ramda');
const { IO } = require('ramda-fantasy');

// // Impure:
// const readFileSync = filePath => fs.readFileSync(filePath, 'utf-8');
// const testContents = readFileSync('fp1-intro.txt');
// const testLines = testContents.split('\n');
// console.log(testLines);

// Pure:
const pureReadFileSync = filePath => IO(() => fs.readFileSync(filePath, 'utf-8'));
const pureLog = val => IO(() => console.log(val))

const introLinesIO = R.map(R.split('\n'), pureReadFileSync('fp1-intro.txt'));
const logIntroLinesIO = introLinesIO.chain(pureLog); // equivalent to: introLinesIO.map(console.log);
logIntroLinesIO.runIO();