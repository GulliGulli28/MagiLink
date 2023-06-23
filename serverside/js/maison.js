const {Profile} = require('./db.js');

function from_string_to_tab(string){
    var tab = string.split(",");
    for (var i = 0; i < tab.length; i++){
        tab[i] = parseInt(tab[i]);
    }
    return tab;
}

function sort_house(values){
    var part1 = from_string_to_tab(values[0]);
    var part2 = from_string_to_tab(values[1]);
    var part3 = from_string_to_tab(values[2]);
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
    return {scores, max}; // max = maison de la personne
}

async function set_house(profile_id,value){
    try {
        const profile = await Profile.findOne({where: {pid : profile_id}});
        var values = [value.test_1, value.test_2, value.test_3]
        if (profile.maison == null){
            console.log("house not setuped yet");
            const {scores, max} = sort_house(values);
            profile.affinity= {test_1: value.test_1, test_2: value.test_2, test_3: value.test_3, final: scores}
            if (max == scores.Gryffondor){
                profile.maison = "Gryffondor";
            }
            else if (max == scores.Serdaigle){
                profile.maison = "Serdaigle";
            }
            else if (max == scores.Poufsouffle){
                profile.maison = "Poursouffle";
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

async function create_test_steps(profile_id,test_result){
    try {
        const profile = await Profile.findOne({where: {pid : profile_id}});
        if (profile.affinity == null){
            console.log("test_step_1 not setuped yet");
            profile.affinity =  {test_1 : test_result.tab};
            await profile.save();
            return true;
        }
        else if (profile.affinity.test_2 == null){
            console.log("test_step_2 not setuped yet");
            const affinity = profile.affinity;
            profile.affinity = {test_1: affinity.test_1, test_2: test_result.tab}
            await profile.save();
            return true;
        }
        else if (profile.affinity.test_3 == null){
            console.log("test_step_3 not setuped yet");
            profile.affinity = {test_1: profile.affinity.test_1, test_2: profile.affinity.test_2, test_3: test_result.tab}
            await profile.save();
            return profile.affinity;
        }
        return false;
    }
    catch (error) {
        console.error(error);
        return false;
    }
}
// return le prochain test a effectuer (on considère que si le 3 est fait alors c est que la maison est attribué et donc on n'appelerai pas cette fonction)
async function check_affinity(pid){
    try {
        const profile = await Profile.findOne({where: {pid : pid}});
        if (profile.affinity == null){
            return 1;
        }
        else if (profile.affinity.test_1 != null && profile.affinity.test_2 != null){
            return 3;
        }
        else if (profile.affinity.test_1 != null){
            return 2;
        }
    }
    catch (error) {
        console.error(error);
        return false;
    }
}

module.exports = { set_house , sort_house, create_test_steps, check_affinity};