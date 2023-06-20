//On import le module express
const express = require("express");

const session = require('express-session');


const cookieParser = require("cookie-parser");

//on instancie express dans une constante app
const app = express();

//on importe le module path pour définir le chemin des fichiers statiques
const path = require("path");
const { profile } = require("console");

//on dit à app d'utiliser le module express.urlencoded pour parser les données envoyées par le formulaire de connexion
app.use(express.urlencoded({ extended: false }));

app.use(cookieParser());

//On permet à express d'utiliser le dossier public pour les fichiers statiques
app.use((req, res, next) => {
  if (req.url.startsWith('/pages/')) {
    // Si l'URL commence par "/uploads", passe à la prochaine fonction de middleware
    next();
  } else {
    // Sinon, passe à express.static() pour servir les fichiers statiques
    express.static(path.join(__dirname, 'public'))(req, res, next);
  }
});

// Configuration de la session
app.use(session({
  secret: 'une chaîne de caractères secrète et unique pour votre application',
  resave: false,
  saveUninitialized: true,
}));


// Middleware de vérification des tentatives de connexion
app.use((req, res, next) => {
  // Vérifier et débloquer périodiquement les adresses IP bloquées
  if (req.session.blockedIPs) {
    const currentTime = new Date().getTime();

    // Parcourir toutes les adresses IP bloquées
    req.session.blockedIPs.forEach((blockedIP, index) => {
      const blockedTime = blockedIP.timestamp;
      const elapsedTime = currentTime - blockedTime;

      // Vérifier si le délai de blocage de 1 minute est écoulé
      if (elapsedTime >= 60000) {
        // Supprimer l'adresse IP de la liste des adresses IP bloquées
        req.session.blockedIPs.splice(index, 1);
        req.session.failedAttempts[req.ip] = 0;
        console.log(`Adresse IP ${req.ip} débloquée.`);
      }else {
        console.log(`Adresse IP ${req.ip} toujours bloquée pour `,elapsedTime-60000,` millisecondes.`);
      }
    });

    // Supprimer la liste des adresses IP bloquées si elle est vide
    if (req.session.blockedIPs.length === 0) {
      delete req.session.blockedIPs;
    }
  }




  const ipAddress = req.ip; // Obtenir l'adresse IP du client

  // Vérifier si l'adresse IP est bloquée
  if (req.session.blockedIPs && req.session.blockedIPs.includes(ipAddress)) {
    return res.status(403).send('Votre adresse IP est bloquée.');
  }

  // Vérifier le compteur de tentatives pour l'adresse IP
  req.session.failedAttempts = req.session.failedAttempts || {};
  req.session.failedAttempts[ipAddress] = req.session.failedAttempts[ipAddress] || 0;

  if (req.session.failedAttempts[ipAddress] >= 10) {
    // Bloquer l'adresse IP
    req.session.blockedIPs = req.session.blockedIPs || [];
    req.session.blockedIPs.push({ ipAddress: ipAddress, timestamp: new Date().getTime() });
    return res.status(403).send('Votre adresse IP est bloquée.');
  }

  

  next();

  

});


//on défini le port sur lequel le serveur va écouter
const port = 4000;

//on importe le module http pour pouvoir créer un serveur qui va utiliser notre instance d'express
const http = require("http").createServer(app);

//on importe le module socket.io pour pouvoir utiliser les websockets et communiquer en temps réel avec le client
const io = require("socket.io")(http);

//renvoie à la page connexion.html lorsque l'on accède à la racine du serveur (pour l'instant localhost:port)

app.get("/signin", (req, res) => {
  res.sendFile(path.join(__dirname, "public/pages/connexion.html"));
});

app.get("/signup", (req, res) => { 
  res.sendFile(path.join(__dirname, "public/pages/inscription.html"));
  
});

app.get("/validate_account", (req, res) => {
  res.sendFile(path.join(__dirname, "public/pages/validate_account.html"));
});

app.get("/meet/swap", (req, res) => {
  res.sendFile(path.join(__dirname, "public/pages/meet/swap.html"));
});

