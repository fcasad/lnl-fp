const R = require('ramda');

//1
const match = R.curry((regex, str) => str.match(regex));

const containsQ = str => match(/q/i, str);

const containQArr = arr => R.filter(x => containsQ(x), arr);

//2
const splitWords = str => R.split(' ', str);
// const result = splitWords('Some text here');
// console.log(result);
const splitWordsArr = arr => R.chain(x => splitWords(x), arr); 
// const result = splitWordsArr(['A sentence', 'And anotha one', 'Cool']);
// console.log(result);