//On import le module express
const express = require("express");

//on instancie express dans une constante app
const app = express();

//on importe le module path pour définir le chemin des fichiers statiques
const path = require("path");

//on dit à app d'utiliser le module express.urlencoded pour pouvoir récupérer les données du formulaire
app.use(express.urlencoded({ extended: false }));

//On permet à express d'utiliser le dossier public pour les fichiers statiques
app.use(express.static(path.join(__dirname, "public")));

//on défini le port sur lequel le serveur va écouter
const port = 4000;

//on importe le module http pour pouvoir créer un serveur qui va utiliser express
const http = require("http").createServer(app);

//on importe le module socket.io pour pouvoir utiliser les websockets
const io = require("socket.io")(http);

//renvoie à la page connexion.html lorsque l'on accède à la racine du serveur
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public/pages/connexion.html"));
});

//À l'envoie du formulaire de connexion, on renvoie à la page index.html (pour l'instant).
app.get("/signin", (req, res) => {
  res.sendFile(path.join(__dirname, "public/pages/index.html"));
});

//On demande au serveur d'écouter sur le port défini plus haut
http.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
