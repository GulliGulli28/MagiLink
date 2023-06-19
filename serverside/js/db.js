const fs = require('fs');
const crypto = require('crypto');
const {Sequelize,DataTypes} = require('sequelize');

const dbis = new Sequelize('magilink', 'magilink_server', 'b/U4+Vru$*K685Aah%ZW^5z8', {
    host: 'localhost',
    dialect: 'mysql',
    logging: console.log,
});

console.log = (msg) => {
    let num = 0;
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1; // Adding 1 to get the month as a 1-based index
    const date = currentDate.getDate();
    const path = "../logs/" + year + month + date + "-" + num +".log";
    console.error(path);
    while(fs.existsSync(path)){
        if (fs.statSync(path).size > 1000000){
            num++;
            path = "../logs/" + year + month + date + "-" + num +".log";
        }
        else {
            break;
        }
    }
    fs.appendFile(path, msg, err => { console.error(err) });
}

console.error = (msg) => {
    let num = 0;
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1; // Adding 1 to get the month as a 1-based index
    const date = currentDate.getDate();
    const path = "../errors/" + year + month + date + "-" + num +".log";
    while(fs.existsSync(path)){
      if (fs.statSync(path).size > 1000000){
          num++;
          path = "../errors/" + year + month + date + "-" + num +".log";
      }
      else {
          break;
      }
    }
    fs.appendFile(path, msg, err => { console.error(err) });
}

//Connexion
async function connect(){
    dbis.authenticate()
    .then(() => {
        console.log('Connection has been established successfully.');
    })
    .catch((error) => {
        console.error('Unable to connect to the database:', error);
    });
}

async function disconnect(){
    dbis.close()
    .then(() => {
        console.log('Connection has been closed successfully.');
    })
    .catch((error) => {
        console.error('Unable to close the database:', error);
    });
}

async function sync(){
    dbis.sync({alter: true})
    .then(() => {
        console.log('Tables synced');
    })
    .catch((error) => {
        console.error('Unable to sync tables:', error);
    });
}


//Création des modeles des tables
const Channel = dbis.define('Channel',{
    id : {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    name : {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    purpose : {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    profiles : {
        type: DataTypes.TEXT,
        allowNull: true,
    },
}, {freezeTableName: true});

const House = dbis.define('House',{
    name : {
        type: DataTypes.STRING(255),
        allowNull: false,
        primaryKey: true,
    },
    channel : {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    rewards : {
        type: DataTypes.JSON,
        allowNull: true,
    },
}, {freezeTableName: true});

const Message = dbis.define('Message', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    content: {
      type: DataTypes.TEXT,
    },
    channel: {
      type: DataTypes.INTEGER,
    },
    date: {
      type: DataTypes.DATE,
    },
}, {freezeTableName: true});

const User = dbis.define('User', {
    idp : {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    username: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    pswd : {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    login : {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    channels : {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    current_city : {
        type: DataTypes.STRING(64),
        allowNull: true,
    },
    interactions : {
        type: DataTypes.JSON,
        allowNull: true,
    },
}, {freezeTableName: true});

const Profile = dbis.define('Profile', {
    pid: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nom: {
      type: DataTypes.STRING(255),
    },
    prenom: {
      type: DataTypes.STRING(255),
    },
    dob: {
      type: DataTypes.DATEONLY,
    },
    ville: {
      type: DataTypes.STRING(255),
    },
    maison: {
      type: DataTypes.STRING(255),
    },
    genre: {
      type: DataTypes.STRING(255),
      set(value) {
        // Perform encryption logic for the 'genre' column here
        this.setDataValue('genre', value);
      },
      get() {
        // Perform decryption logic for the 'genre' column here
        return this.getDataValue('genre');
      },
    },
    settings: {
      type: DataTypes.JSON,
    },
    bio: {
      type: DataTypes.TEXT,
    },
  }, {freezeTableName: true});

//Relations
//Profil - Maison
Profile.hasOne(House, {foreignKey: 'name'});
House.belongsTo(Profile, {foreignKey: 'name'});
//Channel - Message
Message.hasOne(Channel, { foreignKey: 'channel' });
Channel.belongsTo(Message, { foreignKey: 'channel' });
//Channel - House
House.hasOne(Channel, { foreignKey: 'channel' });
Channel.belongsTo(House, { foreignKey: 'channel' });
//Profil - User
User.hasOne(Profile, { foreignKey: 'userId' });
Profile.belongsTo(User, { foreignKey: 'userId' });

async function getUsers(){
  try {
    const users = await User.findAll();
    return users;
  }
  catch (error) {
    console.error(error);
  }
}

async function checkUser(login,password){
  const compare_pwd = crypto.createHash('sha256').update(password).digest('hex');
  try {
    const users = await User.findAll({
      where: {
        login: login,
        pswd: compare_pwd
      }
    });
    if (users.length == 0) {
      return 2;
    }
    else if (users.length == 1) {
      return 1;
    }
    else {
      return 0;
    }
  }
  catch (error) {
    console.error(error);
  }
}

async function checkUser_availability(login){
  try {
    const users = await User.findAll({
      where: {
        login: login
      }
    });
    if (users.length == 0) {
      return 1;
    }
    else {
      return 0;
    }
  }
  catch (error) {
    console.error(error);
  }
}

async function createUser(user){
  try {
    User.create(user);
  }
  catch{
    console.error(error);
  }
}

module.exports = { connect, disconnect, sync, Channel, House, Message, User, Profile, getUsers, checkUser, checkUser_availability, createUser};