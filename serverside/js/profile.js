const {User,Profile} = require('./db.js');
const crypto = require('crypto');

async function profile_id_from_user(valide_input){
    console.log(valide_input);
    try {
        const user = await User.findOne({where: {username : valide_input.username}});
        if (user.pid != null){
            console.log("profile found");
            return user.pid;
        } else {
            console.log("profile not found");
            return false;
        }
    }
    catch (error) {
        console.error(error);
        return false;
    }
}

async function set_profile_property(property, value, profile_id){
    try {
        const profile = await Profile.findOne({where: {id : profile_id}});
        profile[property] = value;
        await profile.save();
        return true;
    }
    catch (error) {
        console.error(error);
        return false;
    }
}

async function set_profile(valide_input, user_id){
    try {
        const g = crypto.createHash('sha256').update(valide_input.genre).digest('hex')
        const user = User.findOne({where: {id : user_id}});
        if (user.pid == null) {
            console.log("profile not setuped yet");
            const new_profile = Profile.create({nom: valide_input.nom, prenom: valide_input.prenom, dob: valide_input.birthdate, genre: g, ville: valide_input.ville, bio: valide_input.bio,meet_picture: photo_meet});
            user[pid] = new_profile[pid];
            user.save();
            console.log("profile created");
            return true;
        }
        else {
            console.log("profile found");
            return false;
        }                    
    }
    catch (error) {
        console.error(error);
        return false;
    }
}

async function check_if_data_is_null(property, profile_id){
    try {
        const profile = await Profile.findOne({where: {id : profile_id}});
        if (profile[property] == null){
            console.log("data is null");
            return true;
        } 
        else {
            console.log("data is not null");
            return false;
        }
    }
    catch (error) {
        console.error(error);
        return false;
    }
}

module.exports = {profile_id_from_user, set_profile_property, set_profile, check_if_data_is_null};


