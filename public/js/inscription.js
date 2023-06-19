function verifierEmail(email) {
  var regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

document.getElementById("myForm").addEventListener("submit", function (event) {
  const mail = document.getElementById("mail").value;
  const checkmail = verifierEmail(mail);
  console.log(checkmail);

  if (!checkmail) {
    console.log("invalide");
    event.preventDefault();
  } else {
    const password = document.getElementById("password").value;
    const confirm_password = document.getElementById("confirm-password").value;
    console.log(password.length);
    if (password == "") {
      console.log("password must be set");
      event.preventDefault();
    } else {
      if (confirm_password == "") {
        console.log("password must be confirmed");
        event.preventDefault();
      } else {
        if (password != confirm_password) {
          console.log("Pas le même password");
          event.preventDefault();
        } else {
          if (password.length < 12) {
            console.log("Password must be at least 12 caracteres long");
            event.preventDefault();
          }
        }
      }
    }
  }
});
