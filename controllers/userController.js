const userModel = require("../models/userModel")
const otp_generator = require("otp-generator");
const bcrypt = require("bcrypt")
const nodemailer = require("nodemailer");
const blacklistModel = require("../models/blacklistModel");
const orderModel = require("../models/orderProduct")
const wishlistModel = require("../models/wishlistModel");
const commentModel = require("../models/commentModel");
const likeModel = require("../models/likeModel");
const productModel = require("../models/productModel")


//secured password ----
const securedpassword = async(password)=>{
    try {
        const passwordhash = await bcrypt.hash(password,12)
        console.log("passwordhash--",passwordhash);
        return passwordhash
    } catch (error) {
        console.log(error.message)
    }
}


const sendverificationmail = async(email,id)=>{
    try {
        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            requireTLS: true,
            auth: {

                user: 'ajaysinghsri@gmail.com',
                pass: 'ugshdrbqmuprgqoq'
            }
        })

        const mailoption = {
            from:"ajaysinghsri@gmail.com",
            to:`${email}`,
            subject:'For - Verification Email',
            html:`<p>Hello ${email} please click here to <a href="http://127.0.0.1:5000/verify/${id}">verify your email id </a></p>`
        }

        transporter.sendMail(mailoption,(error,info)=>{
            if(error){
                console.log(error.message);
            }else{
                console.log(`mail has been sent successfully ${info.response}`);
            }
        })
    } catch (error) {
        console.log(error.message)
    }
}


///////send otp to user------------
const sendotpmail = async(email,otp)=>{
    try {
        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            requireTLS: true,
            auth: {

                user: 'ajaysinghsri@gmail.com',
                pass: 'ugshdrbqmuprgqoq'
            }
        })

        const mailoption = {
            from:"ajaysinghsri@gmail.com",
            to:`${email}`,
            subject:'For - Verification Email',
            html:`<p>Hello ${email} your otp is ${otp}</p>`
        }

        transporter.sendMail(mailoption,(error,info)=>{
            if(error){
                console.log(error.message);
            }else{
                console.log(`mail has been sent successfully ${info.response}`);
            }
        })
    } catch (error) {
        console.log(error.message)
    }
}

/// register ---user-----

const register = async(req,res)=>{
    try {
        const {name,email,password,role,mobile} = req.body
        console.log("req.body---",req.body);

        const image = req.file.filename
        const spassword = await securedpassword(password)
        const preuser = await userModel.findOne({email:email})
        console.log("preuser---",preuser)

        if(preuser){
            return res.status(200).json({success:false,message:"Email id is aleady Exist"})
        }

        const preadmin = await userModel.findOne({role:{
            $regex:"admin",
            $options:'i'
        }})
        console.log(preadmin,"preadmin----")

        if(preadmin){
            return res.status(200).json({success:false,message:"Admin is aleady Exist"})
        }

        const insertuser = new userModel({name:name,email:email,password:spassword,image:image,role:role,mobile:mobile})
        console.log("insertuser----",insertuser);
       
        const result = await insertuser.save()

        sendverificationmail(insertuser.email,insertuser._id)

        return res.status(200).json({success:true,message:"Data Registered Successfully ",data:result})
    } catch (error) {
        console.log(error.message);
        return res.status(400).json({success:false,message:error.message});
    }
}

// verifymail-----

const verifymail = async(req,res)=>{
    try {
        const id = req.params.id
        console.log(id,"id----value----");
        const preuser = await userModel.findOne({_id:id});
        console.log(preuser)

        if(!preuser){
            res.render("error")
        }

        const updatedata = await userModel.findByIdAndUpdate({_id:preuser._id},{$set:{is_verify:true}},{new:true})
        console.log("updatedata---",updatedata);

        res.render("template")

    } catch (error) {
        console.log(error.message);
        return res.status(400).json({success:false,message:error.message});
    }
}

//forget----password----

