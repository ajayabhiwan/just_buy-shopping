const express = require("express");
const userRoute = express();
const path = require("path");
const multer = require("multer")
const userController = require("../controllers/userController");
const {auth} = require("../middleware/auth");
const ejs = require("ejs");
userRoute.set("view engine","ejs")
userRoute.set("views","./views")
userRoute.use(express.json());
userRoute.use(express.urlencoded({extended:true}))
userRoute.use("/public",express.static("./public/images"))


const storage = multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,path.join(__dirname,"../public/images"))
    },
    filename:(req,file,cb)=>{
        const name = Date.now()+"--"+file.originalname
        cb(null,name)
    }
})

const upload = multer({storage:storage});

userRoute.post("/register",upload.single('image'),userController.register)
userRoute.get("/verify/:id",userController.verifymail)
userRoute.post("/forget",userController.forgetpassword);
userRoute.post("/otpverify",userController.verifyotp);
userRoute.post("/resetpassword",userController.resetpassword)
userRoute.post("/login",userController.login);
userRoute.post("/order",auth,userController.orderproduct)
userRoute.get("/getorder",auth,userController.getorder)
userRoute.post("/wishlist",auth,userController.wishlistProduct)
userRoute.get("/getwishlist",auth,userController.getwishlist)
userRoute.post("/like",auth,userController.likeproduct)
userRoute.post("/unlike",auth,userController.deletelike)
userRoute.get("/countlike",auth,userController.countlike)
userRoute.post("/logout",auth,userController.logout)

module.exports = userRoute