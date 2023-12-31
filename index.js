//On import le module express
const express = require("express");
const fs = require("fs");
// npm install jsonwebtoken
const jwt = require("jsonwebtoken");

const secret = "les_pingu!nsRègner0nt-sur_leMonde^^"; //pas sur que les caractères spéciaux soient acceptés

const session = require("express-session");

const cookieParser = require("cookie-parser");

const csrf = require("csurf");

const csrfProtect = csrf({ cookie: true });

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
  if (req.url.startsWith("/pages/")) {
    // Si l'URL commence par "/uploads", passe à la prochaine fonction de middleware
    next();
  } else {
    // Sinon, passe à express.static() pour servir les fichiers statiques
    express.static(path.join(__dirname, "public"))(req, res, next);
  }
});
const { identify_by_cookie } = require("./serverside/js/secure.js");

// Configuration de la session
app.use(
  session({
    secret: "une chaîne de caractères secrète et unique pour votre application",
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: true,
      httpOnly: true,
      sameSite: "strict",
    }
  })  
);

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
    return res.status(403).send("Votre adresse IP est bloquée.");
  }

  // Vérifier le compteur de tentatives pour l'adresse IP
  req.session.failedAttempts = req.session.failedAttempts || {};
  req.session.failedAttempts[ipAddress] =
    req.session.failedAttempts[ipAddress] || 0;

  if (req.session.failedAttempts[ipAddress] >= 10) {
    // Bloquer l'adresse IP
    req.session.blockedIPs = req.session.blockedIPs || [];
    req.session.blockedIPs.push({
      ipAddress: ipAddress,
      timestamp: new Date().getTime(),
    });
    return res.status(403).send("Votre adresse IP est bloquée.");
  }

  next();
});


const privateKey = fs.readFileSync(
  "/etc/letsencrypt/live/magilink.zalax.xyz/privkey.pem",
  "utf8"
);
const certificate = fs.readFileSync(
  "/etc/letsencrypt/live/magilink.zalax.xyz/cert.pem",
  "utf8"
);
const ca = fs.readFileSync(
  "/etc/letsencrypt/live/magilink.zalax.xyz/chain.pem",
  "utf8"
);

const credentials = {
  key: privateKey,
  cert: certificate,
  ca: ca,
};


//on défini le port sur lequel le serveur va écouter
const port = 4000;

//on importe le module http pour pouvoir créer un serveur qui va utiliser notre instance d'express

//const http = require("http").createServer(app);
const https = require("https").createServer(credentials, app);

//on importe le module socket.io pour pouvoir utiliser les websockets et communiquer en temps réel avec le client
const io = require("socket.io")(https);

//renvoie à la page connexion.html lorsque l'on accède à la racine du serveur (pour l'instant localhost:port)

app.get("/signin", (req, res) => {
  console.log("signin");
  if (req.cookies.token) {
    res.redirect("/section_choice");
  }
  res.sendFile(path.join(__dirname, "public/pages/connexion.html"));
});

app.get("/error", (req, res) => {
  console.log("error");
  res.sendFile(path.join(__dirname, "public/pages/error.html"));
});

app.get("/signup", (req, res) => {
  console.log("signup");
  if (req.cookies.token) {
    res.redirect("/section_choice");
  }
  res.sendFile(path.join(__dirname, "public/pages/inscription.html"));
});

app.get("/validate_account", (req, res) => {
  console.log("validate_account");
  res.sendFile(path.join(__dirname, "public/pages/validate_account.html"));
});

app.get("/meet/swap", (req, res) => {
  console.log("meet/swap");
  if (!req.cookies.token) {
    res.redirect("/signin");
  }
  res.sendFile(path.join(__dirname, "public/pages/meet/swap.html"));
});

app.get("/meet/message", (req, res) => {
  console.log("meet/message");
  if (!req.cookies.token) {
    res.redirect("/signin");
  }
  res.sendFile(path.join(__dirname, "public/pages/meet/message.html"));
});

app.get("/community/swap", (req, res) => {
  console.log("community/swap");
  if (!req.cookies.token) {
    res.redirect("/signin");
  }
  res.sendFile(path.join(__dirname, "public/pages/community/swap.html"));
});

app.get("/community/message", (req, res) => {
  console.log("community/message");
  if (!req.cookies.token) {
    res.redirect("/signin");
  }
  res.sendFile(path.join(__dirname, "public/pages/community/message.html"));
});

app.get("/section_choice", async (req, res) => {
  console.log("section_choice");
  if (!req.cookies.token) {
    res.redirect("/signin");
  }
  const userid = identify_by_cookie(req.cookies, secret);
  const {
    profile_id_from_user,
    check_if_data_is_null,
  } = require("./serverside/js/profile.js");
  const pid = await profile_id_from_user(userid);
  if (!pid) {
    res.redirect("/setup_profile");
  }
  const check = await check_if_data_is_null("maison", pid);
  if (check) {
    console.log("maison is null");
    res.redirect("/test_house1");
  } else {
    res.sendFile(path.join(__dirname, "public/pages/section_choice.html"));
  }
});