const forgetpassword = async(req,res)=>{
    try {
        const {email} = req.body

        const preuser = await userModel.findOne({email:email})

        if(!preuser){
            return res.status(200).json({success:false,message:"User Not Found"})
        }

        const otp = otp_generator.generate(6,{specialChars:false,upperCaseAlphabets:false,lowerCaseAlphabets:false})
        console.log("randomcode----",otp);

        const time = 2*60*1000
        console.log("time",time)
        const expiretime = new Date(Date.now()+time)
        console.log("expiretime---",expiretime) 

        const userdata = await userModel.findOneAndUpdate({email:preuser.email},{$set:{otp:otp,otp_expire:expiretime}},{new:true})
        console.log("userdata----",userdata)

        sendotpmail(preuser.email,otp)

        return res.status(200).json({success:true,message:"Data Successfully",data:userdata})
    } catch (error) {
        console.log(error.message);
        return res.status(400).json({success:false,message:error.message})
    }
}

//////----verify otp

const verifyotp = async(req,res)=>{
    try {
        const {email,otp} = req.body

        const preuser = await userModel.findOne({email:email})

        if(!preuser){
            return res.status(200).json({success:false,message:"User Not Found"})
        }

        if(preuser.otp !==otp){
            return res.status(200).json({success:false,message:"Invalid otp"})
        }

        if(preuser.otp_expire < new Date()){
            return res.status(200).json({success:false,message:"otp Expire"})
        }

        return res.status(200).json({success:true,message:"OTP veriffied successfully"})
    } catch (error) {
        console.log(error.message);
        return res.status(400).json({success:false,message:error.message})
    }
}

//login---

const login = async(req,res)=>{
    try {
        const {email,password} = req.body

        const preuser = await userModel.findOne({email:email});
        if(!preuser){
            return res.status(200).json({success:false,message:"Invalid Email Id And Password"});
        }


        const passwordmatch = await bcrypt.compare(password,preuser.password)
        console.log("passwordmatch---,",passwordmatch)
        if(!passwordmatch){
            return res.status(200).json({success:false,message:"Invalid Email Id And Password"});
        }

        if(preuser.is_verify === false){
            return res.status(200).json({success:false,message:"Verify your Email Id"});
        }

        let token = await preuser.generateauth()
        console.log("token ----------value-----",token)

        return res.status(200).json({success:true,token:token,message:"Login Successfully",data:preuser})
    } catch (error) {
        console.log(error.message)
        return res.status(400).json({success:false,message:error.message});
    }
}

////reset password--------------

const resetpassword = async(req,res)=>{
    try {
        const {password,confirmpassword,email}= req.body

        const preuser = await userModel.findOne({email:email});
        if(!preuser){
            return res.status(200).json({success:false,message:"User Not Found"});
        }

        if(preuser.otp ==""){
            return res.status(200).json({success:false,message:"Password already changed"})
        }

        if(password !== confirmpassword){
            return res.status(200).json({success:false,message:"Password and ConfirmPassword Not Match"});
        }

        const spassword = await securedpassword(password)

        const userdata = await userModel.findOneAndUpdate({email:preuser.email},{$set:{password:spassword,otp_expire:undefined,otp:""}})
        console.log("userdata----",userdata)

        return res.status(200).json({success:true,message:"Password Changes Successfully",data:userdata})

    } catch (error) {
        console.log(error.message)
        return res.status(400).json({success:false,message:error.message});
    }
}


//logout---- 
const logout = async(req,res)=>{
    try {
        const token = req.body.token || req.query.token || req.headers.Authorization || req.headers.Authorization
        console.log("token----in logout---",token);

        if(!token){
            return res.status(200).json({success:false,message:"Token not found "})
        }

        const blacklist = new blacklistModel({token:token})
        console.log("blacklist-----token",blacklist)

        const result = await blacklist.save()

        return res.status(200).json({success:true,message:"Logout Successfully",data:result});


    } catch (error) {
        console.log(error.message)
        return res.status(400).json({success:false,message:error.message});
    }
}

////// orderproduct-----
const orderproduct = async(req,res)=>{
    try {
        const userid = req.userid
        const {product_id} = req.body

        const preuser = await userModel.findOne({_id:userid});
        
        if(!preuser){
            return res.status(200).json({success:false,message:"Not an Authorize User"})
        }

        if(product_id == null){
            return res.status(200).json({success:false,message:"Not Selected any Product"})
        }

        const preorder = await orderModel.findOne({user_id:preuser._id})
        console.log("preorder----",preorder)

        if(preorder){
             await preorder.product_id.push(product_id)
             await preorder.save()

           return res.status(200).json({success:true,message:"Order Placed Successfully",data:preorder})
        }


        const order  = new orderModel({user_id:preuser._id,product_id:product_id}) 
        console.log(order,"order")

        const result = await order.save()

        return res.status(200).json({success:true,message:"Order Your Product Successfully",data:result})
    } catch (error) {
        console.log(error.message)
        return res.status(400).json({success:false,message:error.message});
    }
} 

