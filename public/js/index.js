const menuIcon = document.querySelector(".menu-icon");
const menu = document.querySelector(".menu");


menuIcon.addEventListener("click", () => {
  menu.classList.toggle(
    "show"
  ); /* Ajouter ou retirer la classe "show" pour afficher ou cacher le menu */
});
