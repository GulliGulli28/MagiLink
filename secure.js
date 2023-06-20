//--------------TOKEN
const express = require('express');

// npm install jsonwebtoken
const jwt = require('jsonwebtoken');

const secret = 'les_pingu!nsRègner0nt-sur_leMonde^^';//pas sur que les caractères spéciaux soient acceptés


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
    // Si les informations d'identification sont valides, générez un token
    const token = jwt.sign({ validated_input.username }, secret, {
      expiresIn: 7200 // expires in 2 hours
    });
    // Renvoyez le token au client
    res.json({ token });
  }
  else {
    res.sendFile(path.join(__dirname, "public/pages/connexion.html"));
    //partie brute force
    req.session.failedAttempts[req.ip] += 1;
    //res.status(401).send('Identifiants de connexion invalides.');
  }
});


// Middleware pour vérifier l'authentification
function verifyToken(req, res, next) {
  const token = req.headers['authorization'];

  // Vérifiez si le token est présent si non retournez à la page de connexion
  if (!token) {
    return res.redirect('/login');
  }

  // Vérifiez et décodez le token
  jwt.verify(token, secret, (err, decoded) => {
    if (err) {// si erreur retournez à la page de connexion
      return res.redirect('/login');
    }

    // Le token est valide, vous pouvez passer à l'étape suivante
    req.username = decoded.username;
    next();
  });
}

// Exemple d'utilisation du middleware à ajouter aux routes
app.get('/protected', verifyToken, (req, res) => {
  // Accès autorisé uniquement si le token est valide
  res.json({ message: 'Accès autorisé', username: req.username });
});



