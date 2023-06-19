const {connect, disconnect, checkUser} = require('./db.js');

//Securisation de l'entrée de l'utilisateur

function secure(input){
    return input;
}

function trylogin(valide_input){
    //On vérifie que le nom d'utilisateur existe dans la base de donnée
    //On vérifie que le mot de passe correspond à celui de la base de donnée
    //On renvoie true si les deux conditions sont remplies, false sinon
    connect();
    checkUser(valide_input.username, valide_input.password);
    disconnect();
}



module.exports = { secure, trylogin };