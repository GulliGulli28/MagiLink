const leftelem = document.querySelector("#left");
const rightelem = document.querySelector("#right");
const btn = document.querySelector("#logout");

leftelem.addEventListener("click", () => {
  // Recherchez le formulaire à l'intérieur de l'élément cliqué
  const form = leftelem.querySelector(".form");

  // Soumettez le formulaire si trouvé
  if (form) {
    form.submit();
  }
});

rightelem.addEventListener("click", () => {
  // Recherchez le formulaire à l'intérieur de l'élément cliqué
  const form = rightelem.querySelector(".form");

  // Soumettez le formulaire si trouvé
  if (form) {
    form.submit();
  }
});

btn.addEventListener("click", () => {
  supprimerCookie2("token");
  window.location.href = "/";
});

function supprimerCookie(nom) {
  document.cookie = nom + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
}

function supprimercookie2() {
  window.location.href = "/logout";
}
