//genre of tv
const tv_genre = {
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
const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization:
      "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxYjMxZTZkYjM3NTdkMTI3YWU0NjE2ODMyYzkwMjc2MCIsInN1YiI6IjYyOGM4MmViZWQyYWMyNTQ2OTllODkwMyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.OMw-6etv7U0d0qIkPC_30V2RPWo9s_9lelEwFbF-l7c",
  },
};

let heroTv = [];

//api url
let trendTvUrl = "https://api.themoviedb.org/3/trending/tv/day?language=en-US";
let topRatedTvUrl = "https://api.themoviedb.org/3/tv/top_rated?language=en-US&page=1";
let page = 1;
let sortType = "popularity.desc";
let genre_id;
const typeOfMedia = "tv";

window.onload = function () {
  $(document).ready(function () {
    fetchData(trendTvUrl, heroTv);
    fetchData(trendTvUrl, null, "trend-list");
    fetchData(topRatedTvUrl, null, "top-rated-list");
    allTvView(page, sortType, null);
    genreFilter();
    handleOnClick();
    handlePageChange();
  });
};

//return the movie List
function fetchData(url, arr, name) {
  let data = [];
  fetch(url, options)
    .then((response) => response.json())
    .then((response) => {
      response.results.forEach((result) => {
        const { id, genre_ids, backdrop_path, poster_path, name, first_air_date, original_language, vote_average, overview } = result;
        if (arr != undefined) {
          arr.push(result);
        }
        data.push(result);
      });
      if (arr != undefined) {
        heroView(arr[0]);
      }
      if (name == "trend-list") {
        movieListView(data.slice(1, 11), name);
      } else if (name == "top-rated-list") {
        movieListView(sortByDate(data), name);
      }
    })
    .catch((err) => console.error(err));
}

//hero view
function heroView(data) {
  $("#hero-backdrop").attr("src", `https://image.tmdb.org/t/p/original${data.backdrop_path}`);
  $("#hero-backdrop-border").attr("src", `https://image.tmdb.org/t/p/original${data.backdrop_path}`);
  $(".hero-detail-title").html(data.name);
  tvGenreList(data.genre_ids).forEach((g, index) => {
    if (index < data.genre_ids.length - 1) {
      $(".hero-detail-genre").append(`${g} <span style="margin: 0 1rem; color: #00719c;"> | </span>`);
    } else {
      $(".hero-detail-genre").append(`${g}`);
    }
  });
  $(".hero-detail-rate").html("&starf; " + roundRate(data.vote_average));
  $(".hero-detail-lang").html(data.original_language.toUpperCase());
  $(".hero-detail-date").html(data.first_air_date);
  $(".hero-detail-description").html(data.overview);
  getYtKey(data.id);
  $("#hero-detail-info-btn").on("click", () => {
    sendDataToDetailTemplate(data.id);
  });

  const heroTitle = document.querySelector(".hero-detail-title");
  switch (tvGenre(data.genre_ids)) {
    case "Action & Adventure":
      heroTitle.style.fontFamily = "Bebas Neue, cursive";
      break;
    case "Kids":
      heroTitle.style.fontFamily = "Rampart One, sans-serif";
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
      heroTitle.style.fontFamily = "Cormorant Unicase, serif";
      break;
    case "Drama":
      heroTitle.style.fontFamily = "Merriweather, serif";
      break;
    case "Family":
      heroTitle.style.fontFamily = "Pacifico, cursive";
      break;
    case "Mystery":
      heroTitle.style.fontFamily = "Special Elite, cursive";
      break;
    case "News":
      heroTitle.style.fontFamily = "Cormorant Unicase, serif";
      break;
    case "Reality":
      heroTitle.style.fontFamily = "Kantumruy Pro, sans-serif";
      break;
    case "Sci-Fi & Fantasy":
      heroTitle.style.fontFamily = "Zen Dots, sans-serif";
      break;
    case "Soap":
      heroTitle.style.fontFamily = "Buda, serif";
      break;
    case "Romance":
      heroTitle.style.fontFamily = "Great Vibes, cursive";
      break;
    case "Talk":
      heroTitle.style.fontFamily = "AR One Sans, sans-serif";
      break;
    case "War & Politics":
      heroTitle.style.fontFamily = "Montserrat, sans-serif";
      break;
    case "Western":
      heroTitle.style.fontFamily = "Kaisei Opti, serif";
      break;
    default:
      heroTitle.style.fontFamily = "Bitter, serif";
      break;
  }
}

