let jscript = document.createElement('script');
jscript.setAttribute('src','https://ajax.googleapis.com/ajax/libs/jquery/3.7.1/jquery.min.js');
jscript.type = 'text/javascript';
document.getElementsByTagName('head')[0].appendChild(jscript)

jscript.onload = function(){    
    $(document).ready(function(){
        fetchMovieData()
        ytVideo()
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

  //genre of movie & tv 
  tv_genre = {
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
  movie_genre = {
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
    "https://api.themoviedb.org/3/movie/" + id + "/videos?language=en-US",
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
    fetch(`https://api.themoviedb.org/3/movie/${id}?language=en-US`, options)
    .then(response => response.json())
    .then(response => {
        const {
            poster_path,
            adult,
            genres,
            origin_country,
            original_language,
            original_title,
            overview,
            release_date,
            runtime,
            status,
            tagline,
            title,
            vote_average,
        } = response
        let rating = Math.round(vote_average * 10 ) / 10        
        $('#detail-title').html(title)
        $('#detail-tagline').html(tagline)
        $('#detail-rating').html(`<i class="fa fa-star" aria-hidden="true"></i>${rating}`)        
        $('#detail-runtime').html(calRuntime(runtime))
        $('#detail-status').html(status)
        $('#detail-genre').html(movieGenre(genres))
        $('#detail-country').html("Country: " + origin_country[0])
        $('#detail-lang').html("Language: " + original_language.toUpperCase())
        $('#detail-release_date').html("Release Date: " + release_date)
        $('#detail-origin_name').html("Original Title: " + original_title)        
        $('#detail-overview').html(overview)
        $('#detail-img').attr('src',"https://image.tmdb.org/t/p/original/"+poster_path)
        
    })
    .catch(err => console.error(err));
  }

  //return the credit 
  function fetchCredit(){
    fetch(`https://api.themoviedb.org/3/movie/${id}/credits?language=en-US`, options)
    .then(response => response.json())
    .then(response => {
        const {cast, crew} = response
        let actors = []
        let directors = {}
        for (let i = 0; i < cast.length; i++) {
            if(i<10){
                const { name, profile_path } = cast[i]
                const actor = { name: name, profile: profile_path }
                actors.push(actor)                
            }
        }
        for (let i = 0; i < crew.length; i++) {
        const { name, job, profile_path } = crew[i]
        const director = { name: name, job: job, profile_path: profile_path }      
        job === "Director" ? directors = director : null
        }    
        $('#detail-director').html("Director: " +directors.name)
        
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

// return a list of genre name
function movieGenre(genres) {
    let allGenre = []
    genres.forEach(genre => {
        allGenre.push(genre.name)
    });
    genres.reverse
    let formatGenre = allGenre.join(' | ')
    return formatGenre
}