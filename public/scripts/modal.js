//https://www.w3schools.com/howto/tryit.asp?filename=tryhow_css_modal2

//One day try to implement https://www.freshdesignweb.com/css-login-form-templates/
// Get the modal
$(document).ready(() => {
  var modal = document.getElementById('myModal');

  // Get the button that opens the modal
  var btn = document.getElementById("login-register");

  // Get the <span> element that closes the modal
  var span = document.getElementsByClassName("close")[0];

  // When the user clicks the button, open the modal 
  btn.onclick = function () {
    console.log("open login screen");
    modal.style.display = "block";
  }

  // When the user clicks on <span> (x), close the modal
  span.onclick = function () {
    modal.style.display = "none";
  }

  // When the user clicks anywhere outside of the modal, close it
  window.onclick = function (event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  }
});