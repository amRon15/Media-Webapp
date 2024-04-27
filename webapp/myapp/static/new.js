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

let trendMovieWeekUrl = "https://api.themoviedb.org/3/trending/movie/week?language=en-US";
let trendTvWeekUrl = "https://api.themoviedb.org/3/trending/tv/week?language=en-US";
let trendMovieUrl = "https://api.themoviedb.org/3/trending/movie/day?language=en-US";
let trendTvUrl = "https://api.themoviedb.org/3/trending/tv/day?language=en-US";
let upComingMovieUrl = "https://api.themoviedb.org/3/movie/upcoming?language=en-US&page=1";

window.onload = function () {
  $(document).ready(function () {
    fetchWeeklyData(trendMovieWeekUrl, "movie");
    fetchWeeklyData(trendTvWeekUrl, "tv");
    fecthDayData(trendMovieUrl);
    fecthDayData(trendTvUrl);
    carouselView();
    handleOnClick();
  });
};

//weekly movie / tv data
function fetchWeeklyData(url, type) {
  fetch(url, options)
    .then((response) => response.json())
    .then((response) => {
      if (type == "movie") {
        response.results.forEach((result) => {
          const data = result;
          movieListView(data);
        });
      } else if (type == "tv") {
        response.results.forEach((result) => {
          const data = result;
          tvListView(data);
        });
      }
    })
    .catch((err) => console.error(err));
}

//day movie / tv data
function fecthDayData(url) {
  fetch(url, options)
    .then((response) => response.json())
    .then((response) => {
      const data = response.results;
      if (data[0].title != null) {
        featureView(sortByDate(data), "movie", url);
      } else {
        featureView(sortByDate(data), "tv", url);
      }
    })
    .catch((err) => console.error(err));
}

//carousel view
function carouselView() {
  fetch("https://api.themoviedb.org/3/movie/upcoming?language=en-US&page=1", options)
    .then((response) => response.json())
    .then((response) => {
      const data = response.results;
      data.forEach((d, i) => {
        if (i < 8) {
          $(".carousel-inner").append(`
          <div class="carousel-item ${i == 1 ? "active" : ""}">
          <img src='https://image.tmdb.org/t/p/original${d.backdrop_path}' class="d-block w-100" />
          <div class="carousel-caption d-none d-md-block">
              <img src="https://image.tmdb.org/t/p/original${d.poster_path}" id='${d.id}' class="carousel-item-poster" />
              <h4>${d.title}</h5>
              <p>${genre(d.genre_ids)}</p>
          </div>
          </div>
        `);
        }
        if (i > 7 && i < 11) {
          $(".upcoming-list").append(`
          <span class="upcoming">
          <img src="https://image.tmdb.org/t/p/original${d.poster_path}" id='${d.id}' class='upcoming-img'/>
          <div class="upcoming-info">
              <div class="upcoming-title">${d.title}</div>
              <div class="upcoming-date">${d.release_date}</div>
              <div class="upcoming-lang">${d.original_language.toUpperCase()}</div>
          </div>
          </span>
        `);
        }
      });
      $(".carousel-item-poster").each((_, e) => {
        $(e).on("click", () => {
          sendDataToDetailTemplate(e.id, "movie");
        });
      });
      $(".upcoming-img").each((_, e) => {
        $(e).on("click", () => {
          sendDataToDetailTemplate(e.id, "movie");
        });
      });
    })
    .catch((err) => console.error(err));
}

//feature view
function featureView(data, type, url) {
  data.forEach((d, i) => {
    if (i > 3 && i < 7 && type == "movie") {
      $(".feature-movie-img").append(`
        <img src="https://image.tmdb.org/t/p/original${d.poster_path}" />
    `);
    } else if (i > 3 && i < 7 && type == "tv") {
      $(".feature-tv-img").append(`
        <img src="https://image.tmdb.org/t/p/original${d.poster_path}" />
      `);
    }
  });
  $(".feature-movie").on("click", () => {
    navToMorePage(url, "movie", "Trending Movie Of The Day");
  });
  $(".feature-tv").on("click", () => {
    navToMorePage(url, "tv", "Trending TV Series");
  });
}

