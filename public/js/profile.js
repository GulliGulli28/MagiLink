const socket = io();

const cities = document.querySelectorAll("#ville");

cities.InnerHTML = `<option value="">Choisir une ville</option>`;

window.onload = () => {
  socket.emit("get_cities");
  clear_data();

  container = document.querySelector(".form-container");

  container.addEventListener("submit", (e) => {
    let date = document.getElementById("birthdate").value;
    let date_array = date.split("/");
    let date_now = new Date();
    if (date_array[2] < 1900 || date_array[2] > date_now.getFullYear()) {
      e.preventDefault();
      clear_data();
      console.log("date invalide");
      let check = document.getElementById("msg_error");
      if (!check) {
        div_error = document.createElement("div");
        div_error.classList.add("input-group");

        container.appendChild(div_error);

        msg_error = document.createElement("p");
        msg_error.id = "msg_error";
        msg_error.innerHTML = "Date invalide";
        div_error.appendChild(msg_error);
        msg_error.style.color = "red";
      } else {
        return;
      }
    }
  });
};

socket.on("city_list", (msg) => {
  console.log(msg);
  const cities = JSON.parse(msg.cities);
  cities.forEach((element) => {
    cities.InnerHTML += `<option value="${element.id}">${element.ville_nom_reel}</option>`;
  });
});

function clear_data() {
  const inputFields = document.querySelectorAll("input");
  inputFields.forEach((input) => {
    input.value = "";
  });
}
