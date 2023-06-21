const jwt = require('jsonwebtoken');
const sanitizeHtml = require('sanitize-html');

function identify_by_cookie(cookies,secret){
    if (cookies.token){
        const decoded = jwt.verify(cookies.token, secret);
        return decoded.key
    }
    return false;
}

function secure(input){    
    for (let key in input)
        if (typeof input[key] === 'string'){
          input[key] = sanitizeHtml(input[key]).replace(/[.*+?^${}=`()|[\]\\]/g, '\\$&');
        }
    return input;
}

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
// app.get('/protected', verifyToken, (req, res) => {
//   // Accès autorisé uniquement si le token est valide
//   res.json({ message: 'Accès autorisé', username: req.username });
// });



module.exports = { identify_by_cookie, secure, verifyToken};