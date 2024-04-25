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
let trendMovieUrl = 'https://api.themoviedb.org/3/trending/movie/day?language=en-US'

let heroMovie = []

jscript.onload = function(){    
    $(document).ready(function(){
        fetchData(popMovieUrl,heroMovie)
        fetchData(popMovieUrl,null,"pop-list")
        fetchData(nowMovieUrl,null,"top-rated-list")
    })
}

//return the movie List 
function fetchData(url,arr,name){
    let data = []
    fetch(url, options)
    .then(response => response.json())
    .then(response => {
        response.results.forEach(result => {
          const {id, genre_ids, backdrop_path, poster_path, title, release_date, original_language, vote_average, overview} = result
          if(arr!=undefined){arr.push(result)}
          data.push(result)
        });
        if(arr!=undefined){heroView(arr[0])}
        if(name=="pop-list"){
            movieListView(sortByPopularity(data).slice(1,10),"pop-list")
        }else if(name=="top-rated-list"){            
            movieListView(sortByRating(checkYear(data)),"top-rated-list")
        }
    })
    .catch(err => console.error(err));
}

//hero view
function heroView(data){
    $('#hero-backdrop').attr('src',`https://image.tmdb.org/t/p/original${data.backdrop_path}`)
    $('#hero-backdrop-border').attr('src',`https://image.tmdb.org/t/p/original${data.backdrop_path}`)
    $('.hero-detail-title').html(data.title)       
    movieGenreList(data.genre_ids).forEach((g, index) => {
      if(index < data.genre_ids.length-1){
        $('.hero-detail-genre').append(`${g} <span style="margin: 0 1rem; color: #00719c;"> | </span>`)
      }else{
        $('.hero-detail-genre').append(`${g}`)        
      } 
    })
    $('.hero-detail-rate').html('&starf; ' + roundRate(data.vote_average))
    $('.hero-detail-lang').html(data.original_language.toUpperCase())
    $('.hero-detail-date').html(data.release_date)
    $('.hero-detail-description').html(data.overview)    
    getYtKey(data.id)
    $('#hero-detail-info-btn').on('click',()=>{
      sendDataToDetailTemplate(data.id)
    })

    const heroTitle = document.getElementById('hero-detail-title')
    switch (movieGenre(data.genre_ids)) {
      case "Action":
        heroTitle.style.fontFamily = "Bangers, cursive";
        break;
      case "Adventure":
        heroTitle.style.fontFamily = "Cinzel, serif";
        break;
      case "Animation":
        heroTitle.style.fontFamily = "Luckiest Guy, cursive";
        break;
      case "Comedy":
        heroTitle.style.fontFamily = "Indie Flower, cursive";
        break;
      case "Crime":
        heroTitle.style.fontFamily = "Playfair Display, serif";
        break;
      case "Documentary":
        heroTitle.style.fontFamily = "Lato, sans-serif";
        break;
      case "Drama":
        heroTitle.style.fontFamily = "Merriweather, serif";
        break;
      case "Family":
        heroTitle.style.fontFamily = "Pacifico, cursive";
        break;
      case "Fantasy":
        heroTitle.style.fontFamily = "Abril Fatface, cursive";
        break;
      case "History":
        heroTitle.style.fontFamily = "Old Standard TT, serif";
        break;
      case "Horror":
        heroTitle.style.fontFamily = "Creepster, cursive";
        break;
      case "Music":
        heroTitle.style.fontFamily = "Archivo Black, sans-serif";
        break;
      case "Mystery":
        heroTitle.style.fontFamily = "Special Elite, cursive";
        break;
      case "Romance":
        heroTitle.style.fontFamily = "Great Vibes, cursive";
        break;
      case "Sci-Fi":
        heroTitle.style.fontFamily = "Exo, sans-serif";
        break;
      case "TV Movie":
        heroTitle.style.fontFamily = "Montserrat, sans-serif";
        break;
      case "Thriller":
        heroTitle.style.fontFamily = "Metal Mania, cursive";
        break;
      case "War":
        heroTitle.style.fontFamily = "Bebas Neu, cursive";
        break;
      case "Western":
        heroTitle.style.fontFamily = "Slabo 27px, serif";
        break;
      default:
        heroTitle.style.fontFamily = "Bitter, serif";
        break;
    }
}

//list view
function movieListView(data, listName){
    data.forEach(m => {
        $(`.${listName}`).append(`
            <div class="card-container">
                <img class='card-img' id='${m.id}' src="https://image.tmdb.org/t/p/original${m.poster_path}">
                <a class="card-title" id='${m.id}'>${m.title}</a>
                <div class="card-detail">
                    <div class='card-genre'>${movieGenre(m.genre_ids)}</div>
                    <div class='card-divider'>|</div>
                    <div class='card-year'>${justYear(m.release_date)}</div>
                    <div class='card-divider'>|</div>
                    <div class='card-lang'>${m.original_language.toUpperCase()}</div>
                </div>
            </div>
        `)        
    })    
    
  //handle element on click
    $('.card-img').each( (_,element) => {
      $(element).on('click',()=>{
        sendDataToDetailTemplate(element.id)
      })
    })

    $('.card-title').each((_,element) => {
      $(element).on('click', ()=>{
        sendDataToDetailTemplate(element.id)
      })
    })
}


//get yt key
function getYtKey(id){
    fetch(`https://api.themoviedb.org/3/movie/${id}/videos?language=en-US`, options)
    .then(response => response.json())
    .then(response => {
        response.results.forEach(result => {
            const {key} = result            
            $('.hero-video-list').append(`<iframe src="https://www.youtube.com/embed/${key}" frameborder="0" allowfullscreen></iframe>`)
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

function movieGenreList(genres){
    let allGenre = []
    genres.forEach(g => {
        movie_genre.genres.forEach(mg =>{
            if(g == mg.id){
                allGenre.push(mg.name)
            }
        })
    })
    return allGenre
}

//return a genre name for recommend list
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

//navigate to detail page
function sendDataToDetailTemplate(id){      
    localStorage.setItem('keyId',id)      
    localStorage.setItem('type','movie')    
    location.href = 'detail.html'    
}

//round the rate in 2 decimal places
function roundRate(rate){    
    return Math.round(rate * 10) /10
}

//check year == current year
function checkYear(data){
    let thisYearData = []
    let cuurentYear = new Date().getFullYear()
    data.forEach(movie => {
        let date = new Date(movie.release_date)
        if(date.getFullYear()==cuurentYear){
            thisYearData.push(movie)
        }
    })
    return thisYearData
}

//sort movie list by data
function sortByDate(data){
  data = data.sort((a,b)=>{
     if(a.release_date > b.release_date) return -1
     if(a.release_date < b.release_date) return 1
     return 0
  })
  return data
}

//sort movie list by popularity
function sortByPopularity(data){
  data = data.sort((a,b)=>{
      if(a.popularity > b.popularity) return -1
      if(a.popularity < b.popularity) return 1
      return 0
   })
   return data
}

//sort movie list by rating
function sortByRating(data){
  data = data.sort((a,b)=>{
      if(a.vote_average > b.vote_average) return -1
      if(a.vote_average < b.vote_average) return 1
      return 0 
  })
  return data
}
