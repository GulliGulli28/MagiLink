const socket = io();
window.onload = async () => {
  const cities = document.querySelector("#ville");
  const ville_input = document.querySelector("#ville_input");
  var cities_tab = [];
  socket.emit("get_cities", "");

  function findKeysStartingWith(obj, prefix) {
    let keys = [];

    obj.forEach((element) => {
      if (element[1].startsWith(prefix)) {
        keys.push(element);
      }
    });
    return keys;
  }
  socket.on("city_list", (msg) => {
    cities_tab = msg.cities;
    msg.cities.forEach((element) => {
      //console.log(element);
      var el = document.createElement("option");
      el.textContent = element[1];
      el.value = element[0];
    });
  });
};

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
