document.querySelectorAll("#choice p").forEach((tab) => {
  tab.addEventListener("click", function () {
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

window.onload = () => {
  document.querySelector("#form").addEventListener("submit", (e) => {
    e.preventDefault();
    const message = document.querySelector("#message");
    console.log(message.value);
    display_message(message.value);
    message.value = "";
  });
};

function display_message(msg) {
  const window_ss = document.querySelector("#messages");
  const div = document.createElement("div");
  const p = document.createElement("p");
  p.textContent = msg;
  div.appendChild(p);
  window_ss.appendChild(div);
  window_ss.scrollTop = window_ss.scrollHeight;
}

function display_swipe() {
  const messagesDiv = document.getElementById("messages");
  while (messagesDiv.firstChild) {
    messagesDiv.removeChild(messagesDiv.firstChild);
  }
  const div = document.createElement("div");
  const p = document.createElement("p");
  p.textContent = "T BO ALBAN";
  div.appendChild(p);
  messagesDiv.appendChild(div);
}
