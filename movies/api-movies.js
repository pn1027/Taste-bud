// import { sortMovies } from './sortMovies';

const API_KEY = 'api_key=774c45332d4ea2aafdb9848019af87e5';
const BASE_URL = 'https://api.themoviedb.org/3';
const API_URL = BASE_URL + '/discover/movie?sort_by=popularity.desc&' + API_KEY;
const IMG_URL = 'https://image.tmdb.org/t/p/w500';
const searchURL = BASE_URL + '/search/movie?'+API_KEY;

const genres = [
    {
      "id": 28,
      "name": "Action"
    },
    {
      "id": 12,
      "name": "Adventure"
    },
    {
      "id": 16,
      "name": "Animation"
    },
    {
      "id": 35,
      "name": "Comedy"
    },
    {
      "id": 80,
      "name": "Crime"
    },
    {
      "id": 99,
      "name": "Documentary"
    },
    {
      "id": 18,
      "name": "Drama"
    },
    {
      "id": 10751,
      "name": "Family"
    },
    {
      "id": 14,
      "name": "Fantasy"
    },
    {
      "id": 36,
      "name": "History"
    },
    {
      "id": 27,
      "name": "Horror"
    },
    {
      "id": 10402,
      "name": "Music"
    },
    {
      "id": 9648,
      "name": "Mystery"
    },
    {
      "id": 10749,
      "name": "Romance"
    },
    {
      "id": 878,
      "name": "Science Fiction"
    },
    {
      "id": 10770,
      "name": "TV Movie"
    },
    {
      "id": 53,
      "name": "Thriller"
    },
    {
      "id": 10752,
      "name": "War"
    },
    {
      "id": 37,
      "name": "Western"
    }
  ]


//Images on the carouse;
const image1 = document.querySelector('.image-1');
const image2 = document.querySelector('.image-2');
const image3 = document.querySelector('.image-3');
const image4 = document.querySelector('.image-4');


//Dynamically generating the amount of cards based on the screen width
const popularMoviesSection = document.getElementById('popular-movies');
let width = popularMoviesSection.getBoundingClientRect().width;
width = width/320;
width = Math.floor(width);


//Fetching the inputs for year, genre and rating
const submitButton = document.querySelector('.submit');
const genreInput = document.querySelector('.genre-box');
const yearInput = document.querySelector('.year-bar');
const ratingInput = document.querySelector('.rating-box')
submitButton.addEventListener('click', () => {
  let year = '';
  let rating = '';
  let genre = '';

  if (yearInput.value) {
    year = yearInput.value;
  }
  if (ratingInput.value) {
    if(rating.value == "Highest"){
      API_URL = BASE_URL + '/discover/movie?sort_by=vote_average.desc&' + API_KEY;
    }
  }
  if (genreInput.value) {
    genre = genreInput.value;
  }

  fetchMoviesWithParams(year,rating,genre);

  //Resetting the inputs after submit 
  genreInput.selectedIndex = 0;
  ratingInput.selectedIndex = 0;
  yearInput.value = '';
  
});


function fetchMoviesWithParams(year, rating, genre) {
  let url = API_URL;

  if (year) {
    url += `&primary_release_year=${year}`;
  }
  if (rating === 'Highest') {
    url += '&sort_by=vote_average.desc';
  } else if (rating === 'Lowest') {
    url += '&sort_by=vote_average.asc';
  }
  if (genre) {
    url += `&with_genres=${genre}`;
  }

  fetch(url)
    .then(response => response.json())
    .then(data => {
      const movies = data.results;
      console.log(movies);

      for(let i = 1; i<6 ;i++){
        let img = document.querySelector('.image-'+i);
        img.src = IMG_URL+ movies[i].backdrop_path;

        let name = document.querySelector('.name-'+i);
        name.innerHTML = movies[i].title;

        let rating = document.querySelector('.rating-'+i);
        rating.innerHTML = movies[i].vote_average;

        let desc = document.querySelector('.desc-'+i);
        desc.innerHTML = movies[i].overview;
      }
      
    })
    .catch(error => console.error('Error fetching data:', error));
}


//Fetching the input for a search
const searchInput = document.querySelector('.search-bar');
searchInput.addEventListener("keydown", event => {
    if (event.key === "Enter") {
        const movieName = searchInput.value;
        searchMovies(movieName);
        searchInput.value = "";
    }
});


function searchMovies(movieName) {
  const searchURL = `${BASE_URL}/search/movie?${API_KEY}&query=${encodeURIComponent(movieName)}`;
  
  fetch(searchURL)
    .then(response => response.json())
    .then(data => {
      const movies = data.results;
      if (movies.length > 0) {
        const firstMovie = movies[0];
        const genreId = firstMovie.genre_ids[0];
        recommendMoviesByGenre(genreId);
      } else {
        alert('No movies found with that name.');
      }
    })
    .catch(error => console.error('Error searching movies:', error));
}


function recommendMoviesByGenre(genreId) {
  const recommendURL = `${BASE_URL}/discover/movie?${API_KEY}&with_genres=${genreId}&sort_by=popularity.desc`;

  fetch(recommendURL)
    .then(response => response.json())
    .then(data => {
      const movies = data.results;
      for(let i = 1; i<6 ;i++){
        let img = document.querySelector('.image-'+i);
        img.src = IMG_URL+ movies[i].backdrop_path;

        let name = document.querySelector('.name-'+i);
        name.innerHTML = movies[i].title;

        let rating = document.querySelector('.rating-'+i);
        rating.innerHTML = movies[i].vote_average;

        let desc = document.querySelector('.desc-'+i);
        desc.innerHTML = movies[i].overview;
      }
    })
    .catch(error => console.error('Error recommending movies:', error));
}



fetch(API_URL)
  .then(response => response.json())
  .then(data => {
    const movies = data.results;

      //Functionality for generating top weekly
      for(let i=0;i<width;i++){
        const card = document.createElement('div');
        card.classList.add('card');

        const movieImage = document.createElement('img');
        movieImage.src =IMG_URL+ movies[i].poster_path;
        movieImage.alt = movies[i].title + ' Poster';
        card.appendChild(movieImage);
        popularMoviesSection.appendChild(card);
      }

  })
  .catch(error => console.error('Error fetching data:', error));