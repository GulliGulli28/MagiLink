const {connect, disconnect, checkUser_availability,User,createUser} = require('./db.js'); 
const crypto = require('crypto');

//Securisation de l'entrée de l'utilisateur
function secure(input){
    return input;
}

//On vérifie que le nom d'utilisateur n'existe pas dans la base de donnée
function register(valide_input){
    //On vérifie que le nom d'utilisateur n'existe pas dans la base de donnée
    //On renvoie true si les deux conditions sont remplies, false sinon
    //valide input contient les champs pswd,login,channels,current_city,interactions
    connect();
    if (checkUser_availability(valide_input.username)){
        user = new User(crypto.createHash('sha256').update(valide_input.password).digest('hex'), valide_input.username, valide_input.email,null,null,null);
        createUser(user);
    }
    else {
        disconnect();
        return false;
    }
    disconnect();
    return true;
}

module.exports = { secure, register };