//trending movie list view
function movieListView(data) {
  $(`.weekly-movie-list`).append(`
            <div class="card-container">
                <img class='card-img movie-card' id='${data.id}' src="https://image.tmdb.org/t/p/original${data.poster_path}">
                <a class="card-title">${data.title}</a>
                <div class="card-detail">
                    <div class='card-genre'>${movieGenre(data.genre_ids)}</div>
                    <div class='card-divider'>|</div>
                    <div class='card-year'>${justYear(data.release_date)}</div>
                    <div class='card-divider'>|</div>
                    <div class='card-lang'>${data.original_language.toUpperCase()}</div>
                </div>
            </div>
    `);
  $(".movie-card").each((_, e) => {
    $(e).on("click", () => {
      sendDataToDetailTemplate(e.id, "movie");
    });
  });
  $(".card-title").each((_, e) => {
    $(e).on("click", () => {
      const eId = $(e).parent().find("img").attr("id");
      sendDataToDetailTemplate(eId, "movie");
    });
  });
}

//trending tv list view
function tvListView(data) {
  $(`.weekly-tv-list`).append(`
        <div class="card-container">
            <img class='card-img tv-card' id='${data.id}' src="https://image.tmdb.org/t/p/original${data.poster_path}">
            <a class="card-title">${data.name}</a>
            <div class="card-detail">
                <div class='card-genre'>${tvGenre(data.genre_ids)}</div>
                <div class='card-divider'>|</div>
                <div class='card-year'>${justYear(data.first_air_date)}</div>
                <div class='card-divider'>|</div>
                <div class='card-lang'>${data.original_language.toUpperCase()}</div>
            </div>
        </div>
    `);
  $(".tv-card").each((_, e) => {
    $(e).on("click", () => {
      sendDataToDetailTemplate(e.id, "tv");
    });
  });
  $(".card-title").each((_, e) => {
    $(e).on("click", () => {
      const eId = $(e).parent().find("img").attr("id");
      sendDataToDetailTemplate(eId, "tv");
    });
  });
}

//handle find movie view on click
function handleOnClick() {
  //video list
  $(".trend-movie-list-container .list-btn-next").each((_, e) => {
    $(e).on("click", () => {
      $("#weekly-movie-list").animate(
        {
          scrollLeft: $("#weekly-movie-list").scrollLeft() + 1296,
        },
        600
      );
    });
  });
  $(".trend-movie-list-container .list-btn-prev").each((_, e) => {
    $(e).on("click", () => {
      $("#weekly-movie-list").animate(
        {
          scrollLeft: $("#weekly-movie-list").scrollLeft() - 1296,
        },
        600
      );
    });
  });

  //pop list container btn
  $(".trend-tv-list-container .list-btn-next").each((_, e) => {
    $(e).on("click", () => {
      $("#weekly-tv-list").animate(
        {
          scrollLeft: $("#weekly-tv-list").scrollLeft() + 1296,
        },
        600
      );
    });
  });
  $(".trend-tv-list-container .list-btn-prev").each((_, e) => {
    $(e).on("click", () => {
      $("#weekly-tv-list").animate(
        {
          scrollLeft: $("#weekly-tv-list").scrollLeft() - 1296,
        },
        600
      );
    });
  });
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

//return a tv genre name
function tvGenre(genres) {
  let genre = "";
  genres.forEach((g) => {
    tv_genre.genres.forEach((tG) => {
      if (g == tG.id && genre == "") {
        genre = tG.name;
      }
    });
  });
  return genre;
}

//return a movie genre name
function movieGenre(genres) {
  let genre = "";
  genres.forEach((g) => {
    movie_genre.genres.forEach((mG) => {
      if (g == mG.id && genre == "") {
        genre = mG.name;
      }
    });
  });
  return genre;
}

//return date with just year
function justYear(date) {
  return date.slice(0, 4);
}

//nav to more
function navToMorePage(url, type, title) {
  localStorage.setItem("url", url);
  localStorage.setItem("type", type);
  localStorage.setItem("isNextPage", false);
  localStorage.setItem("title", title);
  location.href = "more.html";
}

//navigate to detail page
function sendDataToDetailTemplate(id, type) {
  localStorage.setItem("keyId", id);
  localStorage.setItem("type", type);
  location.href = "detail.html";
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
