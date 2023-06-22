/*const socket = io();
const userid = document.cookie.split(";").find((cookie) => cookie.trim().startsWith("token=")).split("=")[1];
console.log(document.cookie);
socket.on("connect", () => {
  socket.emit("enter_room", "general");
});

window.onload = () => {
  document.querySelector("#form").addEventListener("submit", (e) => {
    e.preventDefault();
    socket.emit("user_connected", { name: userid });
    const message = document.querySelector("#message");
    const room = document.querySelector("#choice p.active").dataset.room;
    const rooms = document.querySelector("#tabs li.active").dataset.room;
    const createdAt = new Date();

    socket.emit("chat_message", {
      id: userid,
      message: message.value,
      room: rooms,
      createdAt: createdAt,
    });
    document.querySelector("#message").value = "";
  });

  socket.on("received_message", (msg) => {
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
  nameSpan.textContent = msg.name;

  let dateSpan = document.createElement("small");
  dateSpan.style.display = "inline-block";
  dateSpan.style.marginLeft = "10px";
  let created = new Date(msg.createdAt);
  dateSpan.textContent =
    created.toLocaleDateString() + " " + created.toLocaleTimeString();

  let messageParagraph = document.createElement("p");
  messageParagraph.textContent = msg.message;

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

*/

function display() {
  msg = document.querySelector("#messages");
  box = document.createElement("div");
  box.classList.add("box");
  msg.appendChild(box);
  dislike = document.createElement("ion-icon");
  dislike.id = "dislike";
  dislike.name = "heart-dislike";
  box.appendChild(dislike);
  swiper = document.createElement("div");
  swiper.id = "swiper";
  box.appendChild(swiper);
  like = document.createElement("ion-icon");
  like.id = "like";
  like.name = "heart";
  box.appendChild(like);
}

display();

// <ion-icon id="dislike" name="heart-dislike"></ion-icon>
// <div id="swiper"></div>
// <ion-icon id="like" name="heart"></ion-icon>

// <script src="./card.js"></script>
// <script src="./script.js"></script>
