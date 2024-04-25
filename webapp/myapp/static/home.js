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

let popMovieUrl = 'https://api.themoviedb.org/3/movie/popular?language=en-US&page=1'
let popTvUrl = "https://api.themoviedb.org/3/tv/popular?language=en-US&page=1"
let trendTvUrl = "https://api.themoviedb.org/3/trending/tv/day?language=en-US"
let popPeopleUrl = 'https://api.themoviedb.org/3/trending/person/day?language=en-US'

jscript.onload = function(){    
    $(document).ready(function(){
        fetchData(popMovieUrl,'movie')
        fetchData(trendTvUrl,'tv')
        peopleListView(popPeopleUrl)
        handleClick()
    })
}

function handleClick(){
  $('#pop-movie-more').on('click',()=>{
    navToMorePage(popMovieUrl,'movie')    
  })
  
  $('#pop-tv-more').on('click',()=>{
    navToMorePage(trendTvUrl,'tv')
  })
}

//return the movie List 
function fetchData(url,type){
    let data = []
    fetch(url, options)
    .then(response => response.json())
    .then(response => {
        if(type=='movie'){
            response.results.forEach(result => {
                const {id, genre_ids, backdrop_path, poster_path, title, release_date, original_language, vote_average, overview} = result
                data.push(result)                  
            })
        }else{
            response.results.forEach(result => {
                const {id, genre_ids, backdrop_path, poster_path, name, first_air_date, original_language, vote_average, overview} = result
                data.push(result)
            })            
        }
        if(type == 'movie'){
            listView(data,'pop-movie-list')
        }else{
            listView(data,'pop-tv-list')
        }
    })
    .catch(err => console.error(err));
}

//return view for carousel
function carouselView(data){
}

//return popular people
function peopleListView(url){
    fetch(url, options)
    .then(response => response.json())
    .then(response => {
        response.results.forEach(result => {
            const {id, popularity, name, known_for_department, profile_path, know_for} = result            
            $('.pop-people-list').append(`
                <div class='cast-detail'>
                    <img class='cast-img' src='https://image.tmdb.org/t/p/original/${profile_path}.jpg' />
                    <div class='cast-name'>${name}</div>
                </div>
            `)
        })
    })
    .catch(err => console.error(err));
}

//return movie list
function listView(data,name){
    data.forEach(m => {
        $(`.${name}`).append(`
            <div class="card-container">
                <img class='card-img' id='${m.id}' src="https://image.tmdb.org/t/p/original${m.poster_path}">
                <a class="card-title" id='${m.id}'>${m.title != null ? m.title : m.name}</a>
                <div class="card-detail">
                    <div class='card-genre'>${genre(m.genre_ids)}</div>
                    <div class='card-divider'>|</div>
                    <div class='card-year'>${m.release_date != null ? justYear(m.release_date) : justYear(m.first_air_date)}</div>
                    <div class='card-divider'>|</div>
                    <div class='card-lang'>${m.original_language.toUpperCase()}</div>
                </div>
            </div>
        `)
    })
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
function genre(genres){
    let genre = ""
    genres.forEach(g => {
      movie_genre.genres.forEach(mG=>{
        if(g==mG.id && genre == ""){
          genre = mG.name
        }
      })
    })
    genres.forEach(g => {
        tv_genre.genres.forEach(tG => {
            if(g==tG.id && genre == ""){
                genre = tG.name
            }
        })
    })
    return genre
  }


//return date with just year
function justYear(date){
    return date.slice(0,4)
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

  //nav to more
  function navToMorePage(url,type){
    localStorage.setItem('url',url)
    localStorage.setItem('type',type)
    location.href = 'more.html'    
  }