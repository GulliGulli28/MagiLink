const socket = io();

const cities = document.querySelectorAll("#ville");

cities.InnerHTML = `<option value="">Choisir une ville</option>`;

window.onload = () => {
    socket.emit("get_cities");
};

socket.on("city_list", (msg) => {
    console.log(msg);
    const cities = JSON.parse(msg.cities);
    cities.forEach((element) => {
        cities.InnerHTML += `<option value="${element.id}">${element.ville_nom_reel}</option>`;
    });
});
