
const devsJS = ['Brian', 'Dave', 'Farren', 'Matt', 'David', 'Casper'];
const devsIOS = ['Sharaf', 'Wayne', 'Alex'];
const devTeams = [devsJS, devsIOS];

const logDevs = devs => {
  for (let i = 0; i < devs.length; i++) {
    console.log(devs[i]);
  }
};

const capitalizeDevs = devs => {
  const capitalized = [];
  for (let i = 0; i < devs.length; i++) {
    capitalized.push(devs[i].toUpperCase());
  }
  return capitalized;
};

const devsContainingE = devs => {
  const containE = [];
  for (let i = 0; i < devs.length; i++) {
    if (devs[i].includes('e')) containE.push(devs[i]);
  }
  return containE;
};

const devWithLongestName = devs => {
  let longest = '';
  const longer = (a, b) => a.length >= b.length ? a : b;
  for (let i = 0; i < devs.length; i++) {
    longest = longer(longest, devs[i]);
  }
  return longest;
};



/**
 * With array methods
 */
const logDevs = devs => devs.forEach(dev => console.log(dev));

const capitalizeDevs = devs => devs.map(dev => dev.toUpperCase());

const devsContainingE = devs => devs.filter(dev => dev.includes('e'));

const devWithLongestName = devs => devs.reduce((longest, dev) => {
  return longest.length >= dev.length ? longest : dev;
}, '');



/**
 * Re-implement array methods (these 4 are already on Array.prototype)
 */
Array.prototype.forEach = function (callbackFn) {
  for (let i = 0; i < this.length; i++) {
    callbackFn(this[i], i);
  }
};

// note: this makes Array a functor! 
Array.prototype.map = function (mapperFn) { //projection fn
	const mapped = [];
	this.forEach((item, i) => {
		mapped.push(mapperFn(item, i));
	});
	return mapped;
};

Array.prototype.filter = function (filtererFn) { // predicate fn
  const filtered = [];
  this.forEach((item, i) => {
    if (filtererFn(item, i)) filtered.push(item);
  });
  return filtered;
};

Array.prototype.reduce = function (reducerFn, initial) {
  let reduced = initial;
  this.forEach((item, i) => reduced = reducerFn(reduced, item, i));
  return reduced;
};



/**
 * Lets add 2 new methods:
 */
Array.prototype.flatten = function() { // flatten aka concatAll (aka smoosh!?)
	let flattened = [];
	this.forEach(subArray => {
		flattened = flattened.concat(subArray);
	});
	return flattened;
};

Array.prototype.chain = function(mapperFn) { // chain aka flatMap aka concatMap 
	return this
		.map((item, i) => mapperFn(item, i))
		.flatten();
};

devTeams.flatten();
devsJS.map(x => [x, x.toUpperCase()]).flatten();
devsJS.chain(x => [x, x.toUpperCase()]);