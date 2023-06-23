const {Profile,User,Message,Channel} = require('./db.js');
const { Op } = require("sequelize");

async function getMessages_byChannel(channelId){
    try{
    let messages = await Message.findAll({
    where: {
      channel: channelId
    },
    order: [
        ['createdAt', 'ASC']
    ]
    });
    return messages;
    }catch(err){
        console.log(err);
    }
}

async function getChannels_byUser(user_id){
    try{
    let profile = await User.findOne({
        where: {
            idp: user_id
        },
        attributes: ['pid']
    });
    let channels = await Channel.findAll({
    where: {
        profiles:{
            [Op.or]: [
                { [Op.like]: profile.pid+'%' },
                { [Op.like]: '%'+profile.pid }
            ]
        },
        purpose : 1
    }
    });
    return channels;
    }catch(err){
        console.log(err);
    }
}

async function setMessage(authorId, channelId, content, date){
    try{
    let message = await Message.create({
        author: authorId,
        channel: channelId,
        content: content,
        date: date
    })
    return message;
    }catch(err){
        console.log(err);
    }
}

async function create_Channel(user1,user2){
    try{
    let profiles_id = await User.findAll({
        where: {
            idp: { [Op.or]: [user1,user2] }
        },
        attributes: ['pid']
    });
    let names = await Profile.findAll({
        where: {
            pid: { [Op.or]: [profiles_id[0].pid,profiles_id[1].pid] }
        },
        attributes: ['prenom']
    });
    let channel = await Channel.create({
        name: names[0].prenom+" & "+names[1].prenom,
        purpose: 1,
        profiles: profiles_id[0].pid.toString()+profiles_id[1].pid.toString()
    })
    return channel;
    }catch(err){
        console.log(err);
        return null;
    }
}

async function getUsers_by_channel(channelId,pid){
    try{
        let channel = await Channel.findOne({
            where: {
                id: channelId,
                purpose : 1
            },
            attributes: ['profiles']
        });
        let autre = channel.profiles.replace(pid,'');
        let profiles = await Profile.findOne({
            where: {
                pid: autre
            },
            attributes: ['prenom']
        });
        let profile = await Profile.findOne({
            where: {
                pid: pid
            },
            attributes: ['prenom']
        });
        return {autre : profiles.prenom, moi :profile.prenom};
    }catch(err){
        console.error(err);
    }
}

async function format_messages(messages){
    try{
        let realmessage = []
        messages.forEach(async(element) => {
          const users = await getUsers_by_channel(element.channel, element.author);
          realmessage.push({ "userid": element.author,"date" : element.date, "content": element.content, "autre" : users });
        });
        
        return realmessage;
    }
    catch(err){
        console.error(err);
    }
}


    
module.exports = { getMessages_byChannel, getChannels_byUser, setMessage, create_Channel,getUsers_by_channel,format_messages };

