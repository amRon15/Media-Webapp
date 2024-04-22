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

//genre of tv
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

let heroTv = []

//api url
let trendTvUrl = "https://api.themoviedb.org/3/trending/tv/day?language=en-US"
let topRatedTvUrl = "https://api.themoviedb.org/3/tv/top_rated?language=en-US&page=1"

jscript.onload = function(){    
    $(document).ready(function(){
        fetchData(trendTvUrl,heroTv)
        fetchData(trendTvUrl,null,'trend-list')
        fetchData(topRatedTvUrl,null,'top-rated-list')
    })
}

//return the movie List 
function fetchData(url,arr,name){
    let data = []
    fetch(url, options)
    .then(response => response.json())
    .then(response => {
        response.results.forEach(result => {
          const {id, genre_ids, backdrop_path, poster_path, name, first_air_date, original_language, vote_average, overview} = result
          if(arr!=undefined){arr.push(result)}
          data.push(result)
        });
        if(arr!=undefined){heroView(arr[0])}
        if(name=="trend-list"){
            movieListView(data.slice(1,10),name)
        }else if(name=="top-rated-list"){            
            movieListView(sortByDate(data),name)
        }
    })
    .catch(err => console.error(err));
}

//hero view
function heroView(data){
    $('#hero-backdrop').attr('src',`https://image.tmdb.org/t/p/original${data.backdrop_path}`)
    $('#hero-backdrop-border').attr('src',`https://image.tmdb.org/t/p/original${data.backdrop_path}`)
    $('.hero-detail-title').html(data.name)       
    movieGenreList(data.genre_ids).forEach((g, index) => {
      if(index < data.genre_ids.length-1){
        $('.hero-detail-genre').append(`${g} <span style="margin: 0 1rem; color: #00719c;"> | </span>`)
      }else{
        $('.hero-detail-genre').append(`${g}`)        
      }
    })
    $('.hero-detail-rate').html('&starf; ' + roundRate(data.vote_average))
    $('.hero-detail-lang').html(data.original_language.toUpperCase())
    $('.hero-detail-date').html(data.first_air_date)
    $('.hero-detail-description').html(data.overview)    
    getYtKey(data.id)   
}

//list view
function movieListView(data, listName){
    data.forEach(tv => {
        $(`.${listName}`).append(`
            <div class="card-container">
                <img class='card-img' id='${tv.id}' src="https://image.tmdb.org/t/p/original${tv.poster_path}">
                <a class="card-title" id='${tv.id}'>${tv.name}</a>
                <div class="card-detail">
                    <div class='card-genre'>${tvGenre(tv.genre_ids)}</div>
                    <div class='card-divider'>|</div>
                    <div class='card-year'>${justYear(tv.first_air_date)}</div>
                    <div class='card-divider'>|</div>
                    <div class='card-lang'>${tv.original_language.toUpperCase()}</div>
                </div>
            </div>
        `)        
    })    
}


//get yt key
function getYtKey(id){
    fetch(`https://api.themoviedb.org/3/tv/${id}/videos?language=en-US`, options)
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


//return a list of genre name
function movieGenreList(genres){
    let allGenre = []
    genres.forEach(g => {
        tv_genre.genres.forEach(tg =>{
            if(g == tg.id){
                allGenre.push(tg.name)
            }
        })
    })
    return allGenre
}

//return a genre name for recommend list
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

//return date with just year
function justYear(date){
    return date.slice(0,4)
  }

//navigate to detail page
function sendDataToDetailTemplate(id){      
    localStorage.setItem('keyId',id)          
    location.href = 'detail.html'
    console.log(id)
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
        let date = new Date(movie.first_air_date)
        if(date.getFullYear()==cuurentYear){
            thisYearData.push(movie)
        }
    })
    return thisYearData
}

//sort movie list by data
function sortByDate(data){
    data = data.sort((a,b)=>{
       if(a.first_air_date > b.first_air_date) return -1
       if(a.first_air_date < b.first_air_date) return 1
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
