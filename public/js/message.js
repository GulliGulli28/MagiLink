const socket = io();
const userid = document.cookie
  .split(";")
  .find((cookie) => cookie.trim().startsWith("token="))
  .split("=")[1];
let cardCount = 0;
var data = [];

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
      room: { room: room, rooms: rooms },
      date: createdAt,
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
    data = msg;
    msg.forEach((element) => {
      import_card(element);
    });
  });
  socket.on("init_channels", (msg) => {
    let channels = msg.channels;
    channels.forEach((channel) => {
      let li = document.createElement("li");
      li.dataset.room = channel.id;
      li.textContent = channel.name;
      li.addEventListener("click", function () {
        if (!this.classList.contains("active")) {
          const actif = document.querySelector("#tabs li.active");
          if (!actif) {
            this.classList.add("active");
            document.querySelector("#messages").innerHTML = "";
            socket.emit("enter_room", this.dataset.room);
          } else {
            actif.classList.remove("active");
            this.classList.add("active");
            document.querySelector("#messages").innerHTML = "";
            socket.emit("leave_room", actif.dataset.room);
            socket.emit("enter_room", this.dataset.room);
          }
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
        document.querySelector("#messages").innerHTML = "";
        document.querySelector("#message").style.display = "none";
        document.querySelector("#writting").style.display = "none";
        document.querySelector("#tabs").innerHTML = "";
        socket.emit("enter-swipe", { idp: userid });
        showcard();
      }
      else{
        document.querySelector("#messages").innerHTML = "";
        document.querySelector("#message").style.display = "block";
        document.querySelector("#writting").style.display = "block";
        document.querySelector("#tabs").style.display = "block";
        document.querySelector("#tabs").innerHTML = "";
        socket.emit("user_connected", { name: userid });
      }
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
  } else {
    nameSpan.textContent = msg.autre.moi;
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

function showcard() {
  let msg = document.querySelector("#messages");
  let box = document.createElement("div");
  box.classList.add("box");
  msg.appendChild(box);
  let dislike = document.createElement("ion-icon");
  dislike.id = "dislike";
  dislike.setAttribute("name", "heart-dislike");
  box.appendChild(dislike);
  let swiper = document.createElement("div");
  swiper.id = "swiper";
  box.appendChild(swiper);
  let like = document.createElement("ion-icon");
  like.id = "like";
  like.setAttribute("name", "heart");
  box.appendChild(like);
  let writting = document.querySelector("#writting");
  writting.style.display = "block";
  let infos = document.createElement("p");
  writting.appendChild(infos);
  infos.textContent = "";
}

function import_card(profile) {
  let infos = document.querySelector("#writting p");
  infos.textContent = profile.name + "," + getAgeFromDOB(profile.age) + " ans";
  appendNewCard(profile.photo, profile.pid);
  cardCount++;
}

function getAgeFromDOB(dob) {
  const dobDate = new Date(dob);
  const currentDate = new Date();

  let age = currentDate.getFullYear() - dobDate.getFullYear();

  // Check if the birthday has occurred this year
  const hasBirthdayOccurred =
    currentDate.getMonth() > dobDate.getMonth() ||
    (currentDate.getMonth() === dobDate.getMonth() &&
      currentDate.getDate() >= dobDate.getDate());

  if (!hasBirthdayOccurred) {
    age--; // Subtract 1 if the birthday hasn't occurred yet
  }

  return age;
}

// constants
const urls = [
  "https://source.unsplash.com/random/1000x1000/?sky",
  "https://source.unsplash.com/random/1000x1000/?landscape",
  "https://source.unsplash.com/random/1000x1000/?ocean",
  "https://source.unsplash.com/random/1000x1000/?moutain",
  "https://source.unsplash.com/random/1000x1000/?forest",
];

// variables

// functions
function appendNewCard(image, pid) {
  const card = new Card({
    imageUrl: "../assets/hagrid.jpg",
    onDismiss: appendNewCard,
    onLike: () => {
      like.style.animationPlayState = "running";
      like.classList.toggle("trigger");
      socket.emit("swipe", { user_id: userid, pid: pid, res: 1 });
      swiper.removeChild(swiper.lastChild);
      update_name();
    },
    onDislike: () => {
      dislike.style.animationPlayState = "running";
      dislike.classList.toggle("trigger");
      socket.emit("swipe", { user_id: userid, pid: pid, res: 0 });
      swiper.removeChild(swiper.lastChild);
      update_name();
    },
  });
  swiper.append(card.element);
  const cards = swiper.querySelectorAll(".card:not(.dismissing)");
  cards.forEach((card, index) => {
    card.style.setProperty("--i", index);
  });
}

function update_name() {
  cardCount--;
  let infos = document.querySelector("#writting p");
  if (cardCount >= 1) {
    infos.textContent =
      data[cardCount - 1].name +
      "," +
      getAgeFromDOB(data[cardCount - 1].age) +
      "ans";
  } else {
    socket.emit("enter-swipe", { idp: userid });
  }
}

// first 5 cards
