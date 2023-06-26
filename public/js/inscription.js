const { crypto } = require("crypto");

function verifierEmail(email) {
  var regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

window.onload = () => {
  clear_error();
};

document.getElementById("myForm").addEventListener("submit", function (event) {
  clear_error();
  const mail = document.getElementById("mail").value;
  const checkmail = verifierEmail(mail);

  if (!checkmail) {
    console.log("invalide");
    event.preventDefault();
    display_error(0);
  } else {
    const password = document.getElementById("password").value;
    const confirm_password = document.getElementById("confirm-password").value;
    if (password == "") {
      console.log("password must be set");
      display_error(1);
      event.preventDefault();
    } else {
      if (confirm_password == "") {
        console.log("password must be confirmed");
        display_error(2);
        event.preventDefault();
      } else {
        if (password != confirm_password) {
          console.log("Pas le même password");
          display_error(3);
          event.preventDefault();
        } else {
          if (password.length < 12) {
            console.log("Password must be at least 12 caracteres long");
            display_error(4);
            event.preventDefault();
          } else {
            document.getElementById("password").value = crypto
              .createHash("sha256")
              .update(document.getElementById("password").value)
              .digest("hex");
          }
        }
      }
    }
  }
});

function display_error(error) {
  console.log(error);
  msg_error = document.getElementById("msg_error");
  if (msg_error) {
    console.log("ici");
    return;
  } else {
    console.log("msg_error not found");

    container = document.querySelector(".form-container");

    div_error = document.createElement("div");
    div_error.classList.add("input-group");

    container.appendChild(div_error);

    msg_error = document.createElement("p");
    msg_error.id = "msg_error";

    switch (error) {
      case 0:
        msg_error.innerHTML = "Email invalide";
        break;
      case 1:
        msg_error.innerHTML = "Password must be set";
        break;
      case 2:
        msg_error.innerHTML = "Password must be confirmed";
        break;
      case 3:
        msg_error.innerHTML = "Pas le même password";
        break;
      case 4:
        msg_error.innerHTML = "Password must be at least 12 caracteres long";
        break;
    }
    msg_error.style.color = "red";
    div_error.appendChild(msg_error);
  }
}

function clear_error() {
  a = document.getElementById("msg_error");
  if (a) {
    a.remove();
    container = document.querySelector(".form-container");

    container.removeChild(container.lastChild);
  }

  const inputFields = document.querySelectorAll("input");
  inputFields.forEach((input) => {
    input.value = "";
  });
}
