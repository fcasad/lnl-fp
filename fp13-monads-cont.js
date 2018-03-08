/**
* Maybe 
*/
const Nothing = {
  _value: undefined,
  map: () => Nothing,
  chain: () => Nothing,
  ap: () => Nothing,
  get isNothing() { return true; },
  get isJust() { return false; },
  inspect: () => `Nothing`
};

const Just = x => ({
  _value: x,
  map: fn => Just(fn(x)),
  chain: fn => fn(x),
  ap: maybe => maybe.map(x),
  get isNothing() { return false; },
  get isJust() { return true; },
  inspect: () => `Just(${x})`,
});

const Maybe = () => {};
Maybe.of = Just;

const toMaybe = val => (val !== null && val !== undefined) ? Just(val) : Nothing; // nullableToMaybe
const encase = R.curry((fn, val) => { // throwableToMaybe
  try { return Just(fn(val)); } 
  catch (e) { return Nothing; }
});
const maybe = R.curry((val, fn, m) => m.isJust ? fn(m._value) : val);



/**
 * Either
 */
const Left = x => ({
  _value: x,
  map: () => Left(x),
  chain: () => Left(x),
  ap: () => Left(x),
  get isLeft() { return true; },
  get isRight() { return false; },
  inspect: () => `Left(${x})`
});

const Right = x => ({
  _value: x,
  map: fn => Right(fn(x)),
  chain: fn => fn(x),
  ap: either => either.map(x),
  get isLeft() { return false; },
  get isRight() { return true; },
  inspect: () => `Right(${x})`,
});

const Either = () => {};
Either.of = Right;

const toEither = R.curry((lVal, rVal) => (rVal === null || rVal === undefined) ? LeftVal(lVal) : Right(rVal)); 
const encaseEither = R.curry((fn1, fn2, val) => { 
  try { return Right(fn2(val)); } 
  catch (err) { return Left(fn1(err)); }
});
const either = R.curry((fn1, fn2, e) => e.isLeft ? fn1(e._value) : fn2(e._value));



/**
 * Refactor: All this should all look very similar to fp7-error-handling
 */
//1
const maybeProp = R.curry((prop, obj) => toMaybe(R.prop(prop, obj)));

const maybeStreetName = R.pipe(
  maybeProp('address'),
  R.chain(maybeProp('street')),
  R.chain(maybeProp('name'))
);

//2
const eitherErrOrParsedJSON = encaseEither(R.prop('message'), JSON.parse);

const celebrateBday = R.pipe(R.prop('age'), R.add(1));
const eitherErrOrNewAge = R.pipe(eitherErrOrParsedJSON, R.map(celebrateBday));
eitherErrOrNewAge('{ "age": 25 }');

//3
const eitherErrOrNum = val => typeof val !== 'number' 
  ? Left('The supplied value must be a number')
  : Right(val); 
const eitherErrOrNonZero = val => val === 0 
  ? Left('The supplied value must not be 0')
  : Right(val); 

const eitherErrOrDivided = R.curry((a, b) => 
  eitherErrOrNum(a)
    .map(R.divide)
    .ap(eitherErrOrNum(b).chain(eitherErrOrNonZero))
);
//or
const eitherErrOrDivided = R.curry((a, b) => 
  R.lift(R.divide)(
    eitherErrOrNum(a), 
    eitherErrOrNum(b).chain(eitherErrOrNonZero)
  )
);

either(console.error, console.log, eitherErrOrDivided(10, 2)); // when we want to unbox the contents of the either



/**
 * IO
 */
const IO = initFn => ({
  _value: initFn,
  of: x => IO(() => x),
  map: fn => IO(() => fn(initFn())),
  chain: fn => IO(() => fn(initFn()).run()),
  ap: io => IO(() => io.map(initFn()).run()),
  run: () => initFn(),
  inspect: () => `IO(${initFn})`,
});

// Impure:
const readFileSync = filePath => fs.readFileSync(filePath, 'utf-8');
const testContents = readFileSync('fp1-intro.txt');
const testLines = testContents.split('\n');
console.log(testLines);

// Pure:
const pureReadFileSync = filePath => IO(() => fs.readFileSync(filePath, 'utf-8'));
const pureLog = val => IO(() => console.log(val))

const testLinesIO = R.map(R.split('\n'), pureReadFileSync('fp1-intro.txt'));
testLinesIO.chain(pureLog).runIO(); // equivalent to: testLinesIO.map(console.log).runIO();