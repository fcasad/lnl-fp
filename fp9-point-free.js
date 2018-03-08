/**
 * POINT-FREE STYLE
 */
const add10 = x => x + 10;
[1, 2, 3].map(x => add10(x)); // fn signatures match...
[1, 2, 3].map(add10); // this is where referential transparency comes in handy...



/**
 * Refactor code to point free 
 */
const match = R.curry((regex, str) => str.match(regex));
const containsQ = match(/q/i);
// const onlyContainQ = arr => R.filter(x => containsQ(x), arr);
const onlyContainQ = R.filter(containsQ);

R.split(' ', 'Some text here'); // note data last!
R.split(' ')('Some text here'); // note auto-curried fn!
// const splitWords = str => R.split(' ', str);
const splitWords = R.split(' ');
splitWords('Some text here');
// const splitWordsArr = arr => R.chain(x => splitWords(x), arr); 
// const splitWordsArr = arr => R.chain(splitWords, arr); 
const splitWordsArr = R.chain(splitWords);
splitWordsArr(['A sentence', 'And anotha one', 'Cool']);
