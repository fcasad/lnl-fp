const Promise = require('bluebird');
const Future = require('fluture');

new Promise((resolve, reject) => resolve('Success')).then(console.log);

new Promise((resolve, reject) => reject('Error')).then(null, console.log); // or:
new Promise((resolve, reject) => reject('Error')).catch(console.log);

// Promise.resolve ~ of
Promise.resolve('Success').then(console.log);

// promise.then ~ chain -or- map
new Promise((resolve, reject) => resolve(10))
  .then(num => num + 5)
  .then(console.log);

new Promise((resolve, reject) => resolve(10))
  .then(test => new Promise((resolve, reject) => resolve(test + 5)))
  .then(console.log);



new Future((reject, resolve) => resolve('Success'))
  .fork(console.error, console.log);

new Future((reject, resolve) => reject('Error'))
  .fork(console.error, console.log);

Future.of('Success').fork(console.error, console.log);

new Future((reject, resolve) => resolve(10))
  .map(num => num + 5)
  .fork(console.error, console.log);

new Future((reject, resolve) => resolve(10))
  .chain(num => new Future((reject, resolve) => resolve(num + 5)))
  .fork(console.error, console.log);

Future.of(num1 => num2 => num1 + num2)
  .ap(new Future((_, resolve) => resolve(10)))
  .ap(new Future((_, resolve) => resolve(5)))
  .fork(console.error, console.log);   