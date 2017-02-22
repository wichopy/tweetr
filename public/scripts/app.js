/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */
var tweetData = {
  "user": {
    "name": "Newton",
    "avatars": {
      "small": "https://vanillicon.com/788e533873e80d2002fa14e1412b4188_50.png",
      "regular": "https://vanillicon.com/788e533873e80d2002fa14e1412b4188.png",
      "large": "https://vanillicon.com/788e533873e80d2002fa14e1412b4188_200.png"
    },
    "handle": "@SirIsaac"
  },
  "content": {
    "text": "If I have seen further it is by standing on the shoulders of giants"
  },
  "created_at": 1461116232227
};

var data = [{
    "user": {
      "name": "Newton",
      "avatars": {
        "small": "https://vanillicon.com/788e533873e80d2002fa14e1412b4188_50.png",
        "regular": "https://vanillicon.com/788e533873e80d2002fa14e1412b4188.png",
        "large": "https://vanillicon.com/788e533873e80d2002fa14e1412b4188_200.png"
      },
      "handle": "@SirIsaac"
    },
    "content": {
      "text": "If I have seen further it is by standing on the shoulders of giants"
    },
    "created_at": 1487706307431
  },
  {
    "user": {
      "name": "Descartes",
      "avatars": {
        "small": "https://vanillicon.com/7b89b0d8280b93e2ba68841436c0bebc_50.png",
        "regular": "https://vanillicon.com/7b89b0d8280b93e2ba68841436c0bebc.png",
        "large": "https://vanillicon.com/7b89b0d8280b93e2ba68841436c0bebc_200.png"
      },
      "handle": "@rd"
    },
    "content": {
      "text": "Je pense , donc je suis"
    },
    "created_at": 1461113959088
  },
  {
    "user": {
      "name": "Johann von Goethe",
      "avatars": {
        "small": "https://vanillicon.com/d55cf8e18b47d4baaf60c006a0de39e1_50.png",
        "regular": "https://vanillicon.com/d55cf8e18b47d4baaf60c006a0de39e1.png",
        "large": "https://vanillicon.com/d55cf8e18b47d4baaf60c006a0de39e1_200.png"
      },
      "handle": "@johann49"
    },
    "content": {
      "text": "Es ist nichts schrecklicher als eine tätige Unwissenheit."
    },
    "created_at": 31113796368
  }
];


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

function escape(str) {
  var div = document.createElement('div');
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
}

// Test / driver code (temporary). Eventually will get this from the server.
$(document).ready(function () {
  loadTweets();
  $('.compose-btn').on('click', function () {
    console.log("OPen and Close compose.");
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
    // console.log($(this));
    // if (!$(this).val()) {
    //   console.log("error blank textarea.");
    //   throw new Error("blank page!");
    //   window.alert("blank box!");
    // }
    //console.log($('.new-tweet textarea').val());

    // console.log($(this[0].value));
    // console.log($(this).serialize());
    // console.log($(this));
    // console.log(escape("<script>"));
    //console.log($(this).find('textarea').val());
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


  });
});