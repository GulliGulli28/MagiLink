const socket = io();
window.onload = async () => {    
    const cities = document.querySelector("#ville");
    const ville_input = document.querySelector("#ville_input");
    var cities_tab = [] ;
    socket.emit("get_cities","");
    
    
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

            cities.appendChild(el);
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
};

    