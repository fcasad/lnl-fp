/**
 * FUNCTIONS ARE 1ST CLASS
 */

function add(x, y) { return x + y; }; // function declaration
const add = function add(x, y) { return x + y; }; // function expression
const add = function (x, y) { return x + y; }; // anonymous function
const add = (x, y) => x + y; // lambda function

// methods
const utils = {
  add: (x, y) => x + y,
}
class Utils {
  add(x, y) { return x + y; }
}

// array of fns
const utils = [
  function (x, y) { return x + y; },
];



/**
 * HIGHER ORDER FUNCTIONS
 */

// function taking function as arg - callback
const addThen = (x, y, fn) => fn(x + y); 
const logAfter500MS = () => setTimeout(() => console.log('hit'), 500); // basic async

// function returning function - closure
const test = () => { 
  const x = 'private var';
  return () => console.log(x);
}
const test = () => { // revealing module pattern
  const x = 'private var';
  const exposedMethod = () => console.log(x);
  return { logVar: exposedMethod };
}



/**
 * IMMUTABILITY
 */

// mutable - modify original object
const changeEmail = (email, user) => {
  user.email = email;
  return user;
};
const addNumber = (number, numbers) => {
  numbers.push(number);
  return numbers;
};

// immutable - create and modify shallow copy
const changeEmail = (email, user) => Object.assign({}, user, { email: email });
const addNumber = (number, numbers) => numbers.concat([number]);



/**
 * PURITY
 */

// impure - should return same output for given input (deterministic)
Math.random();
Date.now();
// should not mutate any external state or output output to the system (side effect)
const markAsDeleted = record => {
  record.deleted = true;
  return record;
}
let x = 0;
const increment = () => ++x; 
const greet = name => console.log('Hi, ' + name);
// should not rely on any external state or input from the system
const increment= () => x + 1; 
document.getElementById('myEl');
fetch('someUrl.com', { method: 'GET' });
fs.readFile('./some-file.txt');

// pure 
const markAsDeleted = record => Object.assign({}, record, { deleted: true });
const increment = x => x + 1;
// pure - can return array, function etc
const coordinate = (x, y) => [x, y];
const add = x => (y => x + y);

// note: if a tree falls... -> if a program has no IO does it even run?
// the goal isn't to avoid impure functions it is to minimize / control them ie:
const greet = name => () => console.log('Hi, ' + name); // wrap in function to delay execution (thunk)
