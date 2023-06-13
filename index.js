//On import le module express
const express = require("express");

//on instancie express dans une constante app
const app = express();

//on importe le module path pour définir le chemin des fichiers statiques
const path = require("path");

//on dit à app d'utiliser le module express.urlencoded pour parser les données envoyées par le formulaire de connexion
app.use(express.urlencoded({ extended: false }));

//On permet à express d'utiliser le dossier public pour les fichiers statiques
app.use(express.static(path.join(__dirname, "public")));

//on défini le port sur lequel le serveur va écouter
const port = 4000;

//on importe le module http pour pouvoir créer un serveur qui va utiliser notre instance d'express
const http = require("http").createServer(app);

//on importe le module socket.io pour pouvoir utiliser les websockets et communiquer en temps réel avec le client
const io = require("socket.io")(http);

//renvoie à la page connexion.html lorsque l'on accède à la racine du serveur (pour l'instant localhost:port)
app.get("/", (req, res) => {
  //deux arguments: req pour la reqête du client et res pour la réponse du serveur, tu peux essayer de print l'un ou l'autre pour voir, c'est lourd.
  //res.sendFile permet de renvoyé le client sur une page html.
  //il est possible de renvoyer du texte avec res.send("texte") ou du json avec res.json({json: "json"}) etc...
  res.sendFile(path.join(__dirname, "public/pages/connexion.html"));
});

//À l'envoie du formulaire de connexion, on renvoie à la page index.html (pour l'instant, plus tard il faudra gérer avec la base de donnée etc...).
app.post("/signin", (req, res) => {
  res.sendFile(path.join(__dirname, "public/pages/index.html"));
});

//On demande au serveur d'écouter sur le port défini plus haut
http.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
