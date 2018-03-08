// this is ok... still a pure function (right Dave ;) ?)
// input => returns output, no side effects, no external state mutations
// there is internal mutable state but it's encapsulated within the function
const uniqueChars = str => {
  const nospaces = str.replace(/\s/g, '');
  const lowercase = nospaces.toLowerCase();
  const chars = lowercase.split('');
  const sorted = chars.sort((a, b) => {
    if (a < b) return -1;
    if (a > b) return 1;
    return 0;
  });
  const unique = sorted.reduce((deduped, current) => {
    if (!deduped.includes(current)) deduped.push(current);
    return deduped;
  }, []);
  return unique;
};

// but lets write it in a more functional way...
const removeSpaces = str => str.replace(/\s/g, '');
const toLowerCase = str => str.toLowerCase();
const splitChars = str => str.split('');
const sort = arr => arr.slice().sort((a, b) => {
  if (a < b) return -1;
  if (a > b) return 1;
  return 0;
});
const unique = arr => arr.reduce((deduped, current) => {
  if (!deduped.includes(current)) deduped.push(current);
  return deduped;
}, []);

// fn evaluates R to L, or inside-out
const uniqueChars = str => unique(sort(splitChars(toLowerCase(removeSpaces(str))))); 
// spaced out looks sorta better?
const uniqueChars = str => 
  unique(
    sort(
      splitChars(
        toLowerCase( 
          removeSpaces(str)
        )
      )
    )
  );

/**
 * COMPOSING
 */
const uniqueChars = R.compose(unique, sort, splitChars, toLowerCase, removeSpaces);

// FP libraries give us a lot of util fns for free...
const uniqueChars = R.pipe( // inverse order of op to compose
  R.replace(/\s/g, ''),
  R.toLower,
  R.split(''),
  R.sort((a, b) => a < b ? -1 : a > b ? 1 : 0 ),
  R.uniq 
);

uniqueChars('The quick brown fox jumps over the lazy dog');

const uniqueCharsLength = R.pipe(uniqueChars, R.length);
uniqueCharsLength('The quick brown fox jumps over the lazy dog');

 // re-implement compose / pipe
const compose = (...fns) => (...args) => fns.reduce((fn1, fn2) => fn1(fn2(...args)));
const pipe = (...fns) => (...args) => fns.reduce((fn1, fn2) => fn2(fn1(...args)));
