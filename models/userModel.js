
const mongoose = require("mongoose")
const validator = require("validator")
const jwt = require("jsonwebtoken")
const userSchema = new mongoose.Schema({
    name:{
        type:String,
        trim:true,
        required:true
    },
    email:{
        type:String,
        unique:true,
        trim:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('Invaiuld Email Id')
            }
        },
        required:true

    },
    password:{
        type:String,
        min:6,
        required:true
    },
    role:{
        type:String,
        enum:["admin","user"],
        default:"user"
    },
    image:{
        type:String,
        required:true
    },
    mobile:{
        type:Number,
        required:true,
        unique:true,
        min:10
        
    },
    is_verify:{
        type:Boolean,
        default:false
    },
    otp:{
        type:String
    },
    otp_expire:{
        type:Date
    },
    token:{
        type:String,
    }

},{timestamps:true})

userSchema.methods.generateauth = async function(req,res){
    let token = jwt.sign({_id:this._id,role:this.role},process.env.KEYSECRECT,{expiresIn:'2d'})
    console.log("token in usermodel----",token)
    this.token = token

    return token
}

module.exports = new mongoose.model("user",userSchema)
