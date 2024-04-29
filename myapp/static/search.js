let inputText;
let page = 1;
let totalPages = 1;
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


window.onload = function () {
  $(document).ready(function () {
    inputText = localStorage.getItem("inputText");
    searchData(inputText);
  });
};

//get search data
function searchData(text) {
  fetch(`https://api.themoviedb.org/3/search/multi?query=${text}&include_adult=false&language=en-US&page=${page}`, options)
    .then((response) => response.json())
    .then((response) => {
      const data = response;
      totalPages = data.total_pages;
      searchView(data.results);
      $("#title").html(`Search Results: ${data.total_results}`);
      handlePageChange();
    })
    .catch((err) => console.error(err));
}

//search list view
function searchView(data) {
  data.forEach((e, i) => {
    $(".list-container").append(`
        <div class="list-item" id=${e.media_type}>
            <img class="list-item-img" src="https://image.tmdb.org/t/p/original${e.poster_path}" id='${e.id}' alt="">                    
            <div class="list-item-detail">
                <div class="list-item-title">${e.title != null ? e.title : e.name}</div>
                <div class="list-item-date">${e.release_date != null ? e.release_date : e.first_air_date}</div>                
                <div class='list-item-genre'>   
                ${genreList(e.genre_ids, e.media_type)
                  .map((g, i) => {
                    if (i < e.genre_ids.length - 1) {
                      return `${g} <span style="margin: 0 1rem; color: #00719c;"> | </span>`;
                    } else {
                      return g;
                    }
                  })
                  .join("")}                 
                </div>
                <div class="list-item-rate">
                    <i class="fa fa-star" aria-hidden="true"></i>
                    ${Math.round(e.vote_average * 10) / 10}
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
  $(".list-item-img").each((_, e) => {
    $(e).on("click", () => {
      let type = $(e).parent().attr("id");
      sendDataToDetailTemplate(e.id, type);
    });
  });
  $(".list-item-title").each((_, e) => {
    $(e).on("click", () => {
      let type = $(e).parent().parent().attr("id");
      let eId = $(e).parent().parent().find("img").attr("id");
      sendDataToDetailTemplate(eId, type);
    });
  });
}

//handle change page
function handlePageChange() {
  $("#page-pre").on("click", () => {
    if (page != 1) {
      page -= 1;
      $(".list-container").html(" ");
      $("#page-index").html(`${page}`);
      searchData(inputText);
    }
  });
  $("#page-next").on("click", () => {
    if (page < totalPages) {
      page += 1;
      $(".list-container").html(" ");
      $("#page-index").html(page);
      searchData(inputText);
    }
  });
}

//return genre name list
function genreList(genres, type) {
  let allGenre = [];
  if (genres != null) {
    genres.forEach((g) => {
      if (type == "movie") {
        movie_genre.genres.forEach((mg) => {
          if (g == mg.id) {
            allGenre.push(mg.name);
          }
        });
      } else {
        tv_genre.genres.forEach((tg) => {
          if (g == tg.id) {
            allGenre.push(tg.name);
          }
        });
      }
    });
  }
  return allGenre;
}

//navigate to detail page
function sendDataToDetailTemplate(id, type) {
  localStorage.setItem("keyId", id);
  localStorage.setItem("type", type);
  location.href = "detail.html";
}
