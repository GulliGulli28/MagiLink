const { profile_id_from_user } = require("./profile");
const { User, Profile, Ville, Interaction, connectToDatabase, dbis, sync } = require('./db.js');
const { Op, QueryTypes } = require('sequelize');

async function pick(uid) {
    console.log("voici l'uid : " + uid);
    const {profile_id_from_user} = require('../js/profile.js');

    //const pid = await profile_id_from_user(uid);
    const pid =81;
    console.log("ON a le PID", pid);
    const query = `
        SELECT Ville.ville_longitude_deg, Ville.ville_latitude_deg
        FROM Ville
        INNER JOIN Profile ON Profile.ville = Ville.ville_nom_reel
        WHERE Profile.pid = :pid
    `;
    const coord = await dbis.query(query, {
        replacements: {
            pid
        },
        type: QueryTypes.SELECT
    });
    const { ville_longitude_deg: longitude, ville_latitude_deg: latitude } = coord[0];

    const range = getRange(latitude, longitude, pid);

    const profUncomplete = await getProfileWithIncompleteInteraction(pid);

    let finalresult;

    if (profUncomplete.length < 10) {
        const newProfiles = await getProfileInMyRange(range, 10 - profUncomplete.length);
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
        finalresult = newProfiles.concat(profUncomplete.map(profile => profile.pid));
    } else {
        finalresult = profUncomplete.slice(0, 10).map(profile => profile.pid);
    }

    return Profile.findAll({
        where: {
            pid: finalresult
        }
    });
}

async function getProfileWithIncompleteInteraction(pid) {
    const query = `
        SELECT Profile.pid
        FROM Profile
        INNER JOIN Interaction ON Profile.pid = Interaction.id1
        WHERE Interaction.id1 = :pid
        AND Interaction.res1 = '';
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
        AND Interaction.res2 = '';
    `;
    const profiles2 = await dbis.query(query2, {
        replacements: {
            pid
        },
        type: QueryTypes.SELECT
    });
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

function deg2rad(deg) {
    return deg * (Math.PI / 180);
}

function km2rad(km) {
    const earthRadiusKm = 6371;
    return km / earthRadiusKm;
}

function getRange(latitude, longitude, distanceInKm) {
    const range = {
        minLat: latitude - km2rad(distanceInKm),
        maxLat: latitude + km2rad(distanceInKm),
        minLon: longitude - km2rad(distanceInKm) / Math.cos(deg2rad(latitude)),
        maxLon: longitude + km2rad(distanceInKm) / Math.cos(deg2rad(latitude))
    };

    return range;
}


async function main() {
    await connectToDatabase();
    const profiles = await pick(22);
    console.log(profiles);
  }
  
  main();
