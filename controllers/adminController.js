const adminModel = require("../models/userModel");
const productModel = require("../models/productModel");
const userModel = require("../models/userModel");

const userlist = async(req,res)=>{
    try {
        const userid = req.userid
        console.log("userid------",userid)

        const preuser = await adminModel.findOne({_id:userid,role:{$regex:"admin",$options:"i"}})
        if(!preuser){
            return res.status(200).json({success:false,message:" Authorize Admin Not Found"})
        }

        const userdata = await adminModel.find({role:"user"})

        return res.status(200).json({success:true,message:"Userlist Data Found Successfully",data:userdata})
    } catch (error) {
        console.log(error.message)
        return res.status(400).json({success:false,message:false})
    }
}

///// upload product------

const uploadproduct = async(req,res)=>{
    try {
        const userid = req.userid
        console.log("userid----",userid)
        const {title,description,price,categories,company_name} =req.body
      
       
        console.log("req.body----",req.body)
        
        const image = req.file.filename
        console.log("images----",image)

        const admin = await userModel.findOne({_id:userid,role:{$regex:"admin",$options:'i'}});
        console.log("preadmin-----",admin)

        if(!admin){
            return res.status(200).json({success:false,message:"You are not a  Admin "})
        }

            const newproduct = new productModel({title:title,description:description,categories:categories,price:price,image:image,company_name:company_name})
            const result = await newproduct.save();
           
            return res.status(200).json({success:true,message:"New Product Uploaded Successfully",data:result})
       
    } catch (error) {
        console.log(error.message)
        return res.status(400).json({success:false,message:error.message})
    }
}

module.exports = {
    userlist,
    uploadproduct
}