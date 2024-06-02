const mongoose = require("mongoose");

const productModel = new mongoose.Schema({
    title:{
        type:String,
        required:true,
        trim:true
    },
    description:{
        type:String,
        required:true,
        trim:true
    },
    price:{
        type:Number,
        required:true,
        trim:true
    },
    image:{
        type:String,
        required:true
    },
    company_name:{
        type:String,
        trim:true,
        required:true
    },
    categories:{
      type:String,
      trim:true,
      required:true
    }
},{timestamps:true})

module.exports = new mongoose.model("product",productModel)