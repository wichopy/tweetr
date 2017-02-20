//below replaces $document.ready().
$(() => {
  $("textarea").keyup(function () {
    // console.log($(".counter").innerHTML = 140 - this.value.length);
    //console.log($(".counter"));
    let counter = $(".counter");
    if ($(this).val().length > 140) {
      counter.addClass("negcount");
      counter.html(140 - this.value.length);
      if (counter.hasClass("poscount")) {
        counter.removeClass("poscount");
      }
    } else {
      counter.addClass("poscount");
      counter.html(140 - this.value.length);
      if (counter.hasClass("negcount")) {
        counter.removeClass("negcount");
      }
    }
  });
});