function verifierEmail(email) {
  var regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

document.getElementById("myForm").addEventListener("submit", function (event) {
  event.preventDefault(); // Empêche le comportement par défaut de l'envoi du formulaire
  const mail = document.getElementById("mail").value;
  const checkmail = verifierEmail(mail);
  console.log(checkmail);

  if (!checkmail) {
    console.log("invalide");
  } else {
    const password = document.getElementById("password").value;
    const confirm_password = document.getElementById("confirm-password").value;
    if (password == "") {
      console.log("password must be set");
    } else {
      if (confirm_password == "") {
        console.log("password must be confirmed");
      } else {
        if (password != confirm_password) {
          console.log("Pas le même password");
        }
      }
    }
  }
});
