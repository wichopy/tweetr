$(document).ready(function () {
  //implementing this post:
  //http://stackoverflow.com/questions/28452235/make-a-nav-bar-stick-to-the-top-when-scrolling-with-css
  $(window).scroll(function () {
    //if you hard code, then use console
    //.log to determine when you want the 
    //nav bar to stick.  
    console.log($(window).scrollTop()) //logs the position at the top of the page
      // if ($(window).scrollTop() > 80) {
      //   $('#nav_bar').addClass('navbar-fixed');
      // }
      // if ($(window).scrollTop() < 81) {
      //   $('#nav_bar').removeClass('navbar-fixed');
      // }
  });
});