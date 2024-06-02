
const mongoose = require("mongoose")

const blacklistModel = new mongoose.Schema({
    token:{
        type:String
    }
})

module.exports = new mongoose.model("blacklist",blacklistModel);
