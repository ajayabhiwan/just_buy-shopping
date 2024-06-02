const mongoose = require("mongoose");

const wishlistModel = new mongoose.Schema({
   user_id:{
      type:mongoose.Schema.Types.ObjectId,
      ref:"user"
   },
   product_id:[{
    type:mongoose.Schema.Types.ObjectId,
    ref:"product"
   }]
},{timestamps:true})

module.exports = new mongoose.model("wishlist",wishlistModel)