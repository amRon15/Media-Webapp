//genre of movie & tv
let tv_genre = {
  genres: [
    {
      id: 10759,
      name: "Action & Adventure",
    },
    {
      id: 16,
      name: "Animation",
    },
    {
      id: 35,
      name: "Comedy",
    },
    {
      id: 80,
      name: "Crime",
    },
    {
      id: 99,
      name: "Documentary",
    },
    {
      id: 18,
      name: "Drama",
    },
    {
      id: 10751,
      name: "Family",
    },
    {
      id: 10762,
      name: "Kids",
    },
    {
      id: 9648,
      name: "Mystery",
    },
    {
      id: 10763,
      name: "News",
    },
    {
      id: 10764,
      name: "Reality",
    },
    {
      id: 10765,
      name: "Sci-Fi & Fantasy",
    },
    {
      id: 10766,
      name: "Soap",
    },
    {
      id: 10767,
      name: "Talk",
    },
    {
      id: 10768,
      name: "War & Politics",
    },
    {
      id: 37,
      name: "Western",
    },
  ],
};
let movie_genre = {
  genres: [
    {
      id: 28,
      name: "Action",
    },
    {
      id: 12,
      name: "Adventure",
    },
    {
      id: 16,
      name: "Animation",
    },
    {
      id: 35,
      name: "Comedy",
    },
    {
      id: 80,
      name: "Crime",
    },
    {
      id: 99,
      name: "Documentary",
    },
    {
      id: 18,
      name: "Drama",
    },
    {
      id: 10751,
      name: "Family",
    },
    {
      id: 14,
      name: "Fantasy",
    },
    {
      id: 36,
      name: "History",
    },
    {
      id: 27,
      name: "Horror",
    },
    {
      id: 10402,
      name: "Music",
    },
    {
      id: 9648,
      name: "Mystery",
    },
    {
      id: 10749,
      name: "Romance",
    },
    {
      id: 878,
      name: "Science Fiction",
    },
    {
      id: 10770,
      name: "TV Movie",
    },
    {
      id: 53,
      name: "Thriller",
    },
    {
      id: 10752,
      name: "War",
    },
    {
      id: 37,
      name: "Western",
    },
  ],
};

const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization:
      "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxYjMxZTZkYjM3NTdkMTI3YWU0NjE2ODMyYzkwMjc2MCIsInN1YiI6IjYyOGM4MmViZWQyYWMyNTQ2OTllODkwMyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.OMw-6etv7U0d0qIkPC_30V2RPWo9s_9lelEwFbF-l7c",
  },
};

let popMovieUrl = "https://api.themoviedb.org/3/movie/popular?language=en-US&page=1";
let popTvUrl = "https://api.themoviedb.org/3/tv/popular?language=en-US&page=1";
let trendTvUrl = "https://api.themoviedb.org/3/trending/tv/day?language=en-US";
let popPeopleUrl = "https://api.themoviedb.org/3/trending/person/day?language=en-US";

window.onload = function () {
  $(document).ready(function () {
    fetchData(popMovieUrl, "movie");
    fetchData(trendTvUrl, "tv");
    peopleListView(popPeopleUrl);
    handleClick();
    carouselView();
  });
};

function handleClick() {
  $("#pop-movie-more").on("click", () => {
    navToMorePage(popMovieUrl, "movie", "Popular Movie");
  });

  $("#pop-tv-more").on("click", () => {
    navToMorePage(trendTvUrl, "tv", "Popular TV Series");
  });

  //pop list btn
  $(".pop-movie-list-container .list-btn-next").each((_, e) => {
    $(e).on("click", () => {
      $("#pop-movie-list").animate(
        {
          scrollLeft: $("#pop-movie-list").scrollLeft() + 1296,
        },
        600
      );
    });
  });
  $(".pop-movie-list-container .list-btn-prev").each((_, e) => {
    $(e).on("click", () => {
      $("#pop-movie-list").animate(
        {
          scrollLeft: $("#pop-movie-list").scrollLeft() - 1296,
        },
        600
      );
    });
  });
  $(".pop-tv-list-container .list-btn-next").each((_, e) => {
    $(e).on("click", () => {
      $("#pop-tv-list").animate(
        {
          scrollLeft: $("#pop-tv-list").scrollLeft() + 1296,
        },
        600
      );
    });
  });
  $(".pop-tv-list-container .list-btn-prev").each((_, e) => {
    $(e).on("click", () => {
      $("#pop-tv-list").animate(
        {
          scrollLeft: $("#pop-tv-list").scrollLeft() - 1296,
        },
        600
      );
    });
  });

  //cast list btn
  $(".pop-cast-list-container .list-btn-next").each((_, e) => {
    $(e).on("click", () => {
      $("#pop-people-list").animate(
        {
          scrollLeft: $("#pop-people-list").scrollLeft() + 1296,
        },
        600
      );
    });
  });
  $(".pop-cast-list-container .list-btn-prev").each((_, e) => {
    $(e).on("click", () => {
      $("#pop-people-list").animate(
        {
          scrollLeft: $("#pop-people-list").scrollLeft() - 1296,
        },
        600
      );
    });
  });
}

