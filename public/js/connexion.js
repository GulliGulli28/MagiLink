var audio = new Audio();
audio.src = "../assets/generic.mp3";

audio.play();

document.getElementById("myForm").addEventListener("submit", function(event) {
    event.preventDefault(); // Empêche le comportement par défaut de l'envoi du formulaire
  
    var username = document.getElementById("username").value; // Récupère la valeur du champ username
    setCookie("monCookie", username, 7); // Crée le cookie avec la valeur du champ username pour une durée de 7 jours
  });
  
  function setCookie(name, value, days) {
    var expires = "";
    if (days) {
      var date = new Date();
      date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
      expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + value + expires + "; path=/";
  }
