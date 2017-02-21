$(document).ready(function () {
  //implementing this post:
  $(".card")
    .hover(
      //hover in function
      //can only use fat arrow if I look at the event, this would return the entire document.
      function () {
        //console.log(this);
        $(this).find('.card-footer').append(
          `<span class="tweet-icons">
          <a href="#"><i class="material-icons">flag</i></a>
          <a href="#"><i class="material-icons">repeat</i></a>
          <a href="#"><i class="material-icons">favorite</i></a>
          </span>`
        );
      },
      //hover out function
      function () {
        // console.log(this);
        $(this).find(".tweet-icons").remove();
      }
    );
});