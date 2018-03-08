const movieLists = [
  {
    name: "Instant Queue",
    videos: [
      {
        "id": 70111470,
        "title": "Die Hard",
        "boxarts": [
          { width: 150, height: 200, url: "http://cdn-0.nflximg.com/images/2891/DieHard150.jpg" },
          { width: 200, height: 200, url: "http://cdn-0.nflximg.com/images/2891/DieHard200.jpg" }
        ],
        "url": "http://api.netflix.com/catalog/titles/movies/70111470",
        "rating": 4.0,
        "bookmark": []
      },
      {
        "id": 654356453,
        "title": "Bad Boys",
        "boxarts": [
          { width: 200, height: 200, url: "http://cdn-0.nflximg.com/images/2891/BadBoys200.jpg" },
          { width: 150, height: 200, url: "http://cdn-0.nflximg.com/images/2891/BadBoys150.jpg" }

        ],
        "url": "http://api.netflix.com/catalog/titles/movies/70111470",
        "rating": 5.0,
        "bookmark": [{ id: 432534, time: 65876586 }]
      }
    ]
  },
  {
    name: "New Releases",
    videos: [
      {
        "id": 65432445,
        "title": "The Chamber",
        "boxarts": [
          { width: 150, height: 200, url: "http://cdn-0.nflximg.com/images/2891/TheChamber150.jpg" },
          { width: 200, height: 200, url: "http://cdn-0.nflximg.com/images/2891/TheChamber200.jpg" }
        ],
        "url": "http://api.netflix.com/catalog/titles/movies/70111470",
        "rating": 4.0,
        "bookmark": []
      },
      {
        "id": 675465,
        "title": "Fracture",
        "boxarts": [
          { width: 200, height: 200, url: "http://cdn-0.nflximg.com/images/2891/Fracture200.jpg" },
          { width: 150, height: 200, url: "http://cdn-0.nflximg.com/images/2891/Fracture150.jpg" },
          { width: 300, height: 200, url: "http://cdn-0.nflximg.com/images/2891/Fracture300.jpg" }
        ],
        "url": "http://api.netflix.com/catalog/titles/movies/70111470",
        "rating": 5.0,
        "bookmark": [{ id: 432534, time: 65876586 }]
      }
    ]
  }
];

// 1. get the id, title for videos in 'New Releases' 
// [{ id, title }]
const newReleases = movieLists.find(movieList => movieList.name === 'New Releases');

newReleases.videos
  .map(video => ({ id: video.id, title: video.title }))

// 2. get the titles of videos in 'New Releases' with a 5.0 rating
// [title]
newReleases.videos
  .filter(video => video.rating === 5.0)
  .map(video => video.title)
  
// 3. get the ids of all videos in every movieList
// [id]
movieLists
  .map(movieList => movieList.videos.map(video => video.id))
  .flatten()
  // or
movieLists
  .chain(movieList => movieList.videos.map(video => video.id))

// 3. get id, title, and a 150x200 box art url for every video 
// [{ id, title, boxart }]
movieLists.map(movieList => {
  return movieList.videos.map(video => {
    return video.boxarts
      .filter(boxart => boxart.width === 150)
      .map(boxart => ({ id: video.id, title: video.title, boxart: boxart.url }));
  })
  .flatten();       
})
.flatten(); 
// or
movieLists.chain(movieList => {
  return movieList.videos.chain(video => {
    return video.boxarts
      .filter(boxart => boxart.width === 150)
      .map(boxart => ({ id: video.id, title: video.title, boxart: boxart.url }));
  })
});