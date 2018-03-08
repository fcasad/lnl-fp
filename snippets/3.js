const R = require('ramda');
const Intl = require('intl');

const CARS = [
  {
    name: 'Ferrari FF',
    horsepower: 660,
    listPrice: 700000,
    inStock: true,
  }, 
  {
    name: 'Spyker C12 Zagato',
    horsepower: 650,
    listPrice: 648000,
    inStock: false,
  }, 
  {
    name: 'Jaguar XKR-S',
    horsepower: 550,
    listPrice: 132000,
    inStock: false,
  }, 
  {
    name: 'Audi R8',
    horsepower: 525,
    listPrice: 114200,
    inStock: false,
  }, 
  {
    name: 'Aston Martin One-77',
    horsepower: 750,
    listPrice: 1850000,
    inStock: true,
  }
];

const formatCurrency = num => 
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(num);

const meanPrice = cars => {
  const prices = cars.map(car => car.listPrice);
  const mean = prices.reduce((total, current) => total + current) / cars.length;
  return formatCurrency(mean);
};
// const meanPrice = R.pipe(R.map(R.prop('listPrice')), R.mean, formatCurrency); 
console.log(meanPrice(CARS));

const sanitizeNames = cars => cars
  .map(car => car.name)
  .map(name => name.replace(/\s/g, '_'))
  .map(name => name.toUpperCase());
// const sanitizeNames = R.pipe(
//   R.map(R.prop('name')),
//   R.map(R.replace(/\s/g, '_')),
//   R.map(R.toUpper)
// );
// const sanitizeNames = R.map(
//   R.pipe(R.prop('name'), R.replace(/\s/g, '_'), R.toUpper)
// );
// console.log(sanitizeNames(CARS));

const availablePrices = cars => cars
  .filter(car => car.inStock)
  .map(car => car.listPrice)
  .map(formatCurrency)
// const availablePrices = R.pipe(
//   R.filter(R.prop('inStock')),
//   R.map(R.prop('listPrice')),
//   R.map(formatCurrency)
// );
// const availablePrices = R.pipe(
//   R.filter(R.prop('inStock')),
//   R.map(R.pipe(R.prop('listPrice'), formatCurrency))
// );
// console.log(availablePrices(CARS));