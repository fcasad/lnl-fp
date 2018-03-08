/**
 * THE PROBLEM:
 */
const divide = (a, b) => a / b;
const prop = (prop, obj) => obj[prop];
const parseJSON = str => JSON.parse(str);

// ok
divide(10, 2); // 5
prop('a', { a: 1 }); // 1
parseJSON('{ "a": 1 }'); // { a: 1 }

// not ok 
divide(10, 0); // Infinity
prop('b', { a: 1 }); // undefined
parseJSON('{ a: 1 }'); // SyntaxError: Unexpected token a in JSON... 
parseJSON(''); // SyntaxError: Unexpected end of JSON input

// not to mention all the runtime errors (or weird results from coercion) that
// you could get with incorrect types (thanks JS!)
divide(undefined, 2); // NaN
divide(null, 2); // 0
prop('a', undefined); // TypeError: Cannot read property 'a' of undefined
prop('b', 'something'); // undefined
parseJSON(null); // null
parseJSON(undefined); // SyntaxError: Unexpected token u in JSON...

// we could try and make the functions safer but this is messy thinking about return types 
// and trying to account for all invalid states:
const divide = (a, b) => {
  if (typeof a === 'number' && typeof b === 'number' && b !== 0) {
    return a / b;
  } else {
    // ??
  }
};

const prop = (prop, obj) => {
  // fun fact: typeof null is object
  if (typeof obj === 'object' && obj !== null) { 
    return obj[prop]; 
  } else {
    // ??
  }
};
// bonus: code that looks like this:
const user = {  
  id: 1,  
  name: 'ClubSpeed Devs',  
  address: {  
    street: {  
      number: 549,  
      name: 'Queensland Cir, Suite 202',  
    }, 
    zip: 92879 
  },  
}; 
(user && user.address && user.address.street && user.address.street.name)

const parseJSON = str => {
  try {
    return JSON.parse(str);
  } catch (err) {
    // ??
  }
};



/**
 * THE SOLUTION 
 */
[1, 2, 3].map(x => x + 5); // [5, 10, 15]
[].map(x => x + 5); // []
// array methods are safe to use on empty arrays...

[1] //success
[] //failure



/**
 * STEAMROLLING ERRORS
 */
const nullableToMaybe = x => (x === null || x === undefined) ? [] : [x];
const throwableToMaybe = (fn, ...args) => {
  try { return [fn(...args)]; } 
  catch (err) { return []; }
};

const maybeDivide = (a, b) => nullableToMaybe(a / b); 
maybeDivide(10, 2) // [5]
maybeDivide(10, 0) // [Infinity]
maybeDivide(undefined, 2) // [Infinity]
maybeDivide(10, 0)
  .filter(x => typeof x === 'number')
  .filter(x => x !== Infinity) // []

const maybeProp = (prop, obj) => nullableToMaybe(obj[prop]);
maybeProp('a', { a: 1 }); // [1]
maybeProp('b', { a: 1 }); // []
maybeProp('a', 'not obj'); // []

// bonus 
maybeProp('address', user)
  .chain(address => maybeProp('street', address))
  .chain(street => maybeProp('name', street));

const maybeJSON = str => throwableToMaybe(JSON.parse, str);
maybeJSON('{ "a": 1 }'); // [{ a: 1 }]
maybeJSON('{ a: 1 }'); // []
maybeJSON(''); // []



/**
 * BONUS: CONTROL FLOW
 */
if ( a && b && c && d ) {
  // do something
}
[[a, b, c, d]]
  .filter(conditions => conditions.every(x => Boolean(x)))
  .map(/* doSomething */);

if (a || b || c || d) {
  // do something
}
[[a, b, c, d]]
  .filter(conditions => conditions.some(x => Boolean(x)))
  .map(/* doSomething */);

a = a || 'defaultValue';
a = [a, 'defaultValue'].find(x => Boolean(x));