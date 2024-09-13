// for testing purpose------you can use crontab.guru website for time-purpose------
const userModel = require("./models/userModel");
const nodemailer = require("nodemailer")
const cron = require("node-cron");


const sendverificationmail = async(email)=>{
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
            subject:'For - cron job  mail  Email',
            html:`<p>Hello ${email} </p>`
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


const SendMailToAllUser = ()=>{
    try {
        cron.schedule("*/10 * * * * *",async()=>{
            let userdata = await userModel.find({})
            console.log("userdata----in cronjob",userdata)
            if(userdata.length > 0){
                let emails = []
                userdata.map((item) => {
                    console.log(item);
                    emails.push(item.email)
                })
                //console.log('cron running')
            //    / sendverificationmail(emails)
            }else{

            }
           
        })
    } catch (error) {
        console.log(error.message)
    }
}

module.exports = {
    SendMailToAllUser
}