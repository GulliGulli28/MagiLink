const { profile_id_from_user } = require("./profile");
const { User, Profile, Ville, Interaction, connectToDatabase, dbis, sync } = require('./db.js');
const { Op, QueryTypes } = require('sequelize');

async function pick(uid) {
    console.log("voici l'uid : " + uid);

    const pid = await profile_id_from_user(uid);
    console.log("ON a le PID", pid);
    const query = `
        SELECT villes_france_free.ville_longitude_deg, villes_france_free.ville_latitude_deg
        FROM villes_france_free
        INNER JOIN Profile ON Profile.ville = villes_france_free.ville_id
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
    console.log("voici la range : " + range);
    const profUncomplete = await getProfileWithIncompleteInteraction(pid);

    let finalresult;

    if (profUncomplete.length < 10) {
        console.log("il y a ",profUncomplete.length," profils incomplets donc inférieur à 10");
        const newProfiles = await getProfileInMyRange(range, 10 - profUncomplete.length);

        for (const profile of newProfiles) {
            const test = await Interaction.findOne({
                where: {
                    id1: pid,
                    id2: profile.pid
                }
            })
            console.log(test);
            if (test != undefined) {
                const query = `
                INSERT INTO Interaction (id1, id2, res1, res2, state)
                VALUES (:id1, :id2, NULL, NULL, NULL)
                `;
                const interaction = await dbis.query(query, {
                    replacements: {
                        id1: pid,
                        id2: profile.pid
                    },
                    type: QueryTypes.INSERT
                });
            }

        }
        finalresult = newProfiles.concat(profUncomplete.map(profile => profile.pid));
    } else {
        console.log("il y a ",profUncomplete.length," profils incomplets donc supérieur à 10");
        finalresult = profUncomplete.slice(0, 10).map(profile => profile.pid);
    }
    console.log(finalresult);
    console.log("SALUT JE SUIS LA<---------------------------------------------------------------------");
    let theFinalResult = [];
    for (r in finalresult) {
        let theResult = Profile.findAll({
            where: {
                pid: r
            }
        });
        console.log("voici le résult",r);
        theFinalResult=theFinalResult.concat(theResult);
    }
}

async function getProfileWithIncompleteInteraction(pid) {
    const query = `
        SELECT Profile.pid
        FROM Profile
        INNER JOIN Interaction ON Profile.pid = Interaction.id1
        WHERE Interaction.id1 = :pid
        AND Interaction.res1 = NULL;
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
        AND Interaction.res2 = NULL;
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
    INNER JOIN villes_france_free ON Profile.ville = villes_france_free.ville_id
    WHERE villes_france_free.ville_latitude_deg BETWEEN :minLat AND :maxLat
    AND villes_france_free.ville_longitude_deg BETWEEN :minLon AND :maxLon
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


const profiles = pick(22)
console.log(profiles);