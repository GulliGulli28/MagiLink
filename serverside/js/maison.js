const {Profile} = require('./db.js');


function sort_house(values){
    var part1 = values[0];
    var part2 = values[1];
    var part3 = values[2];
    var total = [0,0,0,0,0,0]
    var scores = {
        "Gryffondor": 0,
        "Serdaigle": 0,
        "Poufsouffle": 0,
        "Serpentard": 0
    };
    for (var i = 0; i < 6 ; i++){
        total[i] = part1[i] + part2[i]*1.5 + part3[i]*2;
    }
    scores.Gryffondor = (total[0] + total[1] + total[2])/(27+32+34); // 93
    scores.Serdaigle = (total[1] + total[3] + total[5])/(32+30+34); // 96
    scores.Poufsouffle = (total[0] + total[3] + total[4])/(27+30+32); // 89
    scores.Serpentard = (total[2] + total[4] + total[5])/(34+32+34); // 100
    max = Math.max(scores.Gryffondor, scores.Serpentard, scores.Poufsouffle, scores.Serdaigle);
    return (scores, max); // max = maison de la personne
}

async function set_house(profile_id){
    try {
        const profile = await Profile.findOne({where: {pid : profile_id}});
        if (profile.maison == null){
            console.log("house not setuped yet");
            const {scores, max} = sort_house(values);
            profile.affinity = scores
            if (max == scores.Gryffondor){
                profile.maison = "Gryffondor";
            }
            else if (max == scores.Serdaigle){
                profile.maison = "Serdaigle";
            }
            else if (max == scores.Poufsouffle){
                profile.maison = "Poufsouffle";
            }
            else if (max == scores.Serpentard){
                profile.maison = "Serpentard";
            }
            await profile.save();
            return true;
        }
        return false;
    }
    catch (error) {
        console.error(error);
        return false;
    }
}

module.exports = { set_house , sort_house};