const socket = io();
const userid = document.cookie.split(";").find((cookie) => cookie.trim().startsWith("token=")).split("=")[1];
console.log(document.cookie);


window.onload = () => {



  document.querySelector("#form").addEventListener("submit", (e) => {
    e.preventDefault();
    const message = document.querySelector("#message");
    const room = document.querySelector("#choice p.active").dataset.room;
    const createdAt = new Date();

    socket.emit("chat_message", {
      id: userid,
      message: message.value,
      room: room,
      createdAt: createdAt,
    });
    document.querySelector("#message").value = "";
  });

  socket.on("received_message", (msg) => {
    publishMessage(msg);
    var messagesDiv = document.querySelector("#messages");
    var lastMessage = messagesDiv.lastElementChild;
    lastMessage.scrollIntoView();
    if (msg.name != username) {
      audio.play();
    }
  });
};

document.querySelectorAll("#choice p").forEach((tab) => {
  tab.addEventListener("click", function () {
    console.log(hello);
    if (!this.classList.contains("active")) {
      let actif = document.querySelector("#choice p.active");
      actif.classList.remove("active");
      this.classList.add("active");
      if (this.id == "swipe") {
        document.querySelector("#form").style.display = "none";
        display_swipe();
      } else {
        document.querySelector("#form").style.display = "block";
        display_message("Chat");
      }
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

  nameDateContainer.appendChild(picture);
  nameDateContainer.appendChild(nameSpan);
  nameDateContainer.appendChild(dateSpan);

  divElement.appendChild(nameDateContainer);
  divElement.appendChild(messageParagraph);

  document.querySelector("#messages").appendChild(divElement);
}

