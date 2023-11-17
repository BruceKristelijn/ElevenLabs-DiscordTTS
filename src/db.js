const storage = require('node-persist');

const APIKEYPREFIX = "APIKEY-";

const HasApiKey = async function(userid){
    await storage.init();
    return (await storage.getItem(`${APIKEYPREFIX}${userid}`)) != undefined;
}

const SetApiKey = async function(userid, key){
    await storage.init();
    await storage.setItem(`${APIKEYPREFIX}${userid}`, key)
}

const GetApiKey = async function(userid){
    await storage.init();
    return await storage.getItem(`${APIKEYPREFIX}${userid}`)
}

module.exports = {
    HasApiKey: HasApiKey,
    SetApiKey: SetApiKey,
    GetApiKey: GetApiKey
}