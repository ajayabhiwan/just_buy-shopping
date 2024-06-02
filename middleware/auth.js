const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");
const blacklistModel = require("../models/blacklistModel")

const auth = async(req,res,next)=>{
    try {
        let token = req.query.token || req.body.token || req.headers.Authorization || req.headers.authorization
        console.log("token--in --- auth--",token);

        if(!token){
            return res.status(200).json({success:false,message:"Token Not Found"});
        }

        const bearrertoken = token.split(" ")[1]
        console.log("beareertoken----",bearrertoken);

        const blacklistToken = await blacklistModel.findOne({token:bearrertoken});
        console.log("blacklistToken-----auth---",blacklistToken)

        if(blacklistToken){
            return res.status(200).json({success:false,message:"Token should blacklisted"});
        }

        const verifytoken = jwt.verify(bearrertoken,process.env.KEYSECRECT);

        if(!verifytoken || !verifytoken._id){
            return res.status(200).json({success:false,message:"Token User Id Not Found"});
        }

        const rootuser= await userModel.findOne({_id:verifytoken._id});

        console.log(rootuser,"rootuser----");

        if(!rootuser){
            return res.status(200).json({success:false,message:" User  Not Found"});
        }

        req.userid = rootuser._id
        console.log("req.userid-----",req.userid)

        req.userdata = rootuser
        console.log("req.userdata----",req.userdata)

        next();


    } catch (error) {
        console.log(error.message)
        return res.status(400).json({success:false,message:error.message})
    }
}

module.exports = {
    auth
}