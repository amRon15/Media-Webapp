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
    loadUserBookmark()
  });
};

function loadUserBookmark(){  
  $.ajax({
    type: "get",
    url: "/getUserMovieID",
    success: function (response) {
      const bookmarks = response
      const randomNum = Math.floor(Math.random()*bookmarks.length)
      const randomItem = bookmarks[randomNum]
      recommendData(randomItem)
    },
    error: function(e){
      $('.recommend-list-container').css('display','none')      
    }
  });
}

function recommendData(data){
  fetch(`https://api.themoviedb.org/3/${data.type}/${data.id}/recommendations?language=en-US&page=1`, options)
  .then(response => response.json())
  .then(response => {
    const recommend = response.results
    recommend.forEach((m) => {
      $('.recommend-list').append(`
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
  })
  .catch(err => console.error(err));
}

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
              <h4>${d.title != null ? d.title : d.name}</h5>
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
                    <div class='card-body-genre'>Genre: ${genreList(known_for[0].genre_ids).map((g,i)=>{
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


//nav to more
function navToMorePage(url, type, title) {
  localStorage.setItem("url", url);
  localStorage.setItem("type", type);
  localStorage.setItem("title", title);
  location.href = "more.html";
}