/**
 * PROMISE
 */
new Promise((resolve, reject) => resolve('Success')).then(console.log);

new Promise((resolve, reject) => reject('Error')).then(null, console.log); 
// or:
new Promise((resolve, reject) => reject('Error')).catch(console.log);

// Promise.resolve ~ of
Promise.resolve('Success').then(console.log);

// promise.then ~ chain -or- map
new Promise((resolve, reject) => resolve(10))
  .then(num => num + 5)
  .then(console.log);

new Promise((resolve, reject) => resolve('test'))
  .then(test => new Promise((resolve, reject) => resolve(test + 4)))
  .then(console.log);



/**
 * FUTURE aka TASK
 */
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



// Promise implementation
class Promise {
  constructor(fn) {
    this.state = 'pending';
    this.value;
    this.deferred = null;
    this._resolve = this._resolve.bind(this);
    this._reject = this._reject.bind(this);
    fn(this._resolve, this._reject);
  }
  
  static resolve(val) {
    return new Promise(resolve => resolve(val));
  }
  
  static reject(val) {
    return new Promise((_, reject) => reject(val));
  }
  
  static all(promises) {
    return new Promise((resolve, reject) => {
      let values = [];
      let pending = promises.length;
      if (!pending) return resolve(values);
      const onResolved = (val, i) => {
        values[i] = val;
        pending -= 1;
        if (!pending) return resolve(values);
      };
      promises.forEach((promise, i) => promise.then(
        x => onResolved(x, i),
        reject
      ));
    });
  }
  
  static race(promises) {
    return new Promise((resolve, reject) => {
      let pending = true;
      const onResolved = val => {
        if (!pending) return;
        pending = false;
        return resolve(val);
      };
      const onRejected = err => {
        if (!pending) return;
        pending = false;
        return reject(err);
      };
      promises.forEach(promise => promise.then(onResolved, onRejected));
    });
  }
  
  _handle(handler) {
    if (this.state === 'pending') {
      this.deferred = handler;
      return;
    }
    setTimeout(() => {
      let handlerCallback;
      if (this.state === 'resolved') {
        handlerCallback = handler.onResolved;
      } else {
        handlerCallback = handler.onRejected;
      }
      if (!handlerCallback) {
        if (this.state === 'resolved') {
          handler.resolve(this.value);
        } else {
          handler.reject(this.value);
        }
        return;
      }
      try {
        const returnVal = handlerCallback(this.value);
        handler.resolve(returnVal);
      } catch (err) {
        handler.reject(err);
      }
    }, 0);
  }
  
  _resolve(val) {
    try {
      if (val && typeof val.then === 'function') {
        val.then(this._resolve, this._reject);
        return;
      }
      this.state = 'resolved';
      this.value = val;
      if (this.deferred) {
        this._handle(this.deferred);
      }
    } catch (err) {
      this._reject(err);
    }
  }
  
  _reject(err) {
    this.state = 'rejected';
    this.value = err;
    if (this.deferred) {
      this._handle(this.deferred);
    }
  }
  
  then(onResolved, onRejected) {
    return new Promise((resolve, reject) => {
      this._handle({ onResolved, onRejected, resolve, reject });
    });
  }
  
  catch(onRejected) {
    return this.then(null, onRejected);
  }
}

// Future implementation
class Future {
  constructor(fn) {
    this.fork = fn;
  }

  static of(x) {
    return new Future((_, resolve) => resolve(x));
  }

  static rejected(x) {
    return new Future((reject) => reject(x));
  }

  map(fn) {
    const { fork } = this;
    return new Future((reject, resolve) => fork(
      reject,
      x => resolve(fn(x))
    ));
  }

  chain(fn) {
    const { fork } = this;
    return new Future((reject, resolve) => fork(
      reject,
      x => fn(x).fork(reject, resolve)
    ));
  }

  ap(future) {
    const forkThis = this.fork;
    const forkThat = future.fork;
    return new Future((reject, resolve) => {
      let func, funcLoaded, val, valLoaded, rejected = false;
      const guardResolve = setter => x => {
        if (rejected) return;
        setter(x);
        if (funcLoaded && valLoaded) return resolve(func(val));
        return x;
      };
      const guardReject = x => {
        if (!rejected) {
          rejected = true;
          return reject(x);
        }
      };
      const thisState = forkThis(guardReject, guardResolve(x => {
        funcLoaded = true;
        func = x;
      }));
      const thatState = forkThat(guardReject, guardResolve(x => {
        valLoaded = true;
        val = x;
      }));
      return [thisState, thatState];
    });
  }
}



/**
 * Conclusion:
 * A Promise represents a future value (the async part is eager).  It behaves somewhat like a monad
 * A Future IS monadic. It represents an async process (the async part is lazy - begins after calling fork)
 */