//return the movie List
function fetchData(url, type) {
  let data = [];
  fetch(url, options)
    .then((response) => response.json())
    .then((response) => {
      if (type == "movie") {
        response.results.forEach((result) => {
          const { id, genre_ids, backdrop_path, poster_path, title, release_date, original_language, vote_average, overview } = result;
          data.push(result);
        });
      } else {
        response.results.forEach((result) => {
          const { id, genre_ids, backdrop_path, poster_path, name, first_air_date, original_language, vote_average, overview } = result;
          data.push(result);
        });
      }
      if (type == "movie") {
        listView(data, "pop-movie-list");
      } else {
        listView(data, "pop-tv-list");
      }
    })
    .catch((err) => console.error(err));
}

//return view for carousel
function carouselView() {
  fetch("https://api.themoviedb.org/3/trending/all/day?language=en-US", options)
    .then((response) => response.json())
    .then((response) => {
      const data = response.results;
      data.forEach((d, i) => {
        if ((d.media_type == "movie" || d.media_type == "tv") && i <= 5) {
          $(".carousel-inner").append(`
          <div class="carousel-item ${i == 0 ? "active" : ""}" id="slide${i}">
            <img src="https://image.tmdb.org/t/p/original${d.backdrop_path}" class="d-block w-100 opacity-75" id='${d.id}'>
            <div class="carousel-caption d-none d-md-block">
              <h1>${d.title != null ? d.title : d.name}</h5>
              <p>${genre(d.genre_ids)}</p>
            </div>
          </div>
        `);
        }
      });
    })
    .catch((err) => console.error(err));
}

//return popular people
function peopleListView(url) {
  fetch(url, options)
    .then((response) => response.json())
    .then((response) => {
      response.results.forEach((result,i) => {
        const { id, popularity, name, known_for_department, known_for, profile_path, original_name,gender } = result;
        $(".pop-people-list").append(`
                <div class='cast-detail'  data-bs-toggle="collapse" data-bs-target="#multiCollapseExample${i}" aria-expanded="false" aria-controls="multiCollapseExample${i}" >
                    <img class='cast-img' src='https://image.tmdb.org/t/p/original/${profile_path}.jpg'/>
                    <div class='cast-name'>${name}</div>
                </div>
            `);
        $('.collapse-list').append(`
            <div class="collapse multi-collapse" id="multiCollapseExample${i}" data-bs-parent="#collapse-list">
              <div class="card card-body">
                <div class='card-body-container' id='${known_for[0].media_type}'>                  
                  <img class='card-body-img' id='${known_for[0].id}' src='https://image.tmdb.org/t/p/original/${known_for[0].poster_path}.jpg'  >
                  <div class='card-body-detail'>
                    <div class='card-body-known'>Known For</div>
                    <div class='card-body-title'>Title: <span>${known_for[0].title !=null ? known_for[0].title : known_for[0].name }</span></div>
                    <div class='card-body-rate'>Rating: <span>&starf; ${Math.round(known_for[0].vote_average * 10) / 10}</span></div>
                    <div class='card-body-genre'>Genre: ${movieGenreList(known_for[0].genre_ids).map((g,i)=>{
                      if(i < 3) {
                        if(i < known_for[0].genre_ids.length -1 || i < 2 ){return g+' <span style="margin: 0 1rem; color: #00719c;"> | </span>'}
                        else{return g} }}).join('')
                      }
                    </div>
                    <div class='card-body-lang'>Original Language: ${known_for[0].original_language.toUpperCase()}</div>                    
                    <div class='card-body-date'>Release Date: ${known_for[0].release_date != null ? known_for[0].release_date : known_for[0].first_air_date}</div>
                    <div class='card-body-oTitle'>Original Title: ${known_for[0].original_title != null ? known_for[0].original_title : known_for[0].original_name}</div>
                  </div>
                  <div class='divider-vertical'></div>
                  <div class='card-body-actor-detail'>
                    <div class='card-body-info'>Information</div>
                    <div class='card-body-actor-name'>Name: ${name} </div>
                    <div class='card-body-actor-oName'>Original Name: ${original_name} </div>
                    <div class='card-body-dept'>Known For: ${known_for_department} </div>
                    <div class='card-body-actor-gender'>Gender: ${gender==1 ? 'Female' : 'Male'} </div>
                  </div>
                </div>
              </div>
            </div>
        `)                
      });
      $('.card-body-img').each((_,e)=>{
        $(e).on('click',()=>{
          const type = $(e).parent().attr('id')
          sendDataToDetailTemplate(e.id,type)
        })
      })
      $('.card-body-title').each((_,e)=>{
        $(e).on('click',()=>{
          const type = $(e).parent().parent().attr('id')
          const eId = $(e).parent().parent().find('img').attr('id')
          sendDataToDetailTemplate(eId,type)
        })
      })
    })
    .catch((err) => console.error(err));
}

