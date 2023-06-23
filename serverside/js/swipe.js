const { profile_id_from_user } = require("./profile");
const { User, Profile, Ville, Interaction, connectToDatabase, dbis, sync } = require('./db.js');
const { Op, QueryTypes, Sequelize } = require('sequelize');

// Fonction qui retourne 10 profiles complet  à l'utilsateru il faut coompé niveau client
async function pick(uid) {
    const pid = await profile_id_from_user(uid);
    const query = `
        SELECT ville_france_free.ville_longitude_deg, ville_france_free.ville_latitude_deg
        FROM ville_france_free
        INNER JOIN Profile ON Profile.ville = ville_france_free.ville_id
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
    const profUncomplete = await getProfileWithIncompleteInteraction(uid);

    let finalresult;

    if (profUncomplete.length < 10) {
        const newProfiles = await getProfileInMyRange(range, 100);

        getThefirst10(newProfiles, pid, uid, 10 - profUncomplete.length);
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
    return theFinalResult;
}

async function getProfileWithIncompleteInteraction(uid) {
    const query = `
        SELECT Interaction.id2
        FROM Interaction
        INNER JOIN User ON Interaction.id1 = User.idp
        WHERE Interaction.id1 = :uid
        AND Interaction.res1 is null;
    `;
    const profiles = await dbis.query(query, {
        replacements: {
            uid
        },
        type: QueryTypes.SELECT
    });
    const query2 = `
        SELECT Interaction.id1
        FROM Interaction
        INNER JOIN User ON Interaction.id2 = User.idp
        WHERE Interaction.id2 = :uid
        AND Interaction.res2 is null;
    `;
    const profiles2 = await dbis.query(query2, {
        replacements: {
            uid
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

function getRange(latitude, longitude, ) {
    const distanceInKm = 1000000000000;
    const range = {
        minLat: latitude - km2rad(distanceInKm),
        maxLat: latitude + km2rad(distanceInKm),
        minLon: longitude - km2rad(distanceInKm) / Math.cos(deg2rad(latitude)),
        maxLon: longitude + km2rad(distanceInKm) / Math.cos(deg2rad(latitude))
    };

    return range;
}

async function getThefirst10(res, pid, uid, nb) {
    var resu = [];
    for (let i = 0; i < res.length; i++) {
        resu.push(res[i].pid);
    }
    // Déclaration des variables
    var aff = await Profile.findOne({ where: { pid: pid }, attributes: ['affinity'] });
    // Stockage des variables et de leurs valeurs initiales dans un tableau d'objets
    var variables = [
        { nom: "Gryffondor", valeur: aff.affinity.final.Gryffondor },
        { nom: "Serdaigle", valeur: aff.affinity.final.Serdaigle },
        { nom: "Serpentard", valeur: aff.affinity.final.Serpentard },
        { nom: "Poursouffle", valeur: aff.affinity.final.Poufsouffle }
    ];

    // Tri du tableau d'objets dans l'ordre décroissant en utilisant la valeur
    variables.sort(function (a, b) {
        return b.valeur - a.valeur;
    });

    // Affichage de l'ordre décroissant des variables par rapport à leur position initiale
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
    var associatedIds1 = null;
    var associatedIds2 = null;
    associatedIds1 = await getAssociatedIds1(pid);
    associatedIds2 = await getAssociatedIds2(pid);
    if (associatedIds2.length == 0 && associatedIds1.length == 0) {
        var idAban = associatedIds1.concat(associatedIds2);
    } else if (associatedIds1.length == 0) {
        var idAban = associatedIds2;
    } else if (associatedIds2.length == 0) {
        var idAban = associatedIds1;
    } else {
        var idAban = [];
    }
    var idban=[]
    for (let i = 0; i < idAban.length; i++) {
        idban.push(User.findOne({ where: { pid: idAban[i] }, attributes: ['idp'] }).idp);
    }
    idAban.push(pid);
    var resultat = listeParMaison.filter(element => !idAban.includes(element));
    
    resultat = resultat.slice(0, nb);
    var truc =[]
    for (let i = 0; i < resultat.length; i++) {
        truc.push(await User.findOne({ where : { pid: resultat[i]}, attributes: ['idp'] }));
    }
    for (let i = 0; i < resultat.length; i++) {
        const userData = {
            id1: uid,
            id2: truc[i].idp,
            res1: null,
            res2: null,
            state: null
        };
        try{
        await Interaction.create(userData);
        }catch(err){
            console.log(err);
        }
    }
    return resultat;
}

async function getAssociatedIds2(uid){
    try {
        const interactions = await Interaction.findAll({
            where: {
                id2: uid,
            },
            attributes: ['id1'],
            raw: true,
        });

        const associatedIds2 = interactions.map((interaction) => interaction.id1);
        return associatedIds2;
    } catch (error) {
        // Gérer les erreurs de requête
        console.error('Une erreur s\'est produite lors de la récupération des ID associés :', error);
        throw error;
    }
};

async function getAssociatedIds1(pid){
    try {
        const interactions = await Interaction.findAll({
            where: {
                id1: pid,
            },
            attributes: ['id2'],
            raw: true,
        });

        const associatedIds1 = interactions.map((interaction) => interaction.id2);
        return associatedIds1;
    } catch (error) {
        // Gérer les erreurs de requête
        console.error('Une erreur s\'est produite lors de la récupération des ID associés :', error);
        throw error;
    }
};


//const profiles = pick(1);

//fonction pour like
//res=1 pour like
//res=0 pour dislike
//res=null pour absence de réponses
async function like(pid, uidPerso) {
    try {
        const other = await User.findOne({ where: { pid: pid }, attributes: ['idp'] });
        const uidOther = other.idp;
        const up1 = Interaction.update(
            { res1: 1 }, // Les valeurs à mettre à jour
            {
                where: {
                    id1: uidPerso,
                    id2: uidOther,
                },
            }
        );
        await up1;
        const up2 = Interaction.update(
            { res2: 1 }, // Les valeurs à mettre à jour
            {
                where: {
                    id1: uidOther,
                    id2: uidPerso,
                },
            }
        );
        await up2;
    } catch (error) {
        console.error('Erreur lors de la mise à jour :', error);
    }
}

//fonction pou dislike
async function dislike(pid, uidPerso) {
        try {
            const other = await User.findOne({ where: { pid: pid }, attributes: ['idp'] });
            const uidOther = other.idp;
            const up1 = Interaction.update(
                { res1: 0 }, // Les valeurs à mettre à jour
                {
                    where: {
                        id1: uidPerso,
                        id2: uidOther,
                    },
                }
            );
            await up1;
            const up2 = Interaction.update(
                { res2: 0 }, // Les valeurs à mettre à jour
                {
                    where: {
                        id1: uidOther,
                        id2: uidPerso,
                    },
                }
            );
            await up2;
        } catch (error) {
            console.error('Erreur lors de la mise à jour :', error);
        }
    }


module.exports = {like, dislike,pick};

