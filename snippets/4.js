const R = require('ramda');

Array.prototype.flatten = function() {
	let flattened = [];
	this.forEach(subArray => {
		flattened = flattened.concat(subArray);
	});
	return flattened;
};
Array.prototype.chain = function(mapperFn) {
	return this
		.map((item, i) => mapperFn(item, i))
		.flatten();
};
Array.prototype.ap = function(array) {
  return this.chain(fn => array.map(fn));
};

const shoes = [ 'nikes', 'vans', 'boots', 'converse' ];
const shirts = [ 'v-neck', 'long-sleeve', 't-shirt', 'bro-tank', 'sweater', 'hoodie' ];
const glasses = [ 'none', 'ray-ban' ];
const accessories = [ 'none', 'watch', 'gold-chain' ];
  
const outfits = shoes.chain(pairShoes => 
  shirts.chain(shirt =>
    glasses.chain(pairGlasses =>
      accessories.map(accessory => 
        ({ shoes: pairShoes, shirt, glasses: pairGlasses, accessory: accessory })
      )
    )
  )
);
console.log(outfits);

//vs

// const makeOutfit = pairShoes => shirt => pairGlasses => accessory => 
//   ({ shoes: pairShoes, shirt, glasses: pairGlasses, accessory: accessory });
  
// const outfits = [makeOutfit] 
//   .ap(shoes)
//   .ap(shirts)
//   .ap(glasses)
//   .ap(accessories);
//  console.log(outfits);

// // there is an even smaller way to write this:
// const outfits = R.lift(makeOutfit)(shoes, shirts, glasses, accessories);
