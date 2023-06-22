var audio = new Audio();
audio.src = "../assets/generic.mp3";
const crypto = require("crypto");

audio.play();
document.getElementById("myForm").addEventListener("submit", function (event) {
  //event.preventDefault();  Empêche le comportement par défaut de l'envoi du formulaire
  var username = document.getElementById("username").value; // Récupère la valeur du champ username
  document.getElementById("password").value = crypto
    .createHash("sha256")
    .update(document.getElementById("password").value)
    .digest("hex");
});
