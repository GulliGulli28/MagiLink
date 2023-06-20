const leftelem = document.querySelector("#left");
const rightelem = document.querySelector("#right");

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
