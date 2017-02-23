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
  var tweetsHTML = data.map(createTweetElement); //use map not for loop, less expensive.
  $('#tweet-cards').html(tweetsHTML);
  //Some fun tweets for testing.
  // $('#tweet-cards').prepend(`
  //           <article class="card">
  //               <header class="card-header">
  //                   <img src='/images/musk.jpg' class="card-pp">
  //                   <span class="card-user">Elon Musk </span>
  //                   <span class='card-handle'>@elonmusk.</span>
  //               </header>
  //               <div class="card-content">
  //                   <p>The future of humanity is going to bifurcate in two directions: Either it's going to become multiplanetary, or it's going to remain confined to one planet and eventually there's going to be an extinction event.</p>
  //               </div>
  //               <footer class="card-footer">
  //                   5 hours ago
  //               </footer>
  //           </article>
  //           <article class="card">
  //               <header class="card-header">
  //                   <img src='/images/stephc.jpg' class="card-pp">
  //                   <span class="card-user">Steph Curry </span>
  //                   <span class='card-handle'>@scurry.</span>
  //               </header>
  //               <div class="card-content">
  //                   <p>Three pointers.</p>
  //               </div>
  //               <footer class="card-footer">
  //                   5 days ago
  //               </footer>`);
}

function loadTweets() {
  $.ajax({
      url: '/tweets/',
      method: 'GET',
    })
    .done(function (data) {
      renderTweets(data);
    });
}

function escape(str) {
  var div = document.createElement('div');
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
}

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
    //tried to use fat arrow but functionality was horrible, icons would not disappear sometimes 
    //and other times they wouldnt appear at all.
    function () {
      $(this).find('.card-footer').append(
        `<span class="tweet-icons">
          <a href="#"><i class="material-icons">flag</i></a>
          <a href="#"><i class="material-icons">repeat</i></a>
          <a href="#"><i class="material-icons">favorite</i></a>
        </span>`);
    });
  $('#tweet-cards').on('mouseleave', '.card',
    //hover out function
    function () {
      $(this).find(".tweet-icons").remove();
    }
  );
  //var $tweet = createTweetElement(tweetData);
  $(".new-tweet").on("submit", function (event) {
    event.preventDefault(); //doesn;t let browser do its actions.
    if (!$(this).find('textarea').val()) {
      alert("Put something in before you tweet!");
    } else if ($(this).find('textarea').val().length > 140) {
      alert("too long, please decrease your tweet length");
    } else {
      //ESCAPE form data!
      $(this).find('textarea').val(escape($(this).find('textarea').val()));
      let textdata = $(this).find('form').serialize(); //serialize form data! Be careful!
      $.ajax({
          url: '/tweets/',
          method: 'POST',
          data: textdata
        })
        .then((data) => {
          var composebox = $('.new-tweet')
          composebox.find('textarea').val(""); // clear text box after successful post.
          composebox.find(".counter").html("140");
          loadTweets(); //rerender new tweets when finished.
        });
    }
  });
  $(".login-body").on("submit", function (ev) {
    ev.preventDefault();
    let email = $(this).find("input#email").val();
    let password = $(this).find("input#password").val();
    // console.log($(this).find('input#email').val());
    if (!email || !password) {
      alert("no username entered or password!");
    } else {
      var formdata = $(this).find('form').serialize();
      $.ajax({
          url: "/users/",
          method: "POST",
          data: formdata
        })
        .then((data) => {
          console.log(`Successful post! this is your response! ${data}`);
        });
    }
  });
});