let jscript = document.createElement("script");
jscript.setAttribute("src", "https://ajax.googleapis.com/ajax/libs/jquery/3.7.1/jquery.min.js");
jscript.type = "text/javascript";
document.getElementsByTagName("head")[0].appendChild(jscript);

jscript.onload = function () {
  $(document).ready(function () {
    getUser();
    search();
  });
};

//key for api
const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization:
      "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxYjMxZTZkYjM3NTdkMTI3YWU0NjE2ODMyYzkwMjc2MCIsInN1YiI6IjYyOGM4MmViZWQyYWMyNTQ2OTllODkwMyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.OMw-6etv7U0d0qIkPC_30V2RPWo9s_9lelEwFbF-l7c",
  },
};

//genre of movie & tv
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
const movie_genre = {
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


//get current login user
function getUser() {
  const user = $("input[name='user']").val();
  if (user != "") {
    $("#header-login").css("display", "none");
    $("#nav-item-login").css("display", "none");
    $("#nav-item-user-container").css("display", "flex");
    $("#header-user").css("display", "inline-block");
    $("#header-bookmark").css("display", "inline-block");
  }
}

//search function, nav to search.html
function search() {
  $("input[name='search']").keypress(function (e) {
    if (e.which === 13) {
      e.preventDefault();
      const inputText = $("#searchInput").val();   
      const inputText2 = $('#navSearchInput').val()
      navToSearchPage(inputText || inputText2);
    }
  });

  $('#nav-search-btn').on('click',()=>{
    const inputText = $("#navSearchInput").val();      
      navToSearchPage(inputText);
  })

}

//nav to search page
function navToSearchPage(inputText) {
  localStorage.setItem("inputText", inputText);
  location.href = "search.html";
}

//navigate to detail page
function sendDataToDetailTemplate(id,type){      
  localStorage.setItem('keyId',id)      
  localStorage.setItem('type',type)    
  location.href = 'detail.html'    
}


//return genre array 
function genreList(genres) {
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

//return a genre string
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

//round the rate in 2 decimal places
function roundRate(rate) {
  return Math.round(rate * 10) / 10;
}

//check year == current year
function checkYear(data) {
  let thisYearData = [];
  let cuurentYear = new Date().getFullYear();
  data.forEach((movie) => {
    let date = new Date(movie.release_date);
    if (date.getFullYear() == cuurentYear) {
      thisYearData.push(movie);
    }
  });
  return thisYearData;
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