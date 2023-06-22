const socket = io();
const userid = document.cookie
  .split(";")
  .find((cookie) => cookie.trim().startsWith("token="))
  .split("=")[1];

document.querySelectorAll("#tabs li").forEach((tab) => {
  tab.addEventListener("click", function () {
    if (!this.classList.contains("active")) {
      const actif = document.querySelector("#tabs li.active");
      if (!actif) {
        this.classList.add("active");
      } else {
        actif.classList.remove("active");
        this.classList.add("active");
      }

      switch (this.dataset.room) {
        case "profile":
          displayProfile();
        case "param":
          displayParam();
        case "other":
          displayOther();
      }
    }
  });
});

function displayProfile() {
  socket.emit("param_profile", { userid: userid });
  socket.on("confirm_profile", (msg) => {
    Main = document.querySelector("main");

    div_container = document.createElement("div");
    div_container.classList.add("form-container");

    Main.appendChild(div_container);

    titre = document.createElement("p");
    titre.classList.add("title");
    titre.textContent = "Profile";

    div_container.appendChild(titre);

    formulaire = document.createElement("form");
    formulaire.setAttribute("method", "post");
    formulaire.setAttribute("action", "/setup_profile");
    formulaire.classList.add("form");
    formulaire.id = "myForm";

    div_container.appendChild(formulaire);

    div_name = document.createElement("div");
    div_name.classList.add("input-group");

    div_container.appendChild(div_name);

    label_name = document.createElement("label");
    label_name.setAttribute("for", "name");
    label_name.textContent = "Name";

    div_name.appendChild(label_name);

    input_name = document.createElement("input");
    input_name.setAttribute("type", "text");
    input_name.setAttribute("name", "username");
    input_name.setAttribute("id", "name");
    input_name.setAttribute("value", msg.nom);
    input_name.setAttribute("required", "");

    div_name.appendChild(input_name);

    div_prenom = document.createElement("div");
    div_prenom.classList.add("input-group");

    div_container.appendChild(div_prenom);

    label_prenom = document.createElement("label");
    label_prenom.setAttribute("for", "prenom");
    label_prenom.textContent = "Prenom";

    div_prenom.appendChild(label_prenom);

    input_prenom = document.createElement("input");
    input_prenom.setAttribute("type", "text");
    input_prenom.setAttribute("name", "prenom");
    input_prenom.setAttribute("id", "prenom");
    input_prenom.setAttribute("value", msg.prenom);
    input_prenom.setAttribute("required", "");

    div_prenom.appendChild(input_prenom);

    div_data_of_birth = document.createElement("div");
    div_data_of_birth.classList.add("input-group");

    div_container.appendChild(div_data_of_birth);

    label_data_of_birth = document.createElement("label");
    label_data_of_birth.setAttribute("for", "birthdate");
    label_data_of_birth.textContent = "Date of birth";

    div_data_of_birth.appendChild(label_data_of_birth);

    input_data_of_birth = document.createElement("input");
    input_data_of_birth.setAttribute("type", "text");
    input_data_of_birth.setAttribute("name", "birthdate");
    input_data_of_birth.setAttribute("id", "birthdate");
    input_data_of_birth.setAttribute("value", msg.birthdate);
    input_data_of_birth.setAttribute("required", "");
    input_data_of_birth.setAttribute("placeholder", "dd/mm/yyyy");
    input_data_of_birth.setAttribute("pattern", "d{2}/d{2}/d{4}");

    div_data_of_birth.appendChild(input_data_of_birth);

    div_ville = document.createElement("div");
    div_ville.classList.add("input-group");

    div_container.appendChild(div_ville);

    label_ville = document.createElement("label");
    label_ville.setAttribute("for", "ville");
    label_ville.textContent = "Ville";

    div_ville.appendChild(label_ville);

    select_ville = document.createElement("select");
    select_ville.setAttribute("name", "ville");
    select_ville.setAttribute("id", "ville");
    select_ville.setAttribute("required", "");
    select_ville.setAttribute("value", msg.ville);

    div_ville.appendChild(select_ville);

    div_genre = document.createElement("div");
    div_genre.classList.add("input-group");

    div_container.appendChild(div_genre);

    label_genre = document.createElement("label");
    label_genre.setAttribute("for", "genre");
    label_genre.textContent = "Genre";

    div_genre.appendChild(label_genre);

    select_genre = document.createElement("select");
    select_genre.setAttribute("name", "genre");
    select_genre.setAttribute("id", "genre");
    select_genre.setAttribute("required", "");
    select_genre.setAttribute("value", msg.genre);

    div_genre.appendChild(select_genre);

    option_genre_choix = document.createElement("option");
    option_genre_choix.setAttribute("value", "");
    option_genre_choix.textContent = "Choix du genre";

    select_genre.appendChild(option_genre_choix);

    option_genre_homme = document.createElement("option");
    option_genre_homme.setAttribute("value", "homme");
    option_genre_homme.textContent = "Homme";

    select_genre.appendChild(option_genre_homme);

    option_genre_femme = document.createElement("option");
    option_genre_femme.setAttribute("value", "femme");
    option_genre_femme.textContent = "Femme";

    select_genre.appendChild(option_genre_femme);

    option_genre_non_binaire = document.createElement("option");
    option_genre_non_binaire.setAttribute("value", "non-binaire");
    option_genre_non_binaire.textContent = "Non-binaire";

    select_genre.appendChild(option_genre_non_binaire);

    option_autre = document.createElement("option");
    option_autre.setAttribute("value", "autre");
    option_autre.textContent = "Autre";

    select_genre.appendChild(option_autre);

    option_genre_helicoptere = document.createElement("option");
    option_genre_helicoptere.setAttribute("value", "helicoptere");
    option_genre_helicoptere.textContent = "Helicoptere";

    select_genre.appendChild(option_genre_helicoptere);

    div_bio = document.createElement("div");
    div_bio.classList.add("input-group");

    div_container.appendChild(div_bio);

    label_bio = document.createElement("label");
    label_bio.setAttribute("for", "bio");
    label_bio.textContent = "Bio";

    div_bio.appendChild(label_bio);

    textarea_bio = document.createElement("textarea");
    textarea_bio.setAttribute("name", "bio");
    textarea_bio.setAttribute("id", "bio");
    textarea_bio.setAttribute("rows", "4");
    textarea_bio.setAttribute("cols", "50");

    div_bio.appendChild(textarea_bio);

    div_photo_profile = document.createElement("div");
    div_photo_profile.classList.add("input-group");

    div_container.appendChild(div_photo_profile);

    label_photo_profile = document.createElement("label");
    label_photo_profile.setAttribute("for", "photo_profile");
    label_photo_profile.classList.add("custom-file-upload");

    div_photo_profile.appendChild(label_photo_profile);

    span_photo_profile = document.createElement("span");
    span_photo_profile.textContent = "Photo de profile";

    label_photo_profile.appendChild(span_photo_profile);

    input_photo_profile = document.createElement("input");
    input_photo_profile.setAttribute("type", "file");
    input_photo_profile.setAttribute("name", "photo_profile");
    input_photo_profile.setAttribute("id", "photo_profile");

    div_photo_profile.appendChild(input_photo_profile);

    div_photo_communaute = document.createElement("div");
    div_photo_communaute.classList.add("input-group");

    div_container.appendChild(div_photo_communaute);

    label_photo_communaute = document.createElement("label");
    label_photo_communaute.setAttribute("for", "photo_commu");
    label_photo_communaute.classList.add("custom-file-upload");

    div_photo_communaute.appendChild(label_photo_communaute);

    span_photo_communaute = document.createElement("span");
    span_photo_communaute.textContent = "Photo de la communauté";

    label_photo_communaute.appendChild(span_photo_communaute);

    input_photo_communaute = document.createElement("input");
    input_photo_communaute.setAttribute("type", "file");
    input_photo_communaute.setAttribute("name", "photo_commu");
    input_photo_communaute.setAttribute("id", "photo_commu");

    div_photo_communaute.appendChild(input_photo_communaute);

    br1 = document.createElement("br");

    div_container.appendChild(br1);

    p2 = document.createElement("p");
    p2.textContent = "Essayez de ne pas utiliser la même pour les deux photos.";

    div_container.appendChild(p2);

    button_submit = document.createElement("button");
    button_submit.classList.add("sign");
    button_submit.textContent = "Submit";
  });
}

function displayParam() {
  console.log("param");
}

function displayOther() {
  console.log("other");
}
