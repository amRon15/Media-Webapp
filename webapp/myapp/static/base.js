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

function search() {
  $("input[name='search']").keypress(function (e) {
    if (e.which === 13) {
      e.preventDefault();
      const inputText = $("#searchInput").val();      
      navToSearchPage(inputText);
    }
  });

  $('#nav-search-btn').on('click',()=>{
    const inputText = $("#searchInput").val();      
      navToSearchPage(inputText);
  })

}

//nav to search page
function navToSearchPage(inputText) {
  localStorage.setItem("inputText", inputText);
  location.href = "search.html";
}
