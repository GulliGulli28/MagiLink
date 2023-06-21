const { profile_id_from_user } = require("./profile");
const { User, Profile, Ville, Interaction } = require('./db.js');
const { Op, QueryTypes } = require('sequelize');


async function pick(uid) {
    // on recup le pid à partir de l'uid
    const pid = profile_id_from_user(uid);

    // On récupère les coordonnées de sa ville
    const query = `
        SELECT Ville.ville_longitude_deg, Ville.ville_latitude_deg
        FROM Ville
        INNER JOIN Profile ON Profile.ville = Ville.ville_nom_reel
    `;
    const coord = await dbis.query(query, {
        replacements: {
            pid
        },
        type: QueryTypes.SELECT
    });
    const { longitude, latitude } = coord[0];

    // On récupère la range
    const range = getRange(latitude, longitude, pid);

    // On récupère les profils avec des intéraction incomplète côté utilisateur
    const profUncomplete = await getProfileWithIncompleteInteraction(uid);

    // On compte le nombre de profils avec des inté incomplète
    if (profUncomplete.lenght < 10) {
        const newProfiles = await getProfileInMyRange(range, 10 - profUncomplete.lenght);
        for (const profile of newProfiles) {
            const query = `
              INSERT INTO Interaction (id1, id2, res1, res2, state)
              VALUES (:id1, :id2, '', '', 'undefined')
            `;
            const interaction = await dbis.query(query, {
              replacements: {
                id1: pid,
                id2: profile.pid
              },
              type: QueryTypes.INSERT
            });
          }
          const finalresult = newProfiles.concat(profUncomplete);
    }
    else {// On cut pour avoir 10 profils
        const finalresult = profUncomplete.slice(0, 10);
    }

    // On retourne les profils complets sélectionné
    Profile.findAll({
        where: {
            pid: finalresult.pid
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

async function getProfileWithIncompleteInteraction(pid) {
    const query = `
        SELECT Profile.pid
        FROM Profile
        INNER JOIN Interaction ON Profile.pid = Interaction.id1
        WHERE Interaction.id1 = :pid
        AND Interaction.res1 = "";
    `;
    const profiles = await dbis.query(query, {
        replacements: {
            pid
        },
        type: QueryTypes.SELECT
    });
    const query2 = `
        SELECT Profile.pid
        FROM Profile
        INNER JOIN Interaction ON Profile.pid = Interaction.id2
        WHERE Interaction.id2 = :pid
        AND Interaction.res2 = "";
    `;
    const profiles2 = await dbis.query2(query2, {
        replacements: {
            pid
        },
        type: QueryTypes.SELECT
    });
    // On concatène les deux tableaux
    const finalresult = profiles.concat(profiles2);
    return finalresult;
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