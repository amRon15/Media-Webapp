let jscript = document.createElement('script');
jscript.setAttribute('src','https://ajax.googleapis.com/ajax/libs/jquery/3.7.1/jquery.min.js');
jscript.type = 'text/javascript';
document.getElementsByTagName('head')[0].appendChild(jscript)

jscript.onload = function(){    
    $(document).ready(function(){
        fetchData(popMovieUrl)
    })
}

const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxYjMxZTZkYjM3NTdkMTI3YWU0NjE2ODMyYzkwMjc2MCIsInN1YiI6IjYyOGM4MmViZWQyYWMyNTQ2OTllODkwMyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.OMw-6etv7U0d0qIkPC_30V2RPWo9s_9lelEwFbF-l7c'
    }
  };

  //genre of movie
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

//api url
let popMovieUrl = 'https://api.themoviedb.org/3/movie/popular?language=en-US&page=1'
let topRatedUrl = 'https://api.themoviedb.org/3/movie/top_rated?language=en-US&page=1'
let nowMovieUrl = 'https://api.themoviedb.org/3/movie/now_playing?language=en-US&page=1'



//return the movie List 
function fetchData(url){
    fetch(url, options)
    .then(response => response.json())
    .then(response => {
        response.results.forEach(result => {
          const {id, genre_ids, poster_path, title, release_date, original_language} = result
          $('.related-list').append(`
          <div class="card-container">
            <img class='card-img' src="https://image.tmdb.org/t/p/original${poster_path}">
            <a class="card-title">${title}</a>
            <div class="card-detail">
                <div class='card-genre'>${movieListGenre(genre_ids)}</div>
                <div class='card-divider'>|</div>
                <div class='card-year'>${justYear(release_date)}</div>
                <div class='card-divider'>|</div>
                <div class='card-lang'>${original_language.toUpperCase()}</div>
            </div>
        </div>`)
        });
    })
    .catch(err => console.error(err));
  }



//calculate runtime total mins > _h_min
function calRuntime(runtime){
    let time = runtime
    let hour = 0
    let total
    while ( time > 59){
        hour ++
        time -= 60
    }
    if (time == 0){
        total = hour + 'h'
    }else {
        total = hour + 'h ' + time + 'min'
    }
    return total    
}

//return a genre name for recommend list
function movieListGenre(genres){
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

function sendDataToDetailTemplate(id){      
    localStorage.setItem('keyId',id)          
    location.href = 'detail.html'
    console.log(id)
}

