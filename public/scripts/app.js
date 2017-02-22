/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */


function timeAgo(timestamp) {
  let time = new Date() - timestamp; //find time difference between today and posted date.
  time = time / 1000; //convert from milliseconds to seconds.
  if (time < 60) { //if less then a minute.
    return `${Math.floor(time)} seconds`;
  }
  if (time < 60 * 60) { // if less then an hour.
    return `${Math.floor(time/60)} minutes`;
  }
  if (time < 60 * 60 * 24) { //if less then 24 hours
    return `${Math.floor(time/60/60)} hours`;
  }
  if (time < 60 * 60 * 24 * 7) { //if less then a week
    return `${Math.floor(time/60/60/24)} days`;
  }
  if (time < 60 * 60 * 24 * 30) { //if less then a month
    return `${Math.floor(time/60/60/24/7)} weeks`;
  }
  if (time < 60 * 60 * 24 * 365) { //if less then a year
    return `${Math.floor(time/60/60/24/30)} months`;
  } else { //if less then a month
    return `${Math.floor(time/60/60/24/365)} years`;
  }
}

function createTweetElement(data) {
  // console.log(data);
  return `<article class="card">
            <header class="card-header">
              <img src='${data.user.avatars.regular}' class="card-pp">
              <span class="card-user">${data.user.name} </span>
              <span class='card-handle'>${data.user.handle}</span>
            </header>
            <div class="card-content">
              <p>${data.content.text}</p>
            </div>
            <footer class="card-footer">
              ${timeAgo(data.created_at)}
            </footer>
          </article>`;
}

function renderTweets(data) {
  // Test / driver code (temporary)
  //console.log($tweet); // to see what it looks like

  var tweetsHTML = data.map(createTweetElement); //use map not for loop, less expensive.
  $('#tweet-cards').html(tweetsHTML);

}

function loadTweets() {
  $.ajax({
      url: '/tweets/',
      method: 'GET',
    })
    .done(function (data) {
      console.log("successful retreive");
      //console.log(data);
      renderTweets(data);
    });
}

// function escape(str) {
//   var div = document.createElement('div');
//   div.appendChild(document.createTextNode(str));
//   return div.innerHTML;
// }

// Test / driver code (temporary). Eventually will get this from the server.
$(document).ready(function () {
  loadTweets();
  $('.compose-btn').on('click', function () {
    var composebox = $(".new-tweet");
    composebox.slideToggle();
    composebox.find('textarea').focus();

  });
  //need to use dynamic listener!
  $('#tweet-cards').on('mouseenter', '.card',

    //hover in function
    //can only use fat arrow if I look at the event, this would return the entire document.
    function (ev) {
      // console.log("everyday im hovering");
      //console.log(this);
      $(this).find('.card-footer').append(
        `<span class="tweet-icons">
          <a href="#"><i class="material-icons">flag</i></a>
          <a href="#"><i class="material-icons">repeat</i></a>
          <a href="#"><i class="material-icons">favorite</i></a>
        </span>`);
    });
  $('#tweet-cards').on('mouseleave', '.card',
    //hover out function
    function (ev) {
      // console.log("everyday im hovering");
      // console.log(this);
      $(this).find(".tweet-icons").remove();
    }
  );
  //var $tweet = createTweetElement(tweetData);
  $("form").on("submit", function (event) {
    event.preventDefault(); //doesn;t let browser do its actions.
    console.log($(this).find('textarea').val().length);
    if (!$(this).find('textarea').val()) {
      console.log("Print me if blank");
      alert("Put something in before you tweet!");
    } else if ($(this).find('textarea').val().length > 140) {
      console.log("Too long!!");
      console.log($(this).find('textarea').val());
      alert("too long, please decrease your tweet length");
    } else {

      //ESCAPE form data!
      $(this).find('textarea').val(escape($(this).find('textarea').val()));
      let textdata = $(this).serialize();
      $.ajax({
          url: '/tweets/',
          method: 'POST',
          data: textdata

        })
        .then((data) => {
          // console.log("successful send");
          // console.log(data);
          // var newtweet = createTweetElement(data)
          // console.log(newtweet);
          // $('#tweet-cards').prepend();
          $('.new-tweet').find('textarea').val(""); // clear text box after successful post.
          loadTweets(); //rerender new tweets when finished.
        });

    }
  });
});