app.get("/CGU", (req, res) => {
  console.log("CGU");
  res.sendFile(path.join(__dirname, "public/assets/CGU.txt"));
});


app.get("/test_house1", async (req, res) => {
  console.log("test_house1");
  const {
    profile_id_from_user,
    check_if_data_is_null,
  } = require("./serverside/js/profile.js");
  const { check_affinity } = require("./serverside/js/maison.js");
  if (!req.cookies.token) {
    res.redirect("/signin");
  } else {
    const pid = await profile_id_from_user(
      identify_by_cookie(req.cookies, secret)
    );
    if (!pid) {
      res.redirect("/setup_profile");
      return;
    }
    const check = await check_if_data_is_null("maison", pid);
    if (check) {
      const affinity = await check_affinity(pid);
      switch (affinity) {
        case 1:
          res.sendFile(path.join(__dirname, "public/pages/test_house1.html"));
          return;
        case 2:
          res.redirect("/test_house2");
          return;
        case 3:
          res.redirect("/test_house3");
          return;
        case false:
      }
    } else {
      res.redirect("/");
    }
  }
});

app.get("/test_house2", async (req, res) => {
  console.log("test_house2");
  const {
    profile_id_from_user,
    check_if_data_is_null,
  } = require("./serverside/js/profile.js");
  const { check_affinity } = require("./serverside/js/maison.js");
  if (!req.cookies.token) {
    res.redirect("/signin");
  } else {
    const pid = await profile_id_from_user(
      identify_by_cookie(req.cookies, secret)
    );
    if (!pid) {
      res.redirect("/setup_profile");
    }
    const check = await check_if_data_is_null("maison", pid);
    if (check) {
      const affinity = await check_affinity(pid);
      switch (affinity) {
        case 1:
          res.redirect("/test_house1");
          return;
        case 2:
          res.sendFile(path.join(__dirname, "public/pages/test_house2.html"));
          return;
        case 3:
          res.redirect("/test_house3");
          return;
      }
    } else {
      res.redirect("/");
    }
  }
});

app.get("/test_house3", async (req, res) => {
  console.log("test_house3");
  const {
    profile_id_from_user,
    check_if_data_is_null,
  } = require("./serverside/js/profile.js");
  const { check_affinity } = require("./serverside/js/maison.js");
  if (!req.cookies.token) {
    res.redirect("/signin");
  } else {
    const pid = await profile_id_from_user(
      identify_by_cookie(req.cookies, secret)
    );
    if (!pid) {
      res.redirect("/setup_profile");
    }
    const check = await check_if_data_is_null("maison", pid);
    if (check) {
      const affinity = await check_affinity(pid);
      switch (affinity) {
        case 1:
          res.redirect("/test_house1");
          return;
        case 2:
          res.redirect("/test_house2");
          return;
        case 3:
          res.sendFile(path.join(__dirname, "public/pages/test_house3.html"));
          return;
      }
    } else {
      res.redirect("/");
    }
  }
});

app.get("/house_setup", async (req, res) => {
  console.log("house_setup");
  const {
    profile_id_from_user,
    check_data
  } = require("./serverside/js/profile.js");
  if (!req.cookies.token) {
    res.redirect("/signin");
  } else {
    const pid = await profile_id_from_user(
      identify_by_cookie(req.cookies, secret)
    );
    if (!pid) {
      res.redirect("/setup_profile");
    }
    const check = await check_data("maison", pid);
    if (check) {
      res.sendFile(path.join(__dirname, "public/pages/house_discovery.html"));
    } else {
      res.redirect("/test_house1");
    }
  }
});

app.get("/setup_profile" , async (req, res) => {
  console.log("setup_profile");
  const { profile_id_from_user } = require("./serverside/js/profile.js");
  if (!req.cookies.token) {
    res.redirect("/signin");
  } else {
    const pid = await profile_id_from_user(
      identify_by_cookie(req.cookies, secret)
    );
    if (!pid) {
      res.sendFile(path.join(__dirname, "public/pages/setup_profile.html"));
    } else {
      res.redirect("/section_choice");
    }
  }
});

app.get("/", (req, res) => {
  //deux arguments: req pour la reqête du client et res pour la réponse du serveur, tu peux essayer de print l'un ou l'autre pour voir, c'est lourd.
  //res.sendFile permet de renvoyé le client sur une page html.
  //il est possible de renvoyer du texte avec res.send("texte") ou du json avec res.json({json: "json"}) etc...
  res.sendFile(path.join(__dirname, "public/pages/accueil.html"));
});

