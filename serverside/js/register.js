const { where } = require('sequelize');
const {dbis,User} = require('./db.js'); 
const crypto = require('crypto');

//Securisation de l'entrée de l'utilisateur
function secure(input){
    return input;
}

async function register(valide_input){
    psd = crypto.createHash('sha256').update(valide_input.password).digest('hex');
    try {
        let user = await User.findOne({where: { username : valide_input.username}});
        if (user == null){
            user = await User.create({username: valide_input.username, pswd: psd, login: valide_input.mail});
            console.log("user created");
            return true;
        } else {
            console.log("user already exists");
            return false;
        }
    } catch (error) {
        console.error(error);
        return false;
    }
}

module.exports = { secure, register};