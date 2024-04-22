let jscript = document.createElement('script');
jscript.setAttribute('src','https://ajax.googleapis.com/ajax/libs/jquery/3.7.1/jquery.min.js');
jscript.type = 'text/javascript';
document.getElementsByTagName('head')[0].appendChild(jscript)

const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxYjMxZTZkYjM3NTdkMTI3YWU0NjE2ODMyYzkwMjc2MCIsInN1YiI6IjYyOGM4MmViZWQyYWMyNTQ2OTllODkwMyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.OMw-6etv7U0d0qIkPC_30V2RPWo9s_9lelEwFbF-l7c'
    }
  };

//genre of movie & tv 
let tv_genre = {
        "genres": [
          {
            "id": 10759,
            "name": "Action & Adventure"
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
            "id": 10762,
            "name": "Kids"
          },
          {
            "id": 9648,
            "name": "Mystery"
          },
          {
            "id": 10763,
            "name": "News"
          },
          {
            "id": 10764,
            "name": "Reality"
          },
          {
            "id": 10765,
            "name": "Sci-Fi & Fantasy"
          },
          {
            "id": 10766,
            "name": "Soap"
          },
          {
            "id": 10767,
            "name": "Talk"
          },
          {
            "id": 10768,
            "name": "War & Politics"
          },
          {
            "id": 37,
            "name": "Western"
          }
        ]
}
let movie_genre = {
        "genres": [
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
}
    

let trendMovieWeekUrl = "https://api.themoviedb.org/3/trending/movie/week?language=en-US"
let trendTvWeekUrl = "https://api.themoviedb.org/3/trending/tv/week?language=en-US"

jscript.onload = function(){
    $(document).ready(function(){
        fetchWeeklyData(trendMovieWeekUrl,'movie')
        fetchWeeklyData(trendTvWeekUrl, 'tv')
    })
}

function fetchWeeklyData(url,type){
    fetch(url, options)
    .then(response => response.json())
    .then(response => {
        if(type=='movie'){
            response.results.forEach(result => {
                const {id, genre_ids, backdrop_path, poster_path, title, release_date, original_language, vote_average, overview} = result
                movieListView(result)
            });
        }else if(type=='tv'){
            response.results.forEach(result => {
                const {id, genre_ids, backdrop_path, poster_path, name, first_air_date, original_language, vote_average, overview} = result
                tvListView(result)
            })
        }
    })
    .catch(err => console.error(err));
}

function movieListView(data){
    $(`.weekly-movie-list`).append(`
            <div class="card-container">
                <img class='card-img' onclick="sendDataToDetailTemplate(${data.id})" src="https://image.tmdb.org/t/p/original${data.poster_path}">
                <a class="card-title">${data.title}</a>
                <div class="card-detail">
                    <div class='card-genre'>${movieGenre(data.genre_ids)}</div>
                    <div class='card-divider'>|</div>
                    <div class='card-year'>${justYear(data.release_date)}</div>
                    <div class='card-divider'>|</div>
                    <div class='card-lang'>${data.original_language.toUpperCase()}</div>
                </div>
            </div>
    `)
}

function tvListView(data){
    $(`.weekly-tv-list`).append(`
        <div class="card-container">
            <img class='card-img' src="https://image.tmdb.org/t/p/original${data.poster_path}">
            <a class="card-title">${data.name}</a>
            <div class="card-detail">
                <div class='card-genre'>${tvGenre(data.genre_ids)}</div>
                <div class='card-divider'>|</div>
                <div class='card-year'>${justYear(data.first_air_date)}</div>
                <div class='card-divider'>|</div>
                <div class='card-lang'>${data.original_language.toUpperCase()}</div>
            </div>
        </div>
`)
}

//return a tv genre name
function tvGenre(genres){
    let genre = ""
    genres.forEach(g => {
      tv_genre.genres.forEach(tG=>{
        if(g==tG.id && genre == ""){
          genre = tG.name
        }
      })
    })
    return genre
}

//return a movie genre name
function movieGenre(genres){
    let genre = ""
    genres.forEach(g => {
      movie_genre.genres.forEach(mG=>{
        if(g==mG.id && genre == ""){
          genre = mG.name
        }
      })
    })
    return genre
}

//return date with just year
function justYear(date){
    return date.slice(0,4)
}
