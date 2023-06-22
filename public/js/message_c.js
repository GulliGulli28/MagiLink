const socket = io();
const userid = document.cookie.split(";").find((cookie) => cookie.trim().startsWith("token=")).split("=")[1];
console.log(document.cookie);

window.onload = () => {
  socket.emit("user_connected", { name: userid });
  document.querySelector("#form").addEventListener("submit", (e) => {
    e.preventDefault();
    const message = document.querySelector("#message"); //input enter message
    const room = document.querySelector("#choice p.active").dataset.room; // salon actif (active)
    const rooms = document.querySelector("#tabs li.active").dataset.room; // liste des salons <- injecter channels
    const createdAt = new Date();

    socket.emit("chat_message", {
      user_id: userid,
      content: message.value,
      room: {room : room , rooms:rooms},
      date: createdAt,
    });
    document.querySelector("#message").value = "";
  });

  socket.on("received_message", (msg) => {
    console.log(msg);
    publishMessage(msg);
    var messagesDiv = document.querySelector("#messages");
    var lastMessage = messagesDiv.lastElementChild;
    lastMessage.scrollIntoView();
  });

  socket.on("init_messages", (msg) => {
    let data = JSON.parse(msg.messages);
    if (data != []) {
      data.forEach((element) => {
        publishMessage(element);
        var messagesDiv = document.querySelector("#messages");
        var lastMessage = messagesDiv.lastElementChild;
        lastMessage.scrollIntoView();
      });
    }
  });

  socket.on("swipe-data", (msg) => {
    console.log("coucou");
    clear_messages();
  });

  socket.on("init_channels", (msg) => {
    console.log("init_channels",msg);
    let channels = msg.channels;
    channels.forEach((channel) => {
      let li = document.createElement("li");
      li.dataset.room = channel.id;
      li.textContent = channel.name;
      li.addEventListener("click", function () {
        if (!this.classList.contains("active")) {
          const actif = document.querySelector("#tabs li.active");
          actif.classList.remove("active");
          this.classList.add("active");
          document.querySelector("#messages").innerHTML = "";
          socket.emit("leave_room", actif.dataset.room);
          socket.emit("enter_room", this.dataset.room);
        }
      });
      document.querySelector("#tabs").appendChild(li);
    });
  });
  
};

document.querySelectorAll("#choice p").forEach((tab) => {
  tab.addEventListener("click", function () {
    if (!this.classList.contains("active")) {
      let actif = document.querySelector("#choice p.active");
      actif.classList.remove("active");
      this.classList.add("active");
      if (this.dataset.room == "swipe") {
        document.querySelector("#message").style.display = "none";
        console.log("swipe");
        socket.emit("enter-swipe", userid);
      }
      else{
        document.querySelector("#message").style.display = "block";
        let a = document.querySelector("#tabs li.active").dataset.room;
        console.log(a);
        socket.emit("enter_room", a);
      }
    }
  });
});


document.querySelectorAll("#tabs li").forEach((tab) => {
  tab.addEventListener("click", function () {
    if (!this.classList.contains("active")) {
      const actif = document.querySelector("#tabs li.active");
      actif.classList.remove("active");
      this.classList.add("active");
      document.querySelector("#messages").innerHTML = "";
      socket.emit("leave_room", actif.dataset.room);
      socket.emit("enter_room", this.dataset.room);
    }
  });
});

function publishMessage(msg) {
  let divElement = document.createElement("div");

  let nameDateContainer = document.createElement("p");

  let nameSpan = document.createElement("span");
  nameSpan.style.display = "inline-block";
  if (msg.user_id == userid) {
    nameSpan.textContent = "Moi";
    nameSpan.style.textAlign = "right";
  }
  else {
    nameSpan.textContent = msg.autre.moi ;
    nameSpan.style.textAlign = "left";
  }
  let dateSpan = document.createElement("small");
  dateSpan.style.display = "inline-block";
  dateSpan.style.marginLeft = "10px";
  let created = new Date(msg.date);
  dateSpan.textContent =
    created.toLocaleDateString() + " " + created.toLocaleTimeString();

  let messageParagraph = document.createElement("p");
  messageParagraph.textContent = msg.content;

  let pictureSpan = document.createElement("span");
  pictureSpan.style.display = "inline-block";
  let picture = document.createElement("img");
  picture.src = "../assets/profile.png";
  picture.classList.add("profile");
  pictureSpan.appendChild(picture);

  nameDateContainer.appendChild(pictureSpan);
  nameDateContainer.appendChild(nameSpan);
  nameDateContainer.appendChild(dateSpan);

  divElement.appendChild(nameDateContainer);
  divElement.appendChild(messageParagraph);

  document.querySelector("#messages").appendChild(divElement);
}

function clear_messages() {
  document.querySelector("#messages").innerHTML = "";
}