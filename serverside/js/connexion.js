const {User} = require('./db.js');
const Op = require('sequelize').Op;
const crypto = require('crypto');

//Securisation de l'entrée de l'utilisateur

function secure(input){
    return input;
}

async function trylogin(valide_input){
    console.log(valide_input);
    psd = crypto.createHash('sha256').update(valide_input.password).digest('hex');
    try {
        const user = await User.findOne({where: { [Op.or]: [{username : valide_input.username}, {login: valide_input.username}], pswd: psd}});
        if (user != null){
            console.log("user found");
            return true;
        } else {
            console.log("user not found");
            return false;
        }
    }
    catch (error) {
        console.error(error);
        return false;
    }
}



module.exports = { secure, trylogin };