app.get("/logout", (req, res) => {
  res.clearCookie("token");
  res.redirect("/");
});

app.get("*", (req, res) => {
  res.redirect("/");
});

//À l'envoie du formulaire de connexion, on renvoie à la page index.html (pour l'instant, plus tard il faudra gérer avec la base de donnée etc...).
app.post("/signin", async (req, res) => {
  const { trylogin } = require("./serverside/js/connexion.js");
  const { secure } = require("./serverside/js/secure.js");
  validated_input = secure(req.body);
  login = await trylogin(validated_input);
  if (login) {
    //partie brute force
    req.session.failedAttempts[req.ip] = 0;
    // Si les informations d'identification sont valides, générez un token
    const token = jwt.sign({ key: login.idp }, secret, {
      expiresIn: 7200, // expires in 2 hours
    });
    // Renvoyez le token au client
    res.cookie("token", token, { maxAge: 1000 * 60 * 60 * 2, httpOnly: false, sameSite: true, secure: true });
    res.redirect("/section_choice");
  } else {
    res.sendFile(path.join(__dirname, "public/pages/connexion.html"));
    //partie brute force
    req.session.failedAttempts[req.ip] += 1;
    //res.status(401).send('Identifiants de connexion invalides.');
  }
});

app.post("/signup", async (req, res) => {
  const { register } = require("./serverside/js/register.js");
  const { secure } = require("./serverside/js/secure.js");
  validated_input = secure(req.body);
  const check = await register(validated_input);
  if (check) {
    res.redirect("/validate_account");
  } else {
    res.redirect("/signup");
  }
});

app.post("/setup_profile" , async (req, res) => {
  const { identify_by_cookie, secure } = require("./serverside/js/secure.js");
  const userid = identify_by_cookie(req.cookies, secret);
  req.body["ville"] = req.body["ville"][1];
  const validated_input = secure(req.body);
  const { set_profile, update_user } = require("./serverside/js/profile.js");
  const check = await set_profile(validated_input, userid);
  if (check) {
    await update_user(check.pid, userid);
    res.redirect("/section_choice");
  } else {
    res.redirect("/setup_profile");
  }
});

app.post("/validate_email", (req, res) => {
  res.redirect("/signin");
});

app.post("/meet/message", (req, res) => {
  res.sendFile(path.join(__dirname, "public/pages/meet/message.html"));
});

app.post("/community/message", (req, res) => {
  res.sendFile(path.join(__dirname, "public/pages/community/message.html"));
});

app.post("/test_house1", async (req, res) => {
  const { create_test_steps } = require("./serverside/js/maison.js");
  const { profile_id_from_user } = require("./serverside/js/profile.js");
  const { identify_by_cookie } = require("./serverside/js/secure.js");
  const userid = identify_by_cookie(req.cookies, secret);
  const pid = await profile_id_from_user(userid);
  if (!pid) {
    res.redirect("/setup_profile");
  } else {
    const check = await create_test_steps(pid, req.body);
    if (check) {
      res.redirect("/test_house2");
    } else {
      res.sendFile(path.join(__dirname, "public/pages/error.html"));
      console.log("error");
    }
  }
});

app.post("/test_house2", async (req, res) => {
  const { create_test_steps } = require("./serverside/js/maison.js");
  const { profile_id_from_user } = require("./serverside/js/profile.js");
  const { identify_by_cookie } = require("./serverside/js/secure.js");
  const userid = identify_by_cookie(req.cookies, secret);
  const pid = await profile_id_from_user(userid);
  if (!pid) {
    res.redirect("/setup_profile");
  } else {
    const check = await create_test_steps(pid, req.body);
    if (check) {
      res.redirect("/test_house3");
    } else {
      res.sendFile(path.join(__dirname, "public/pages/error.html"));
      console.log("error");
    }
  }
});

app.post('/section_choice', async (req, res) => {
  res.redirect("/section_choice");
});

app.post("/test_house3", async (req, res) => {
  const { create_test_steps, set_house } = require("./serverside/js/maison.js");
  const { profile_id_from_user } = require("./serverside/js/profile.js");
  const { identify_by_cookie } = require("./serverside/js/secure.js");
  const userid = identify_by_cookie(req.cookies, secret);
  const pid = await profile_id_from_user(userid);
  if (!pid) {
    res.redirect("/setup_profile");
  } else {
    const check = await create_test_steps(pid, req.body);
    if (check) {
      const check2 = await set_house(pid, check);
      if (check2) {
        res.redirect("/house_setup");
      } else {
        res.sendFile(path.join(__dirname, "public/pages/error.html"));
        console.log("error");
      }
    } else {
      res.sendFile(path.join(__dirname, "public/pages/error.html"));
      console.log("error");
    }
  }
});

