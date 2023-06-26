const fs = require('fs');
const crypto = require('crypto');
const { Sequelize, DataTypes } = require('sequelize');

const dbis = new Sequelize('magilink', 'magilink_server', 'b/U4+Vru$*K685Aah%ZW^5z8', {
  host: 'localhost',
  dialect: 'mysql',
  logging: console.log,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
});

// console.log = (msg) => {
//     let num = 0;
//     const currentDate = new Date();
//     const year = currentDate.getFullYear();
//     const month = currentDate.getMonth() + 1; // Adding 1 to get the month as a 1-based index
//     const date = currentDate.getDate();
//     const path = "../logs/" + year + month + date + "-" + num +".log";
//     console.error(path);
//     while(fs.existsSync(path)){
//         if (fs.statSync(path).size > 1000000){
//             num++;
//             path = "../logs/" + year + month + date + "-" + num +".log";
//         }
//         else {
//             break;
//         }
//     }
//     fs.appendFile(path, msg, err => { console.error(err) });
// }

// console.error = (msg) => {
//     let num = 0;
//     const currentDate = new Date();
//     const year = currentDate.getFullYear();
//     const month = currentDate.getMonth() + 1; // Adding 1 to get the month as a 1-based index
//     const date = currentDate.getDate();
//     const path = "../errors/" + year + month + date + "-" + num +".log";
//     while(fs.existsSync(path)){
//       if (fs.statSync(path).size > 1000000){
//           num++;
//           path = "../errors/" + year + month + date + "-" + num +".log";
//       }
//       else {
//           break;
//       }
//     }
//     fs.appendFile(path, msg, err => { console.error(err) });
// }

//Connexion

async function sync() {
  dbis.sync({ force: true })
    .then(() => {
      console.log('Tables synced');
    })
    .catch((error) => {
      console.error('Unable to sync tables:', error);
    });
}

//Création des modeles des tables
const Channel = dbis.define('Channel', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  purpose: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  profiles: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, { freezeTableName: true });

const House = dbis.define('House', {
  name: {
    type: DataTypes.STRING(255),
    allowNull: false,
    primaryKey: true,
  },
  channel: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  rewards: {
    type: DataTypes.JSON,
    allowNull: true,
  },
}, { freezeTableName: true });

const Message = dbis.define('Message', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  author: {
    type: DataTypes.INTEGER,
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
}, { freezeTableName: true });

const User = dbis.define('User', {
  idp: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  username: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  pid: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  pswd: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  login: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  channels: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  current_city: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: true,
  },
  interactions: {
    type: DataTypes.JSON,
    allowNull: true,
  },
}, { freezeTableName: true });

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
    type: DataTypes.INTEGER.UNSIGNED,
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
  affinity: {
    type: DataTypes.JSON,
  },
  meet_picture: {
    type: DataTypes.BLOB,
  },
  commu_picture: {
    type: DataTypes.BLOB,
  },
}, { freezeTableName: true });

const Interaction = dbis.define('Interaction', {
  id1: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
    references: {
      model: User,
      key: 'idp'
    }
  },
  id2: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
    references: {
      model: User,
      key: 'idp'
    }
  },
  res1: {
    type: DataTypes.BOOLEAN,
    allowNull: true
  },
  res2: {
    type: DataTypes.BOOLEAN,
    allowNull: true
  },
  state: {
    type: DataTypes.INTEGER,
    allowNull: true
  }
}, {
  freezeTableName: true,
  timestamps: true
});

const Ville = dbis.define('ville_france_free', {
  ville_id: {
    type: DataTypes.INTEGER.UNSIGNED,
    primaryKey: true,
    autoIncrement: true,
  },
  ville_departement: {
    type: DataTypes.STRING(3),
    allowNull: true,
  },
  ville_nom_simple: {
    type: DataTypes.STRING(45),
    allowNull: true,
  },
  ville_nom_reel: {
    type: DataTypes.STRING(45),
    allowNull: true,
  },
  ville_code_postal: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  ville_surface: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  ville_longitude_deg: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  ville_latitude_deg: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
}, {
  freezeTableName: true,
  timestamps: true
});

//Relations
//Profil - Maison
//Profile.hasOne(House, { foreignKey: 'name' });
Profile.belongsTo(House, {
  foreignKey: 'maison',
  onDelete: 'SET NULL',
  onUpdate: 'CASCADE',
  constraints: true
});


//Channel - Message
Channel.hasOne(Message, { foreignKey: 'channel' });
//Message - Profile
Profile.hasOne(Message, { foreignKey: 'author' });
//Channel - House
Channel.hasOne(House, { foreignKey: 'channel', onDelete: 'SET NULL' });
//Profil - User
Profile.hasOne(User, { foreignKey: 'pid' });
// User - Interation
User.belongsToMany(User, { through: Interaction, foreignKey: 'id1', as: 'User1' });

User.belongsToMany(User, { through: Interaction, foreignKey: 'id2', as: 'User2' });
// User - Ville
User.belongsTo(Ville, {
  foreignKey: 'current_city',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
  constraints: true,
});

module.exports = { dbis, sync, Channel, House, Message, User, Profile, Interaction, Ville };
