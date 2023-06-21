const { profile_id_from_user } = require("./profile");
const { User, Profile } = require('./db.js');
const { Op, QueryTypes } = require('sequelize');


async function getProfilesWithPagination(uid, range) {
    
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
    else if (profUncomplete.lenght + profFromOther.lenght < 10) {    // Si la somme des profiles est inférieur à 10 on sélectionne des profils supplémentaire
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

async function getProfileInMyRange(range, nbProfile) {
  const { minLat, maxLat, minLon, maxLon } = range;
  const query = `
    SELECT Profile.pid
    FROM Profile
    INNER JOIN Ville ON Profile.ville = Ville.ville_nom_reel
    WHERE Ville.ville_latitude_deg BETWEEN :minLat AND :maxLat
    AND Ville.ville_longitude_deg BETWEEN :minLon AND :maxLon
    LIMIT :nbProfile;
  `;
  const profiles = await dbis.query(query, {
    replacements: {
      minLat,
      maxLat,
      minLon,
      maxLon,
      nbProfile
    },
    type: QueryTypes.SELECT
  });
  return profiles;
}


// Fonction pour convertir des degrés en radians
function deg2rad(deg) {
    return deg * (Math.PI / 180);
}

// Fonction pour convertir des kilomètres en radians
function km2rad(km) {
    const earthRadiusKm = 6371;  // Rayon moyen de la Terre en kilomètres
    return km / earthRadiusKm;
}

// Fonction pour obtenir la plage autour d'un point
function getRange(latitude, longitude, distanceInKm) {
    const range = {
        minLat: latitude - km2rad(distanceInKm),
        maxLat: latitude + km2rad(distanceInKm),
        minLon: longitude - km2rad(distanceInKm) / Math.cos(deg2rad(latitude)),
        maxLon: longitude + km2rad(distanceInKm) / Math.cos(deg2rad(latitude))
    };

    return range;
}  