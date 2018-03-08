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

// const nameOfFirstCar = cars => cars[0].name;
const nameOfFirstCar = R.pipe(R.head, R.prop('name'));

// const averagePrice = cars => {
//   const prices = cars.map(car => car.listPrice);
//   return prices.reduce((total, current) => total + current) / cars.length;
// };
const averagePrice = R.pipe(R.map(R.prop('listPrice')), R.mean); 

// const sanitizeNames = cars => cars
//   .map(car => car.name)
//   .map(name => name.replace(/\s/g, '_'))
//   .map(name => name.toUpperCase());

// const sanitizeNames = R.pipe(
//   R.map(R.prop('name')),
//   R.map(R.replace(/\s/g, '_')),
//   R.map(R.toUpper)
// );
const sanitizeNames = R.map(
  R.pipe(R.prop('name'), R.replace(/\s/g, '_'), R.toUpper)
);

const formatCurrency = num => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(num);
// const availablePrices = cars => cars
//   .filter(car => car.inStock)
//   .map(car => car.listPrice)
//   .map(formatCurrency)
const availablePrices = R.pipe(
  R.filter(R.prop('inStock')),
  R.map(R.pipe(R.prop('listPrice'), formatCurrency))
);

// const fastestCarPitch = cars => {
//   const sortedByHP = cars.sort((car1, car2) => {
//     if (car1.horsepower > car2.horsepower) return -1;
//     if (car2.horsepower < car1.horsepower) return 1;
//     return 0;
//   });
//   const fastest = sortedByHP[cars.length - 1];
//   return 'If you want to go fast, you should test drive the ' + fastest.name;
// };
const fastestCarPitch = R.pipe(
  R.sortBy(R.prop('horsepower')),
  R.last,
  R.prop('name'), 
  R.concat('If you want to go fast, you should test drive the ')
);



/**
 * Refactor some code
 */
// note: this function we wrote earlier is impossible to write with composition and point free style
// bc the final map is accessing variables from the closure of the second chain 
// (this is not pure! although it is encapsulated within the outer function so it is ok)
const videosFromMovieLists = movieLists => 
  movieLists.chain(movieList => 
    movieList.videos.chain(video => 
      video.boxarts
        .filter(boxart => boxart.width === 150)
        .map(boxart => ({ id: video.id, title: video.title, boxart: boxart.url }))
    )
  );

// but we could have written it like this:
const videosFromMovieLists = movieLists => 
  movieLists.chain(movieList => 
    movieList.videos.map(video => ({
      id: video.id,
      title: video.title,
      boxart: video.boxarts
        .find(boxart => boxart.width === 150)
        .url
    }))
  );

// which could translate to this:
const videosFromMovieLists = R.chain(
  R.pipe(
    R.prop('videos'),
    R.map(video => ({
      id: video.id,
      title: video.title,
      boxart: R.pipe(
        R.find(R.pipe(R.prop('width'), R.equals(150))), 
        R.prop('url')
      )(video.boxarts)
    }))
  )
);

// and this can be broken up nicely:
const width150 = R.pipe(R.prop('width'), R.equals(150));
const findWidth150Url = R.pipe(R.find(width150), R.prop('url'));
const videoPreview = video => ({
  id: video.id, 
  title: video.title, 
  boxart: findWidth150Url(video.boxarts)
});
const videosFromMovieList = R.pipe(R.prop('videos'), R.map(videoPreview));
const videosFromMovieLists = R.chain(videosFromMovieList);