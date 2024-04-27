let jscript = document.createElement("script");
jscript.setAttribute("src", "https://ajax.googleapis.com/ajax/libs/jquery/3.7.1/jquery.min.js");
jscript.type = "text/javascript";
document.getElementsByTagName("head")[0].appendChild(jscript);

jscript.onload = function () {
  $(document).ready(function () {
    search();
  });
};

function search() {
  $("form").on("submit", (e) => {
    const inputText = $("#searchInput").val();
    navToSearchPage(inputText);
    e.preventDefault();
  });
}

//nav to search page
function navToSearchPage(inputText) {
  localStorage.setItem("inputText", inputText);
  location.href = "search.html";
}