//list view
function movieListView(data, listName) {
  data.forEach((tv) => {
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
        `);
  });
  //handle element on click
  $(".card-img").each((_, element) => {
    $(element).on("click", () => {
      console.log(element.id);
      sendDataToDetailTemplate(element.id);
    });
  });

  $(".card-title").each((_, element) => {
    $(element).on("click", () => {
      sendDataToDetailTemplate(element.id);
    });
  });
}

//all movie view
function allTvView(page, sortType, genre) {
  fetch(
    `https://api.themoviedb.org/3/discover/tv?include_adult=false&include_video=false&language=en-US&page=${page}&sort_by=${sortType}${
      genre != null ? "&with_genres=" + genre : ""
    }`,
    options
  )
    .then((response) => response.json())
    .then((response) => {
      const data = response.results;
      $(".find-movie-list").html("");
      data.forEach((d, i) => {
        $(".find-movie-list").append(`
      <div class="movie-list-item">
        <img class="movie-list-item-img" id='${d.id}' src="https://image.tmdb.org/t/p/original${d.poster_path}">                    
        <div class="movie-list-item-detail" id='e'>
            <div class="movie-list-item-title">${d.name}</div>
            <div class="movie-list-item-date">${d.first_air_date}</div>
            <div class="movie-list-item-genre">${tvGenreList(d.genre_ids)}</div>
            <div class="movie-list-item-rate">
                <i class="fa fa-star" aria-hidden="true"></i>
                ${roundRate(d.vote_average)}
            </div>
        </div>
        <span>
            <i class="fa fa-bookmark movie-list-item-bookmark" aria-hidden="true"></i>
            &nbsp;
            <i class="fa fa-info-circle movie-list-item-info" aria-hidden="true"></i>
        </span>                    
      </div>
      ${i < data.length - 1 ? '<div class="list-item-divider"></div>' : ""}
    `);
      });
      $(".movie-list-item-img").each((_, e) => {
        $(e).on("click", () => {
          sendDataToDetailTemplate(e.id);
        });
      });
      $(".movie-list-item-title").each((_, e) => {
        $(e).on("click", () => {
          const eId = $(e).parent().parent().find("img").attr("id");
          sendDataToDetailTemplate(eId);
        });
      });

      $('.movie-list-item-info').each((_,e)=>{
        $(e).on('click',()=>{
          const eId = $(e).parent().parent().find("img").attr("id");
          sendDataToDetailTemplate(eId)
        })
      })

      $(".movie-list-item-bookmark").each((_, e) => {
        const eId = $(e).parent().parent().find("img").attr("id");
        //get which one already saved
        $.ajax({
          type: "post",
          url: "/getSpecificID",
          data: {
            id: eId,
            type: typeOfMedia,
            csrfmiddlewaretoken: $("input[name='csrf']").val(),
          },
          success: function (response) {
            if (response.saved) {
              console.log("saved already");
              $(e).css("color", "#ffe600");
            } else {
              console.log("not save yet");
              $(e).css("color", "white");
            }
          },
        });

        $(e).on("click", () => {
          //bookmark when click
          $.ajax({
            type: "post",
            url: "/saveMovieID",
            data: {
              id: eId,
              type: typeOfMedia,
              csrfmiddlewaretoken: $("input[name='csrf']").val(),
            },
            success: function (response) {
              if (response.action == "saved") {
                console.log("successful saved");
                $(e).css("color", "#ffe600");
              } else if (response.action == "deleted") {
                console.log("successful deleted");
                $(e).css("color", "white");
              } else {
                console.log("failed");
              }
            },
          });
        });
      });
    })
    .catch((err) => console.error(err));
}

//dropdown genre
function genreFilter() {
  $(".dropdown-menu-genre").append(`
    <li><p class="dropdown-item genre-type">All</p></li>     
  `);
  tv_genre.genres.forEach((g) => {
    $(".dropdown-menu-genre").append(`
      <li><p class="dropdown-item genre-type" id="${g.id}">${g.name}</p></li>     
    `);
  });
}

//handle find movie view on click
function handleOnClick() {
  $(".sort-type").each((_, e) => {
    $(e).on("click", () => {
      sortType = e.id;
      page = 1;
      allTvView(page, sortType, genre_id);
      $("#sort-type-btn").html($(e).html() + ' <i class="fa fa-sort find-movie-sort-btn" aria-hidden="true"></i>');
      $("#page-index").html(page);
    });
  });
  $(".genre-type").each((_, e) => {
    $(e).on("click", () => {
      if ($(e).html() == "All") {
        genre_id = null;
        page = 1;
        allTvView(page, sortType, genre_id);
        $("#genre-filter-btn").html('Genre <i class="fa fa-caret-down" aria-hidden="true"></i>');
        $("#page-index").html(page);
      } else {
        genre_id = e.id;
        page = 1;
        allTvView(page, sortType, genre_id);
        $("#genre-filter-btn").html($(e).html() + ' <i class="fa fa-caret-down" aria-hidden="true"></i>');
        $("#page-index").html(page);
      }
    });
  });

  //video list
  $(".hero-video-container .list-btn-next").each((_, e) => {
    $(e).on("click", () => {
      $("#hero-video-list").animate(
        {
          scrollLeft: $("#hero-video-list").scrollLeft() + 1296,
        },
        600
      );
    });
  });
  $(".hero-video-container .list-btn-prev").each((_, e) => {
    $(e).on("click", () => {
      $("#hero-video-list").animate(
        {
          scrollLeft: $("#hero-video-list").scrollLeft() + 1296,
        },
        600
      );
    });
  });

  //pop list container btn
  $(".trend-list-container .list-btn-next").each((_, e) => {
    $(e).on("click", () => {
      $("#trend-list").animate(
        {
          scrollLeft: 1296,
        },
        600
      );
    });
  });
  $(".trend-list-container .list-btn-prev").each((_, e) => {
    $(e).on("click", () => {
      $("#trend-list").animate(
        {
          scrollLeft: -1296,
        },
        600
      );
    });
  });

  //top rated list btn
  $(".top-rated-list-container .list-btn-next").each((_, e) => {
    $(e).on("click", () => {
      $("#top-rated-list").animate(
        {
          scrollLeft: $("#top-rated-list").scrollLeft() + 1296,
        },
        600
      );
    });
  });
  $(".top-rated-list-container .list-btn-prev").each((_, e) => {
    $(e).on("click", () => {
      $("#top-rated-list").animate(
        {
          scrollLeft: $("#top-rated-list").scrollLeft() - 1296,
        },
        600
      );
    });
  });
}

//handle change page
function handlePageChange() {
  const movieList = $(".dropdown");
  $("#page-pre").on("click", () => {
    if (page != 1) {
      page -= 1;
      allTvView(page, sortType, genre_id);
      $("#page-index").html(page);
      $("html").animate(
        {
          scrollTop: movieList.offset().top,
        },
        100
      );
    }
  });
  $("#page-next").on("click", () => {
    page += 1;
    allTvView(page, sortType, genre_id);
    $("#page-index").html(page);
    $("html").animate(
      {
        scrollTop: movieList.offset().top,
      },
      100
    );
  });
}

//get yt key
function getYtKey(id) {
  fetch(`https://api.themoviedb.org/3/tv/${id}/videos?language=en-US`, options)
    .then((response) => response.json())
    .then((response) => {
      response.results.forEach((result, i) => {
        if (i == 0) {
          trailerKey = result.key;
          $("#hero-detail-trailer-btn").on("click", () => {
            location.href = `https://www.youtube.com/watch?v=${trailerKey}`;
          });
        } else if (i > 0 && i < 8) {
          const { key } = result;
          $(".hero-video-list").append(`<iframe src="https://www.youtube.com/embed/${key}" frameborder="0" allowfullscreen></iframe>`);
        }
      });
    })
    .catch((err) => console.error(err));
}

//calculate runtime total mins > _h_min
function calRuntime(runtime) {
  let time = runtime;
  let hour = 0;
  let total;
  while (time > 59) {
    hour++;
    time -= 60;
  }
  if (time == 0) {
    total = hour + "h";
  } else {
    total = hour + "h " + time + "min";
  }
  return total;
}

//return a list of genre name
function tvGenreList(genres) {
  let allGenre = [];
  genres.forEach((g) => {
    tv_genre.genres.forEach((tg) => {
      if (g == tg.id) {
        allGenre.push(tg.name);
      }
    });
  });
  return allGenre;
}

//return a genre name for recommend list
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

//return date with just year
function justYear(date) {
  return date.slice(0, 4);
}

//navigate to detail page
function sendDataToDetailTemplate(id) {
  localStorage.setItem("keyId", id);
  localStorage.setItem("type", "tv");
  location.href = "detail.html";
}

//round the rate in 2 decimal places
function roundRate(rate) {
  return Math.round(rate * 10) / 10;
}

//check year == current year
function checkYear(data) {
  let thisYearData = [];
  let cuurentYear = new Date().getFullYear();
  data.forEach((movie) => {
    let date = new Date(movie.first_air_date);
    if (date.getFullYear() == cuurentYear) {
      thisYearData.push(movie);
    }
  });
  return thisYearData;
}

//sort movie list by data
function sortByDate(data) {
  data = data.sort((a, b) => {
    if (a.first_air_date > b.first_air_date) return -1;
    if (a.first_air_date < b.first_air_date) return 1;
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
