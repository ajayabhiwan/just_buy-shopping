const express = require("express");
const path = require("path")
const adminRoute = express();
const multer = require("multer")
const adminController = require("../controllers/adminController")

const {auth} = require("../middleware/auth");
const ejs = require("ejs");
adminRoute.set("view engine","ejs")
adminRoute.set("views","./views")
adminRoute.use(express.json());
adminRoute.use(express.urlencoded({extended:true}))
adminRoute.use("/public",express.static("./public/images"))


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

adminRoute.get("/userlist",auth,adminController.userlist)
adminRoute.post("/upload",auth,upload.single('image'),adminController.uploadproduct)

module.exports = adminRoute