io.on("connection", (socket) => {
  console.log("une connection s'active");
  socket.on("disconnect", () => {
    console.log("Un utilisateur s'est déconnecté");
  });

  socket.on("enter_room", async (room) => {
    const { getMessages_byChannel,getUsers_by_channel } = require("./serverside/js/message_meet.js");
    const {profile_id_from_user} = require("./serverside/js/profile.js");
    socket.join(room);
    let messages = await getMessages_byChannel(room);
    let realmessage = []
    messages.forEach(async(element) => {
      realmessage.push({ "userid": element.author,"date" : element.date, "content": element.content, "autre" : {autre: element.author, moi:element.author} });
    });
    socket.emit("init_messages", { messages: JSON.stringify(realmessage) });
  });

  socket.on("get_cities", async (msg) => {
    const { get_cities } = require("./serverside/js/villes.js");
    const list = await get_cities();
    const list2 = [];
    list.forEach((element) => {
      list2.push([element.ville_id,element.ville_nom_reel]);
    });
    socket.emit("city_list", { cities: list2 });
  });

  socket.on("maison",async (msg) => {
    const {identify_by_cookie} = require("./serverside/js/secure.js");
    const {profile_id_from_user} = require("./serverside/js/profile.js"); 
    idp = identify_by_cookie({token : msg.name}, secret);
    const pid = await profile_id_from_user(idp);
    const {check_data} = require("./serverside/js/profile.js");
    const maison = await check_data("maison",pid);
    socket.emit("maison", { maison: maison });
  });

  socket.on("leave_room", (room) => {
    socket.leave(room);
  });

  socket.on("chat_message", async (msg) => {
    io.in(msg.room).emit("received_message", msg);
    const { setMessage, getUsers_by_channel } = require("./serverside/js/message_meet.js");
    const {identify_by_cookie} = require("./serverside/js/secure.js");
    const {profile_id_from_user} = require("./serverside/js/profile.js"); 
    idp = identify_by_cookie({token : msg.user_id}, secret);
    const pid = await profile_id_from_user(idp);
    const msg_added = setMessage(pid, msg.room.rooms, msg.content, msg.date);
    if (msg_added) {
      console.log("message envoyé");
      const users = await getUsers_by_channel(msg.room.rooms, pid);
      msg["autre"] = users;
      io.in(msg.room.rooms).emit("received_message", msg);
    }

  });

  socket.on("user_connected", async (msg) => {
    console.log("user_connected");
    const { getChannels_byUser,create_Channel } = require("./serverside/js/message_meet.js");
    const { identify_by_cookie } = require("./serverside/js/secure.js");
    const userid = identify_by_cookie({ token: msg.name }, secret);
    const channels = await getChannels_byUser(userid);
    socket.emit("init_channels", { channels: channels });
  });

  socket.on("enter-swipe", async (msg) => {
    console.log("get_card");
    const { identify_by_cookie } = require("./serverside/js/secure.js");
    const userid = identify_by_cookie({ token: msg.idp }, secret);
    const {pick} = require("./serverside/js/swipe.js");
    const profiles = await pick(userid);
    var dataswipe = []
    profiles.forEach((profile) => {
      dataswipe.push({ "userid": profile.idp, "name": profile.prenom, "age": profile.dob, "city": profile.ville, "bio": profile.bio, "img": profile.meet_picture, "pid":profile.pid });
    });
    socket.emit("swipe-data", dataswipe);
  });

  socket.on("typing", (msg) => {
    socket.to(msg.room).emit("usertyping", msg);
  });

  socket.on("swipe", async (msg) => {
    const { identify_by_cookie } = require("./serverside/js/secure.js");
    const userid = identify_by_cookie({ token: msg.user_id }, secret);
    const {like,dislike} = require("./serverside/js/swipe.js");
    if (msg.res == 0){
      await dislike(msg.pid,userid);
    }
    else if (msg.res == 1){
      await like(msg.pid,userid);
    }
    else{
      console.log("error");
    }
  });

});

//On demande au serveur d'écouter sur le port défini plus haut

// http.listen(port, () => {
//   console.log(`Server is running on port ${port}`);
// });

https.listen(443, () => {
   console.log(`Server is running on port 443`);
});


const util = require('util');

// Définir le chemin du fichier de log
const logFilePath = path.join(__dirname, './serverside/logs/23_06.log');

// Ouvrir le flux de sortie vers le fichier de log en mode append
const logStream = fs.createWriteStream(logFilePath, { flags: 'a' });

// Rediriger console.log vers le flux de sortie du fichier de log
console.log = function (message) {
  logStream.write(util.format(message) + '\n');
  process.stdout.write(util.format(message) + '\n');
};

// Fermer le flux de sortie du fichier de log lors de la fermeture de l'application
process.on('exit', () => {
  logStream.end();
});
