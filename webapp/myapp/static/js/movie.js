//api url
let popMovieUrl = "https://api.themoviedb.org/3/movie/popular?language=en-US&page=1";
let topRatedUrl = "https://api.themoviedb.org/3/movie/top_rated?language=en-US&page=1";
let nowMovieUrl = "https://api.themoviedb.org/3/movie/now_playing?language=en-US&page=1";
let trendMovieUrl = "https://api.themoviedb.org/3/trending/movie/day?language=en-US";
let allMovieUrl = "https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc";

let heroMovie = [];

let page = 1;
let sortType = "popularity.desc";
let genre_id;
const typeOfMedia = "movie";

window.onload = function () {
  $(document).ready(function () {
    fetchData(popMovieUrl, heroMovie);
    fetchData(popMovieUrl, null, "pop-list");
    fetchData(nowMovieUrl, null, "top-rated-list");
    allMovieView(page, sortType, null);
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
        const { id, genre_ids, backdrop_path, poster_path, title, release_date, original_language, vote_average, overview } = result;
        if (arr != undefined) {
          arr.push(result);
        }
        data.push(result);
      });
      if (arr != undefined) {
        heroView(arr[0]);
      }
      if (name == "pop-list") {
        movieListView(sortByPopularity(data).slice(1, 11), "pop-list");
      } else if (name == "top-rated-list") {
        movieListView(sortByRating(checkYear(data)), "top-rated-list");
      }
    })
    .catch((err) => console.error(err));
}

//hero view
function heroView(data) {
  $("#hero-backdrop").attr("src", `https://image.tmdb.org/t/p/original${data.backdrop_path}`);
  $("#hero-backdrop-border").attr("src", `https://image.tmdb.org/t/p/original${data.backdrop_path}`);
  $(".hero-detail-title").html(data.title);
  genreList(data.genre_ids).forEach((g, index) => {
    if (index < data.genre_ids.length - 1) {
      $(".hero-detail-genre").append(`${g} <span style="margin: 0 1rem; color: #00719c;"> | </span>`);
    } else {
      $(".hero-detail-genre").append(`${g}`);
    }
  });
  $(".hero-detail-rate").html("&starf; " + roundRate(data.vote_average));
  $(".hero-detail-lang").html(data.original_language.toUpperCase());
  $(".hero-detail-date").html(data.release_date);
  $(".hero-detail-description").html(data.overview);
  getYtKey(data.id);
  $("#hero-detail-info-btn").on("click", () => {
    sendDataToDetailTemplate(data.id);
  });

  //different font family with different genre
  const heroTitle = document.querySelector(".hero-detail-title");
  switch (genre(data.genre_ids)) {
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
function movieListView(data, listName) {
  data.forEach((m) => {
    $(`.${listName}`).append(`
            <div class="card-container">
                <img class='card-img' id='${m.id}' src="https://image.tmdb.org/t/p/original${m.poster_path}">
                <a class="card-title" id='${m.id}'>${m.title}</a>
                <div class="card-detail">
                    <div class='card-genre'>${genre(m.genre_ids)}</div>
                    <div class='card-divider'>|</div>
                    <div class='card-year'>${justYear(m.release_date)}</div>
                    <div class='card-divider'>|</div>
                    <div class='card-lang'>${m.original_language.toUpperCase()}</div>
                </div>
            </div>
        `);
  });

  //handle element on click
  $(".card-img").each((_, element) => {
    $(element).on("click", () => {
      sendDataToDetailTemplate(element.id,typeOfMedia);
    });
  });

  $(".card-title").each((_, element) => {
    $(element).on("click", () => {
      sendDataToDetailTemplate(element.id,typeOfMedia);
    });
  });
}

//all movie view
function allMovieView(page, sortType, genre) {
  fetch(
    `https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=${page}&sort_by=${sortType}${
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
        <div class="movie-list-item-detail">
            <div class="movie-list-item-title">${d.title}</div>
            <div class="movie-list-item-date">${d.release_date}</div>
            <div class="movie-list-item-genre">${genreList(d.genre_ids)}</div>
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
          const eId = $(e).attr("id");
          console.log(eId);
          sendDataToDetailTemplate(eId,typeOfMedia);
        });
      });

      $(".movie-list-item-title").each((_, e) => {
        $(e).on("click", () => {
          const eId = $(e).parent().parent().find("img").attr("id");
          sendDataToDetailTemplate(eId,typeOfMedia);
        });
      });

      $('.movie-list-item-info').each((_,e)=>{
        $(e).on('click',()=>{
          const eId = $(e).parent().parent().find("img").attr("id");
          sendDataToDetailTemplate(eId,typeOfMedia)
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
  movie_genre.genres.forEach((g) => {
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
      allMovieView(page, sortType, genre_id);
      $("#sort-type-btn").html($(e).html() + ' <i class="fa fa-sort find-movie-sort-btn" aria-hidden="true"></i>');
      $("#page-index").html(page);
    });
  });
  $(".genre-type").each((_, e) => {
    $(e).on("click", () => {
      if ($(e).html() == "All") {
        genre_id = null;
        page = 1;
        allMovieView(page, sortType, genre_id);
        $("#genre-filter-btn").html('Genre <i class="fa fa-caret-down" aria-hidden="true"></i>');
        $("#page-index").html(page);
      } else {
        genre_id = e.id;
        page = 1;
        allMovieView(page, sortType, genre_id);
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
          scrollLeft: $("#hero-video-list").scrollLeft() - 1296,
        },
        600
      );
    });
  });

  //pop list container btn
  $(".pop-list-container .list-btn-next").each((_, e) => {
    $(e).on("click", () => {
      $("#pop-list").animate(
        {
          scrollLeft: 1296,
        },
        600
      );
    });
  });
  $(".pop-list-container .list-btn-prev").each((_, e) => {
    $(e).on("click", () => {
      $("#pop-list").animate(
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

//handle page change
function handlePageChange() {
  const movieList = $(".dropdown");
  $("#page-pre").on("click", () => {
    if (page != 1) {
      page -= 1;
      allMovieView(page, sortType, genre_id);
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
    allMovieView(page, sortType, genre_id);
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
  fetch(`https://api.themoviedb.org/3/movie/${id}/videos?language=en-US`, options)
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


