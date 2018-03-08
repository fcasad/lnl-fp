/**
 * Transducers: efficient, composable, data-type agnostic transformations
 */ 

const arr = [ 1, 2, 3, 4, 5 ];
const concat = (obj, val) => obj.concat([ val ]);
const incr = val => val + 1;
const even = val => val % 2 === 0;

const reduce = (reducerFn, initialVal, collection) => {
  let accumulated = initialVal;
  for (let item of collection) {
    accumulated = reducerFn(accumulated, item);
  }
  return accumulated;
};
// reduce((x, y) => x + y, 0, arr);



/**
 * map and filter using reduce
 */ 
const map = (projectionFn, collection) => 
  reduce((accum, val) => concat(accum, projectionFn(val)), [], collection);
// map(incr, arr);

const filter = (predicateFn, collection) => 
  reduce((accum, val) => predicateFn(val) ? concat(accum, val) : accum, [], collection);
// filter(even, arr);



/**
 * decouple transforming logic (by inversing relationship with reduce)
 */ 
const mapper = projectionFn => 
  (accum, val) => concat(accum, projectionFn(val));
// reduce(mapper(incr), [], arr);

const filterer = predicateFn => 
  (accum, val) => predicateFn(val) ? concat(accum, val) : accum;
// reduce(filterer(even), [], arr);



/**
 * decouple reducing logic (by removing passing in concat)
 */ 
const mapping = projectionFn => 
  reducerFn =>
    (accum, val) => reducerFn(accum, projectionFn(val));
// reduce(mapping(incr)(concat), [], arr);

const filtering = predicateFn => 
  reducerFn =>
    (accum, val) => predicateFn(val) ? reducerFn(accum, val) : accum;
// reduce(filtering(even)(concat), [], arr);



/**
 * voila transducing!
 */ 
const transduce = (transformFn, reducerFn, initialVal, collection) => 
  reduce(transformFn(reducerFn), initialVal, collection);
// const result1 = transduce(mapping(incr), concat, [], arr);
// const result2 = transduce(filtering(even), concat, [], arr);
// console.log(result1, result2);

// we can now use the same generic transform functions on any iterable data type!
const addToList = (list, x) => list.push(x);
const cat = (str, x) => str + x;
const trueProp = (obj, x) => { obj[x] = true; return obj; };
const addToSet = (set, x) => set.add(x);

transduce(mapping(incr), addToList, I.List(), arr); // List [ 2, 3, 4, 5, 6 ]
transduce(mapping(incr), cat, '', new Set(arr)); // '23456'
transduce(filtering(even), trueProp, {}, arr); // { 2: true, 4: true }
transduce(filtering(even), addToSet, new Set(), I.List(arr)); // Set { 2, 4 }
transduce(filtering(even), incr, 0, arr); // 2

// before our transformations built up intermediary arrays 
const incrThenEven = arr => arr
  .map(incr) // builds new arr
  .filter(even); // builds new arr

const incrThenEven = R.pipe(
  R.map(incr), // builds new arr
  R.filter(even) // builds new arr
);
// also map and filter are array specific :(

// now we can compose our transform functions together: this could be win for perf
// this works bc each transform fn excpects a reducer fn, but also returns a reducer fn
const incrThenEven = R.compose(mapping(incr), filtering(even)); 
transduce(incrThenEven, concat, [], arr); // no intermediary arrays built
// and they still work on any data type
transduce(incrThenEven, cat, '', arr);
transduce(incrThenEven, addToSet, new Set(), I.List(arr));

// caveat: composing Transducers works in the reverse order you may expect - 
// notice usage of compose instead of pipe

