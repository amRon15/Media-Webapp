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

let url;
let type;
let page = 1;
let data;
let isNextPage = true;
let listTitle;

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
    url = localStorage.getItem('url');
    type = localStorage.getItem("type");
    isNextPage = localStorage.getItem("isNextPage");
    listTitle = localStorage.getItem("title");
    fetchData(url, type);
    // genreFilter(type)
    if (isNextPage == true) {
      handlePageChange();
    }
  });
};

//fetch data from local storage key
function fetchData(url, type) {
  fetch(url, options)
    .then((response) => response.json())
    .then((response) => {
      data = response.results;
      listView(data, type);
    })
    .catch((err) => console.error(err));
}

//return the list view
function listView(data) {
  $("#title").html(listTitle);
  data.forEach((e, i) => {
    $(".list-container").append(`
        <div class="list-item">
            <img class="list-item-img" src="https://image.tmdb.org/t/p/original${e.poster_path}" id='${e.id}' alt="">                    
            <div class="list-item-detail">
                <div class="list-item-title">${e.title != null ? e.title : e.name}</div>
                <div class="list-item-date">${e.release_date != null ? e.release_date : e.first_air_date}</div>                
                <div class='list-item-genre'>   
                ${genreList(e.genre_ids)
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
      sendDataToDetailTemplate(e.id, type);
    });
  });
}

//handle change page
function handlePageChange() {
  $("#page-pre").on("click", () => {
    let newUrl;
    if (page != 1) {
      page -= 1;
      if (page < 10) {
        newUrl = url.slice(0, url.length - 1);
      } else {
        newUrl = url.slice(0, url.length - 2);
      }
      newUrl += page;
      $(".list-container").html(" ");
      $("#page-index").html(`${page}`);
      fetchData(newUrl, type);
    }
  });
  $("#page-next").on("click", () => {
    page += 1;
    if (page < 10) {
      newUrl = url.slice(0, url.length - 1);
    } else {
      newUrl = url.slice(0, url.length - 2);
    }
    newUrl += page;
    $(".list-container").html(" ");
    $("#page-index").html(page);
    fetchData(newUrl, type);
  });
}

//return genre for filter
function genreFilter(type) {
  if (type == "movie") {
    movie_genre.genres.forEach((g) => {
      $(".dropdown-menu").append(`
            <li><p class="dropdown-item" >${g.name}</p></li>
        `);
      $(".dropdown-item").on("click", () => {});
    });
  } else {
    tv_genre.genres.forEach((g) => {
      $(".dropdown-menu").append(`
            <li><p class="dropdown-item" >${g.name}</p></li>
        `);
    });
  }
}

//return genre name list
function genreList(genres) {
  let allGenre = [];
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
  return allGenre;
}

//return genre name
function genre(genre) {
  let name = "";
  movie_genre.genres.forEach((mg) => {
    if (genre == mg.id) {
      name = mg.name;
    }
  });
  return name;
}

//navigate to detail page
function sendDataToDetailTemplate(id) {
  localStorage.setItem("keyId", id);
  localStorage.setItem("type", type);
  location.href = "detail.html";
}