const getorder = async(req,res)=>{
    try {
        const userid = req.userid

        const result = await orderModel.find({user_id:userid}).populate(['product_id','user_id'])
        console.log("result-----",result)

        return res.status(200).json({success:true,message:"Gety Data of Order Product Successfully",data:result})

    } catch (error) {
        console.log(error.message)
        return res.status(400).json({success:false,message:error.message});
    }
}




////// orderproduct-----
const  wishlistProduct = async(req,res)=>{
    try {
        const userid = req.userid
        const {product_id} = req.body

        const preuser = await userModel.findOne({_id:userid});
        
        if(!preuser){
            return res.status(200).json({success:false,message:"Not an Authorize User"})
        }

        if(product_id == null){
            return res.status(200).json({success:false,message:"Not Selected any Product"})
        }

        const preorder = await wishlistModel.findOne({user_id:preuser._id})
        console.log("preorder----",preorder)

        if(preorder){
             await preorder.product_id.push(product_id)
             await preorder.save()

           return res.status(200).json({success:true,message:"Order Placed Successfully",data:preorder})
        }


        const order  = new wishlistModel({user_id:preuser._id,product_id:product_id}) 
        console.log(order,"order")

        const result = await order.save()

        return res.status(200).json({success:true,message:"Order Your Product Successfully",data:result})
    } catch (error) {
        console.log(error.message)
        return res.status(400).json({success:false,message:error.message});
    }
} 

const getwishlist = async(req,res)=>{
    try {
        const userid = req.userid

        const result = await wishlistModel.find({user_id:userid}).populate(['product_id','user_id'])
        console.log("result-----",result)

        return res.status(200).json({success:true,message:"Gety Data of Order Product Successfully",data:result})

    } catch (error) {
        console.log(error.message)
        return res.status(400).json({success:false,message:error.message});
    }
}

/// like -------users----
const likeproduct = async(req,res)=>{
    try {
        const userid = req.userid
        const {product_id} = req.body

        const product = await productModel.findOne({product_id:product_id})
        
        if(!product){
            return res.status(200).json({success:false,message:"Product not Exist"})
        }

        const prelike = await likeModel.findOne({user_id:userid,product_id:product_id})

        if(prelike){
            return res.status(200).json({success:false,message:"Product Already Like"})
        }

        const like = new likeModel({user_id:userid,product_id:product_id});

        const result = await like.save();
        return res.status(200).json({success:true,message:"Like data Successfully",data:result})


    } catch (error) {
        console.log(error.message)
        return res.status(400).json({success:false,message:error.message});
    }
}
//

const deletelike = async(req,res)=>{
    try {
        const userid = req.userid
        const {product_id} = req.body

        const product = await productModel.findOne({product_id:product_id})
        
        if(!product){
            return res.status(200).json({success:false,message:"Product not Exist"})
        }

        const result = await likeModel.deleteOne({user_id:userid,product_id:product_id});
        return res.status(200).json({success:true,message:"Delete data Successfully",data:result});
    } catch (error) {
        console.log(error.message)
        return res.status(400).json({success:false,message:error.message});
    }
}

/// count like-----

const countlike = async(req,res)=>{
    try {
        const userid = req.userid

        const likes = await likeModel.find({product_id:product_id}).countDocuments();

        if(!likes){
            return res.status(200).son({success:false,message:"Likes data Not Found "})
        }

        return res.status(200).son({success:true,message:"Like data Count Successfully",data:likes})
    } catch (error) {
        console.log(error.message)
        return res.status(400).json({success:false,message:error.message});
    }
}
module.exports = {
    register,
    verifymail,
    login,
    forgetpassword,
    verifyotp,
    resetpassword,
    orderproduct,
    getorder,
    logout,
    wishlistProduct,
    getwishlist,
    likeproduct,
    deletelike,
    countlike
}