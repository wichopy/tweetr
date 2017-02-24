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

function createTweetElement(data, likes) {
  // console.log(data);
  return `<article class="card" data-likes="${likes}">
            <header class="card-header">
              <img src='${data.user.avatar}' class="card-pp">
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


function renderTweets(tweetData, likes) {
  var tweetsHTML = tweetData.map((tweet) => {
    var likes = likes.filter((like) => {
      return like._id === tweet.find()
    });
    createTweetElement(tweetData, likes)
  }); //use map not for loop, less expensive.
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
    method: 'GET'
  }).done((tweetData) => {
    $.ajax({
      url: "/likes/",
      method: "GET"
    }).done((likes) => {
      // console.log(data);
      renderTweets(tweetData.tweets, likes);
      if (tweetData.cookie) {
        $("#login-register").hide();
        $(".new-tweet").show(2000);
        $('#logout').show();
      } else {
        $(".compose-btn").hide()
        $(".new-tweet").hide();
        $("#logout").hide();
      }
    });
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
          10<a href="#"><i class="material-icons">favorite</i></a>
        </span>`);
    });
  $('#tweet-cards').on('mouseleave', '.card',
    //hover out function
    function () {
      $(this).find(".tweet-icons").remove();
    }
  );
  $("#logout").on('reset', function (event) {
    event.preventDefault;
    console.log("logging out");
    $.ajax({
        url: "/users/",
        method: 'POST',
        data: { '_method': 'DELETE' }
      })
      .done(() => {
        console.log("logout successful");
        $("#login-register").show(2000);
        $(".compose-btn").hide(2000);
        $(".new-tweet").hide(2000);
        $('#logout').hide(2000);
      });
  });
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
  $("form").on('submit', function (ev) {
    //console.log(ev);
    ev.preventDefault();
    // console.log(ev.target);
    console.log(ev.target.id);
    let inputs = ev.target.getElementsByTagName('input');
    console.log(inputs);
    // console.log(inputs.password.value);
    // console.log(ev.target.getElementsByTagName('input'));
    //console.log("Les register");
    //console.log($(this).find("input#reg_email"));
    //console.log($(this).find("input#reg_password"));
    if (ev.target.id === 'register') {
      $.ajax({
        url: "/users/",
        method: "POST",
        data: {
          _method: "PUT",
          // email: $(this).find("input#reg_email"),
          // password: $(this).find("input#reg_password")
          handle: inputs.handle.value,
          name: inputs.name.value,
          email: inputs.email.value,
          password: inputs.password.value
        }
      }).done(() => {
        console.log("done registering!");
        document.getElementById('myModal').style.display = "none";
        $("#login-register").hide(2000);
        $(".compose-btn").show(2000);
        $(".new-tweet").show(2000);
        $("#logout").show(2000);
      });
    }
    if (ev.target.id === 'login') {
      $.ajax({
        url: "/users/",
        method: "POST",
        data: {
          email: inputs.email.value,
          password: inputs.password.value
        }
      }).done((data) => {
        console.log("data from response:");
        console.log(data)
        document.getElementById('myModal').style.display = "none";
        if (data.cookie) {
          $("#login-register").hide(2000);
          $(".compose-btn").show(2000);
          $(".new-tweet").show(2000);
          $("#logout").show(2000);
        }
      });
    }
  });
});