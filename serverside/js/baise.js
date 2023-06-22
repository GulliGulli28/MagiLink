const { profile_id_from_user } = require("./profile");
const { User, Profile, Ville, Interaction, connectToDatabase, dbis, sync } = require('./db.js');
const { Op, QueryTypes, Sequelize } = require('sequelize');

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
    const profUncomplete = await getProfileWithIncompleteInteraction(pid);

    let finalresult;

    if (profUncomplete.length < 10) {
        const newProfiles = await getProfileInMyRange(range, 100);

        for (const profile of newProfiles) {
            const test = await Interaction.findOne({
                where: {
                    id1: pid,
                    id2: profile.pid
                }
            })
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
        getThefirst10(newProfiles, pid);
        finalresult = newProfiles.concat(profUncomplete.map(profile => profile.pid));
    } else {
        finalresult = profUncomplete.slice(0, 10).map(profile => profile.pid);
    }
    let theFinalResult = [];
    for (r in finalresult) {
        let theResult = await Profile.findAll({
            where: {
                pid: r
            }
        });
        theFinalResult = theFinalResult.concat(theResult);
    }
    //console.log("Final Result",theFinalResult);
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

async function getThefirst10(res, pid) {
    console.log("voici res", res);
    var resu = [];
    for (let i = 0; i < res.length; i++) {
        resu.push(res[i].pid);
    }
    console.log("voici resu", resu);
    console.log("on est dans la fonction getThefirst10");
    // Déclaration des variables
    var aff = await Profile.findOne({ where: { pid: pid }, attributes: ['affinity'] });
    console.log("aff", aff);
    console.log("aff final", aff.affinity.final.Gryffondor);
    // Stockage des variables et de leurs valeurs initiales dans un tableau d'objets
    var variables = [
        { nom: "Gryffondor", valeur: aff.affinity.final.Gryffondor },
        { nom: "Serdaigle", valeur: aff.affinity.final.Serdaigle },
        { nom: "Serpentard", valeur: aff.affinity.final.Serpentard },
        { nom: "Poufsouffle", valeur: aff.affinity.final.Poufsouffle }
    ];
    console.log(variables);

    // Tri du tableau d'objets dans l'ordre décroissant en utilisant la valeur
    variables.sort(function (a, b) {
        return b.valeur - a.valeur;
    });

    // Affichage de l'ordre décroissant des variables par rapport à leur position initiale
    console.log("Ordre décroissant :");
    for (var i = 0; i < variables.length; i++) {
        console.log(variables[i].nom + ": " + variables[i].valeur);
    }
    var listeParMaison = [];
    await Profile.findAll({
        where: {
            maison: {
                [Sequelize.Op.in]: [variables[0].nom, variables[1].nom, variables[2].nom, variables[3].nom]
            },
            pid: {
                [Sequelize.Op.in]: resu
            }
        },
        attributes: ['pid'],
        order: [
            [Sequelize.literal(`FIELD(maison, '${variables[0].nom}', '${variables[1].nom}', '${variables[2].nom}', '${variables[3].nom}')`)]
        ]
    })
        .then(instances => {
            if (instances.length > 0) {
                instances.forEach(instance => {
                    listeParMaison.push(instance.pid);
                });
            } else {
                console.log("Aucune instance trouvée");
            }
        })
        .catch(err => {
            console.error('Erreur lors de la recherche des instances :', err);
        });
    console.log("liste par maison", listeParMaison);
    
}

const profiles = pick(22)
console.log(profiles);