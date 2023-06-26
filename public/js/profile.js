const socket = io();
window.onload = async () => {
  clear_data();
  const cities = document.querySelector("#ville");
  const ville_input = document.querySelector("#ville_input");
  var cities_tab = [];
  socket.emit("get_cities", "");
  cities.InnerHTML = `<option value="">Choisir une ville</option>`;
  
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
      var el = document.createElement("option");
      el.textContent = element[1];
      el.value = element[0];
    });
  });
  ville_input.addEventListener("keyup", (e) => {
    let val = e.target.value;
    cities.innerHTML = "";
    let keys = findKeysStartingWith(cities_tab, val);
    //remove childs from cities
    var ele = null;
    keys.forEach((key) => {
        ele = document.createElement("option");
        ele.textContent = key[1];
        ele.value = key[0];
        cities.appendChild(ele);
    });
  });
  socket.on("city_list", (msg) => {
    cities_tab = msg.cities;
    msg.cities.forEach((element) => {
        var el = document.createElement("option");
        el.textContent = element[1];
        el.value = element[0];
  
        cities.appendChild(el);
    });
  });
 
  container = document.querySelector(".form-container");

  container.addEventListener("submit", (e) => {
    let date = document.getElementById("birthdate").value;
    let date_array = date.split("/");
    let date_now = new Date();
    if (date_array[2] < 1900 || date_array[2] > date_now.getFullYear()) {
      e.preventDefault();
      console.log("date invalide");s
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

function clear_data() {
  const inputFields = document.querySelectorAll("input");
  inputFields.forEach((input) => {
    input.value = "";
  });
}

