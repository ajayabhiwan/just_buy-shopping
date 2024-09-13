
require("dotenv").config()
const express = require("express");
const userRoute = require("./routes/userRoute");
const adminRoute = require("./routes/adminRoute");
const productRoute = require("./routes/productRoute");

const cron = require("./cron")



////////////////////
const app = express();
require("./db/conn");
app.use("/",userRoute)
app.use("/product",productRoute)
app.use("/admin",adminRoute)

cron.SendMailToAllUser()


app.listen(process.env.PORT,()=>{
    console.log(`server started at http://127.0.0.1:${process.env.PORT}`)
})
