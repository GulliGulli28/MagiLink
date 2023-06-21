const left = document.querySelector("#left");
const right = document.querySelector("#right");
const left1 = document.querySelector("#left1");
const right1 = document.querySelector("#right1");
const cont = document.querySelector("#container");

window.onload = () => {
  var audio = new Audio();
  audio.src = "../assets/2.mp3";
  audio.play();
  var bg = [, "#db9d2f", "#1f4829", "#a51944", "#091835"];
  var logo = [
    "../assets/huf-removebg-preview.png",
    "../assets/Slytherin-removebg-preview.png",
    "../assets/gri-removebg-preview.png",
    "public/assets/Ravenclaw.png",
  ];
  setTimeout(function () {
    left.classList.add("left-transition");
    right.classList.add("left-transition");
    left1.classList.add("left-transition");
    right1.classList.add("left-transition");
    left.style.transform = "translateX(-50vw)";
    right.style.transform = "translateX(50vw)";
    left1.style.transform = "translateX(-50vw)";
    right1.style.transform = "translateX(50vw)";
    let form = document.createElement("form");
    form.setAttribute("method", "post");
    form.setAttribute("action", "/section_choice");
    document.body.appendChild(form);
    document.addEventListener("click", function () {
      form.submit();
    });
  }, 7000);
};
