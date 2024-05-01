let url;
let type;
let page = 1;
let data;
let isNextPage = true;
let listTitle;

window.onload = function () {
  $(document).ready(function () {
    url = localStorage.getItem("url");
    type = localStorage.getItem("type");
    isNextPage = localStorage.getItem("isNextPage");
    listTitle = localStorage.getItem("title");
    fetchData(url, type);
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

  //nav to detail page when element on click
  $(".list-item-title").each((_, e) => {
    $(e).on("click", () => {
      let eId = $(e).parent().parent().find("img").attr("id");
      sendDataToDetailTemplate(eId, type);
    });
  });

  $(".list-item-img").each((_, e) => {
    $(e).on("click", () => {
      sendDataToDetailTemplate(e.id, type);
    });
  });

  $('.movie-list-item-info').each((_,e)=>{
    $(e).on('click',()=>{
      const eId = $(e).parent().parent().find("img").attr("id");
      sendDataToDetailTemplate(eId,type)
    })
  })

  //bookmark the movie / id
  $(".movie-list-item-bookmark").each((_, e) => {
    const eId = $(e).parent().parent().find("img").attr("id");

    //get which one already saved
    $.ajax({
      type: "post",
      url: "/getSpecificID",
      data: {
        id: eId,
        type: type,
        csrfmiddlewaretoken: $("input[name='csrf']").val(),
      },
      success: function (response) {
        if (response.saved) {
          console.log("saved already");
          $(e).css("color", "#ffe600");
        } else {
          console.log("not save yet");
          $(e).css('color', 'white')
        }
      },
    });

    //save or delete the bookmark
    $(e).on("click", () => {
      $.ajax({
        type: "post",
        url: "/saveMovieID",
        data: {
          id: eId,
          type: type,
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
}

//handle page change
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