app.get("/meet/message", (req, res) => {
  res.sendFile(path.join(__dirname, "public/pages/meet/message.html"));
});

app.get("/community/swap", (req, res) => {
  res.sendFile(path.join(__dirname, "public/pages/community/swap.html"));
});

app.get("/community/message", (req, res) => {
  res.sendFile(path.join(__dirname, "public/pages/community/message.html"));
});

app.get("/section_choice", (req, res) => {
  const {identify_by_cookie} = require('./serverside/js/secure.js');
  const userid = identify_by_cookie(req.cookies);
  const {profile_id_from_user,check_if_data_is_null} = require('./serverside/js/profile.js');
  const pid = profile_id_from_user(userid);
  if (pid == null){
    res.redirect("/setup_profile");
  }
  else if (check_if_data_is_null("maison", pid)) {
    res.redirect("/test_maison");
  }
  else {
    res.sendFile(path.join(__dirname, "public/pages/section_choice.html"));
  }
});

app.get("/test_maison", (req, res) => {
  res.sendFile(path.join(__dirname, "public/pages/test_maison.html"));
});

app.get("/setup_profile" , (req, res) => {
  res.sendFile(path.join(__dirname, "public/pages/setup_profile.html"));
});

app.get("/", (req, res) => {
  //deux arguments: req pour la reqête du client et res pour la réponse du serveur, tu peux essayer de print l'un ou l'autre pour voir, c'est lourd.
  //res.sendFile permet de renvoyé le client sur une page html.
  //il est possible de renvoyer du texte avec res.send("texte") ou du json avec res.json({json: "json"}) etc...
  res.sendFile(path.join(__dirname, "public/pages/accueil.html"));
});

app.get("*", (req, res) => {
  res.redirect("/");
});
//À l'envoie du formulaire de connexion, on renvoie à la page index.html (pour l'instant, plus tard il faudra gérer avec la base de donnée etc...).
app.post("/signin", async (req, res) => {
  //req.body contient les données envoyées par le formulaire, on peut y accéder avec req.body.nomDuChamp
  console.log(req.body);
  const { secure, trylogin } = require('./serverside/js/connexion.js');
  validated_input = secure(req.body);
  login = await trylogin(validated_input);
  console.log("login", login);
  if (login) {
    res.sendFile(path.join(__dirname, "public/pages/index.html"));
    //partie brute force
    req.session.failedAttempts[req.ip] = 0;
    res.send('Connexion réussie !');
  }
  else {
    res.sendFile(path.join(__dirname, "public/pages/connexion.html"));
    //partie brute force
    req.session.failedAttempts[req.ip] += 1;
    //res.status(401).send('Identifiants de connexion invalides.');
  }
});

app.post("/signup", async (req, res) => {
  console.log(req.body);
  const { secure, register } = require('./serverside/js/register.js');
  validated_input = secure(req.body);
  const check = await register(validated_input);
  if (check) {
    res.cookie("test", "test", {maxAge: 1000 * 60*10 , httpOnly: true})
    res.redirect("/pages/validate_account.html");
  }
  else {
    res.redirect("/pages/inscription.html");
  }
});

app.post("/setup_profile", async (req, res) => {
  const {identify_by_cookie,secure} = require('./serverside/js/secure.js');
  const userid = identify_by_cookie(req.cookies);
  const validated_input = secure(req.body);
  const {set_profile} = require('./serverside/js/profile.js');
  const check = await set_profile(validated_input,userid);
  if (check){
    res.redirect("/pages/section_choice.html");
  }
  else {
    res.redirect("/pages/setup_profile.html");
  }
});

app.post("/validate_email", (req, res) => {
  res.redirect("/pages/section_choice.html");
});

app.post("/meet/message", (req, res) => {
  res.sendFile(path.join(__dirname, "public/pages/meet/message.html"));
});

app.post("/community/message", (req, res) => {
  res.sendFile(path.join(__dirname, "public/pages/community/message.html"));
});

//On demande au serveur d'écouter sur le port défini plus haut
http.listen(port, () => {
  console.log(`Server is running on port ${port}`);

});

