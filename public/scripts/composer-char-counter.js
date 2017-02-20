$(() => {
  $("textarea").keypress(function () {
    // console.log($(".counter").innerHTML = 140 - this.value.length);
    //console.log($(".counter"));
    $(".counter").html(140 - this.value.length);
  });
});