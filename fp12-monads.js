// We need to learn a new function - ap 
// instead of taking a fn and applying it to the current array's contents (like map) ->
// take an array and apply the current array -containing one or more functions- to it!
Array.prototype.ap = function(array) {
  return this.chain(fn => array.map(fn));
};

[x => x * 10].ap([1, 2, 3]) // [10, 20, 30]
[x => x * 10, x => x * 100].ap([1, 2, 3]) // [10, 100, 20, 200, 30, 300]

// note: if the function is curried it can be applied to multiple functors
[x => y => x * y]
  .ap([1, 2, 3]) // [y => 1 * y, y => 2 * y, y => 3 * y]
  .ap([10, 100]) // [10, 100, 20, 200, 30, 300]

// useful for array comprehensions (or async stuff) ...
const shoes = [ 'nikes', 'vans', 'boots', 'converse' ];
const shirts = [ 'v-neck', 'long-sleeve', 't-shirt', 'bro-tank', 'sweater', 'hoodie' ];
const glasses = [ 'none', 'ray-ban' ];
const accessories = [ 'none', 'watch', 'gold-chain' ];
  
shoes.chain(pairShoes => 
  shirts.chain(shirt =>
    glasses.chain(pairGlasses =>
      accessories.map(accessory => 
        ({ shoes: pairShoes, shirt, glasses: pairGlasses, accessory: accessory })
      )
    )
  )
);

//vs

const makeOutfit = pairShoes => shirt => pairGlasses => accessory => 
  ({ shoes: pairShoes, shirt, glasses: pairGlasses, accessory: accessory });
  
[makeOutfit] 
  .ap(shoes)
  .ap(shirts)
  .ap(glasses)
  .ap(accessories);
// in Ramda - I contend that their argument order is wrong
// they put data last, but in this case the function is what is most likely to change...
R.pipe(
  R.ap(R.__, shoes),
  R.ap(R.__, shirts),
  R.ap(R.__, glasses),
  R.ap(R.__, accessories)
)([makeOutfit])

// there is an even smaller way to write this:
R.lift(makeOutfit)(shoes, shirts, glasses, accessories);



/**
 * WHAT IS A MONAD??
 * a Monad is just type that implements map / of / chain / ap
 * by adding chain and ap to array.prototype, we've made it a monad!
 */

 // quick note: I didn't talk about 'of' yet - it's just a standard way to instantiate a type (like new)
 Array.of(1,2,3,4) // [1, 2, 3, 4]
 Array.of(5) // [5]
 new Array(1,2,3,4) // [1, 2, 3, 4]
 new Array(5) // [,,,,,] meh

// Lets refine our understanding of map / chain etc (its not really about iteration - that's array specific). 
// We could traverse an object to map / chain it's values...
const forEachObjectKey = (callbackFn, obj) => {
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      callbackFn(key, obj);
    }
  }
};

const mapObject = (mapperFn, obj) => {
  const mapped = {};
  forEachObjectKey((key, obj) => {
    mapped[key] = mapperFn(obj[key], key, obj);
  }, obj);
  return mapped;
};

const isObject = val => 
  typeof val === 'object' && 
  !Array.isArray(val) &&
  val !== null;

const flattenObject = obj => {
  const flattened = {};
  forEachObjectKey((key, obj) => {
    const value = obj[key];
    if (isObject(value)) {
      forEachObjectKey((k, o) => flattened[k] = o[k], value)
    } else {
      flattened[key] = value;
    }
  }, obj);
  return flattened;
};

const chainObject = (mapperFn, obj) => flattenObject(mapObject(mapperFn, obj));

// But it's not about traversal either...
// map -> take data structure, transform it's contents, return new data structure of the same type
// chain -> take data structure, transform and flatten it's contents (un-boxing a layer)

// with this in mind: voila a Monad
class Monad { 
  constructor(val) {
    this._value = val;
  }
  static of(val) {
    return new Monad(val);
  }
  map(fn) {
    return new Monad(fn(this._value));
  }
  chain(fn) {
    return fn(this._value);
  }
  ap(f) {
    return f.map(this._value);
  }
}

Monad.of(5).map(x => x * 10); // Monad(15)
Monad.of(5).chain(x => Monad.of(x * 10)); // Monad(15)
Monad.of(x => x * 10).ap(Monad.of(5)); // Monad(15)

// this is the Identity Monad (Just) - it's not particularly useful on it's own
// we will see that a monad is essentially a container for some value with  
// behavior associated to it (which depends on the type of monad)