//return movie list
function listView(data, name) {
  data.forEach((m) => {
    $(`.${name}`).append(`
            <div class="card-container" id=${m.title != null ? "movie" : "tv"}>
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
        `);
  });
  $(".card-img").each((_, e) => {
    $(e).on("click", () => {
      let type = $(e).parent().attr("id");
      sendDataToDetailTemplate(e.id, type);
    });
  });
  $(".card-title").each((_, e) => {
    $(e).on("click", () => {
      let type = $(e).parent().attr("id");
      sendDataToDetailTemplate(e.id, type);
    });
  });
}

function movieGenreList(genres) {
  let allGenre = [];
  genres.forEach((g) => {
    movie_genre.genres.forEach((mg) => {
      if (g == mg.id) {
        allGenre.push(mg.name);
      }
    });
    if(allGenre==null){
      tv_genre.genres.forEach((tG)=>{
        if(g == tG.id){
          allGenre.push(tg.name)
        }
      })
    }
  });
  return allGenre;
}

//return a genre name for recommend list
function genre(genres) {
  let genre = "";
  genres.forEach((g) => {
    movie_genre.genres.forEach((mG) => {
      if (g == mG.id && genre == "") {
        genre = mG.name;
      }
    });
  });
  genres.forEach((g) => {
    tv_genre.genres.forEach((tG) => {
      if (g == tG.id && genre == "") {
        genre = tG.name;
      }
    });
  });
  return genre;
}

//return date with just year
function justYear(date) {
  return date.slice(0, 4);
}

//sort movie list by data
function sortByDate(data) {
  data = data.sort((a, b) => {
    if (a.release_date > b.release_date) return -1;
    if (a.release_date < b.release_date) return 1;
    return 0;
  });
  return data;
}

//sort movie list by popularity
function sortByPopularity(data) {
  data = data.sort((a, b) => {
    if (a.popularity > b.popularity) return -1;
    if (a.popularity < b.popularity) return 1;
    return 0;
  });
  return data;
}

//sort movie list by rating
function sortByRating(data) {
  data = data.sort((a, b) => {
    if (a.vote_average > b.vote_average) return -1;
    if (a.vote_average < b.vote_average) return 1;
    return 0;
  });
  return data;
}

//nav to more
function navToMorePage(url, type, title) {
  localStorage.setItem("url", url);
  localStorage.setItem("type", type);
  localStorage.setItem("title", title);
  location.href = "more.html";
}

//navigate to detail page
function sendDataToDetailTemplate(id, type) {
  localStorage.setItem("keyId", id);
  localStorage.setItem("type", type);
  location.href = "detail.html";
}
