const { User } = require("./db.js");
const sanitizeHtml = require("sanitize-html");

async function register(valide_input) {
  console.log(valide_input);
  psd = valide_input.password;
  try {
    let user = await User.findOne({
      where: { username: valide_input.username },
    });
    if (user == null) {
      user = await User.create({
        username: valide_input.username,
        pswd: psd,
        login: valide_input.mail,
      });
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

module.exports = { register };
