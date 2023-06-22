const { User, Profile } = require("./db.js");
const Op = require("sequelize").Op;

//Securisation de l'entrée de l'utilisateur

async function trylogin(valide_input) {
  psd = valide_input.password;
  try {
    const user = await User.findOne({
      where: {
        [Op.or]: [
          { username: valide_input.username },
          { login: valide_input.username },
        ],
        pswd: psd,
      },
    });
    if (user != null) {
      console.log("user found");
      return user;
    } else {
      console.log("user not found");
      return false;
    }
  } catch (error) {
    console.error(error);
    return false;
  }
}

module.exports = { trylogin };
