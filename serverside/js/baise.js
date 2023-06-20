const { profile_id_from_user } = require("./profile");
const { User, Profile } = require('./db.js');
const { Op } = require('sequelize');


// Utilisation de la fonction avec une pagination de taille 10 et à la page 1
const pageSize = 10;
const currentPage = 0;

async function getProfilesWithPagination(pageSize, currentPage, uid) {
    const profilePid = profile_id_from_user(uid);
    const { ville_x: villeX, ville_y: villeY, distance, affinite } = await Profile.findOne({ profilePid: profilePid });

    const profileSubquery = Profile.findAll({
        attributes: ['pid'],
        where: {
            pid: {
                [Op.ne]: profilePid
            },
            ville_x: {
                [Op.between]: [villeX - distance, villeX + distance]
            },
            ville_y: {
                [Op.between]: [villeY - distance, villeY + distance]
            },
            affinite: affinite
        }
    });

    const userSubquery = User.findAll({
        attributes: ['pid'],
        include: [
            {
                model: Interaction,
                where: {
                    pid: {
                        [Op.ne]: profilePid
                    }
                },
                required: false
            }
        ]
    });

    const { rows, count } = await Profile.findAndCountAll({
        attributes: ['pid'],
        where: {
            pid: {
                [Op.in]: Sequelize.literal(`(${profileSubquery}) UNION (${userSubquery})`)
            }
        },
        limit: pageSize,
        offset: (currentPage - 1) * pageSize
    });

    return { profiles: rows.map(row => row.pid), totalCount: count };
}


async function pick(uid) {
    // On récupère les profils des personnes sélectionné mais pas jugé
    const profUncomplete = pickFromJSON(uid);

    // On récupère les profils des personnes qui nous ont jugé
    const profFromOther = pickFromOther(uid);

    // Si la somme des profiles est supérieur à 10 on prend 5 profils pas jugé et 5 profils qui nous ont jugé
    if (profUncomplete.lenght + profFromOther.lenght > 10) {
        profUncomplete = profUncomplete.slice(0, 5);
        profFromOther = profFromOther.slice(0, 5);
    }
    else if (profUncomplete.lenght + profFromOther.lenght < 10){    // Si la somme des profiles est inférieur à 10 on sélectionne des profils supplémentaire
        const result = await getProfilesWithPagination(10 - profFromOther + profUncomplete, currentPage, uid);
    }
    // On ajoute les interactions pour les potentiels nouveaux sélectionné côté other
    for (user in result) {
        User.update(
            {
                interactions: Sequelize.literal(`interactions || '[{"id1": ${uid}, "id2": ${user.uid}, "res1": "", "res2": "", "state": "undefined"}]'`),
            },
            {
                where: {
                    [Op.eq]: [{ uid: user.uid }]
                },
            }
        );// On ajoute les interactions pour les potentiels nouveaux sélectionné côté utilisateur
        User.update(
            {
                interactions: Sequelize.literal(`interactions || '[{"id1": ${user.uid}, "id2": ${uid}, "res1": "", "res2": "", "state": "undefined"}]'`),
            },
            {
                where: {
                    [Op.eq]: [{ uid: uid }],
                }
            }
        )
    }
    // Concaténer les id des profils à envoyé
    const finalresult = profUncomplete.concat(profFromOther);
    finalresult = finalresult.concat(result);

    // On retourne les profils complets sélectionné
    User.findAll({
        where: {
            uid: uid
        }
    })
        .then((result) => {
            console.log(result);
            return result;
        })
        .catch((error) => {
            // Gestion des erreurs
            console.error(error);
        });
}

async function pickFromJSON(uid) {
    User.findAll({
        attributes: ['interactions.id1'], // Sélectionnez uniquement la colonne 'id1' de 'interactions'
        where: {
          interactions: {
            [Op.contains]: [
              {
                state: 'undefined',
                res1: '',
                id1: uid
              }
            ]
          }
        }
      })
        .then((result) => {
          // Récupérez les valeurs des 'id1' dans le résultat
          const id1Values = result.map((item) => item.interactions.id1);
          console.log(id1Values);
        })
        .catch((error) => {
          // Gestion des erreurs
          console.error(error);
        });
      
}

async function pickFromOther(uid) {
    try {
      const result = await User.findAll({
        attributes: ['interactions.id2'], // Sélectionnez uniquement la colonne 'id2' de 'interactions'
        where: {
          interactions: {
            [Op.contains]: [
              {
                state: 'undefined',
                res2: '',
                id2: uid
              }
            ]
          }
        }
      });
  
      // Récupérez les valeurs des 'id2' dans le résultat
      const id2Values = result.map((item) => item.interactions.id2);
      console.log(id2Values);
    } catch (error) {
      // Gestion des erreurs
      console.error(error);
    }
  }