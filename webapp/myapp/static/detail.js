let jscript = document.createElement('script');
jscript.setAttribute('src','https://ajax.googleapis.com/ajax/libs/jquery/3.7.1/jquery.min.js');
jscript.type = 'text/javascript';
document.getElementsByTagName('head')[0].appendChild(jscript)

jscript.onload = function(){    
    $(document).ready(function(){
        fetchMovieData()
        ytVideo()
        fetchCredit()
        fetchSimilar()
    })
}

const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxYjMxZTZkYjM3NTdkMTI3YWU0NjE2ODMyYzkwMjc2MCIsInN1YiI6IjYyOGM4MmViZWQyYWMyNTQ2OTllODkwMyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.OMw-6etv7U0d0qIkPC_30V2RPWo9s_9lelEwFbF-l7c'
    }
  };
  
//get the id pass from other html (tv or movie id)
let id = localStorage.getItem('keyId')
//get the type pass from other html (tv or movie)
let type = localStorage.getItem('type')

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

  videoKeys = []

  //fetch the youtube api to show video
  var player
  function ytVideo(){
    var key = "";
    fetch(
    type=='movie' ? `https://api.themoviedb.org/3/movie/${id}/videos?language=en-US` : `https://api.themoviedb.org/3/tv/${id}/videos?language=en-US`,
    options
    )
    .then((response) => response.json())
    .then((response) => {
        for (let i = 0; i < response.results.length; i++) {
            if (response.results[i].type === "Trailer") {
                key = response.results[i].key;
            }
            if (i < 9 ){
                videoKeys.push(response.results[i].key)                
            }            
        }        
        YT.ready(function () {
        player = new YT.Player("player", {
            height: "720",
            width: "1080",
            videoId: key,
            playerVars: {
            autoplay: 1,
            controls: 0,
            rel: 0,
            disablekb: 1,
            playlist: key,
            loop: 1,
            autohide: 1,
            showinfo: 0,
            mute: 1,
            iv_load_policy: 3,
            },
        });
        });
        videoKeys.forEach(key => {
            $('.hero-video-list').append(`<iframe src="https://www.youtube.com/embed/${key}" frameborder="0" allowfullscreen></iframe>`)                        
        });
    })
    .catch((err) => console.error(err));
  }


  //return the html view to movieDetail.html
function fetchMovieData(){
    fetch(type=='movie' ? `https://api.themoviedb.org/3/movie/${id}?language=en-US` : `https://api.themoviedb.org/3/tv/${id}?language=en-US`, options)
    .then(response => response.json())
    .then(response => {
        const data = response
        let rating = Math.round(data.vote_average * 10 ) / 10        
        $('#detail-title').html(data.title!=null ? data.title : data.name)
        $('#detail-tagline').html(data.tagline)
        $('#detail-rating').html(`<i class="fa fa-star" aria-hidden="true"></i> ${rating}`)        
        $('#detail-runtime').html(data.runtime!=null ? calRuntime(data.runtime) : 'Episodes: ' + data.number_of_episodes)
        $('#detail-status').html(data.status)
        data.genres.forEach((genre,index) => {
          if(index < data.genres.length-1){
            $('#detail-genre').append(`${genre.name}<span style="margin: 0 1rem; color: #00719c;"> | </span>`)
          }      
          else{
            $('#detail-genre').append(`${genre.name}`)
          }
        });
        $('#detail-country').html("Country: " + data.origin_country[0])
        $('#detail-lang').html("Language: " + data.original_language.toUpperCase())
        $('#detail-release_date').html("Release Date: " + data.release_date!=null ? data.release_date : data.first_air_date)
        $('#detail-origin_name').html("Original Title: " + data.original_title!=null ? data.original_title : data.original_name)        
        $('#detail-overview').html(data.overview)
        $('#detail-img').attr('src',"https://image.tmdb.org/t/p/original/"+data.poster_path)
        const heroTitle = document.getElementById('detail-title')
        switch (data.genres[0].name) {
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
    })
    .catch(err => console.error(err));
  }

  //return the credit 
  function fetchCredit(){
    fetch(type=='movie'?`https://api.themoviedb.org/3/movie/${id}/credits?language=en-US`:`https://api.themoviedb.org/3/tv/${id}/credits?language=en-US`, options)
    .then(response => response.json())
    .then(response => {
        const {cast, crew} = response
        let actors = []
        let directors = []
        let producers = []
        for (let i = 0; i < cast.length; i++) {
            if(i<10){
                const { name, profile_path } = cast[i]
                const actor = { name: name, profile: profile_path }
                actors.push(actor)                
            }
        }
        for (let i = 0; i < crew.length; i++) {
        const { name, job, profile_path } = crew[i]
          if(crew[i].job == 'Director'){
            directors.push({ name: name, job: job, profile: profile_path })
          }else if(crew[i].job == 'Producer'){
            producers.push({ name: name, job: job, profile: profile_path })
          }          
        }  

        //html view actors
        actors.forEach(a => {
          $('.cast-list').append(
            `<div class='cast-detail'>
              <img class='cast-img' src='https://image.tmdb.org/t/p/original/${a.profile}.jpg' />
              <div class='cast-name'>${a.name}</div>
            </div>`
          )
        })

        //html view director
        directors.forEach(d => {
          $('#detail-director').append(d.name)  
        });
        
        //html view producer
        if(producers != null){
          for ( let i = 0; i<=producers.length;i++){
            if(i < producers.length-1){
              $('#detail-producer').append(producers[i].name + '<span style="margin: 0 1rem; color: #424242;" "> | </span>')
            }else if(i==producers.length-1){
              $('#detail-producer').append(producers[i].name)
            }
          }
        }                
    })
    .catch(err => console.error(err));
  }

  //return the similar 
  function fetchSimilar(){
    fetch(type=='movie'?`https://api.themoviedb.org/3/movie/${id}/similar?language=en-US&page=1`:`https://api.themoviedb.org/3/tv/${id}/similar?language=en-US&page=1`, options)
    .then(response => response.json())
    .then(response => {
        response.results.forEach(result => {
          const data = result
          $('.related-list').append(`
          <div class="card-container">
            <img class='card-img' src="https://image.tmdb.org/t/p/original${data.poster_path}">
            <a class="card-title">${data.title!=null?data.title:data.name}</a>
            <div class="card-detail">
                <div class='card-genre'>${movieListGenre(data.genre_ids)}</div>
                <div class='card-divider'>|</div>
                <div class='card-year'>${justYear(data.release_date!=null?data.release_date:data.first_air_date)}</div>
                <div class='card-divider'>|</div>
                <div class='card-lang'>${data.original_language.toUpperCase()}</div>
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

// return a list of genre name for detail
function movieGenre(genres) {
    let allGenre = []
    genres.forEach(genre => {
      allGenre.push(genre.name)
    });
    genres.reverse()
    let formatGenre = allGenre.join('  ')
    return formatGenre
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
    tv_genre.genres.forEach(tG => {
      if(g==tG.id && genre ==""){
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