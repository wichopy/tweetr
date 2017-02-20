$(() => {
  $("textarea").keypress(function () {
    // console.log($(".counter").innerHTML = 140 - this.value.length);
    //console.log($(".counter"));
    let counter = $(".counter");
    console.log($(this).val());
    if ($(this).val().length > 140) {
      counter.html(140 - this.value.length);
      counter.css("color", "red");
    } else {
      counter.html(140 - this.value.length);
      counter.css("color", "black");
    }
  });
});