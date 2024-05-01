let inputText;
let page = 1;
let totalPages = 1;

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
      $("#title").html(`Search Results: ${data.total_results}`);
      searchView(data.results);
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

  //bookmark the movie / id
  $(".movie-list-item-bookmark").each((_, e) => {
    const eId = $(e).parent().parent().find("img").attr("id");
    const eType = $(e).parent().parent().attr('id')
    //get which one already saved
    $.ajax({
      type: "post",
      url: "/getSpecificID",
      data: {
        id: eId,
        type: eType,
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
      $.ajax({
        type: "post",
        url: "/saveMovieID",
        data: {
          id: eId,
          type: eType,
          csrfmiddlewaretoken: $("input[name='csrf']").val(),
        },
        success: function (response) {
          if (response.success) {
            if (response.action == "saved") {
              console.log("successful saved");
              $(e).css("color", "#ffe600");
            } else if (response.action == "deleted") {
              console.log("successful deleted");
              $(e).css("color", "white");
            } else {
              console.log("failed");
            }
          }
        },
      });
    });
  });

  //nav to detail page when element on click
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
  $('.movie-list-item-info').each((_,e)=>{
    $(e).on('click',()=>{
      const eId = $(e).parent().parent().find("img").attr("id");
      const eType = $(e).parent().parent().attr('id')
      sendDataToDetailTemplate(eId,eType)
    })
  })
}

//handle page change
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