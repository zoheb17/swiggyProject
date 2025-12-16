import mailer from "nodemailer"
import dotenv from "dotenv"
dotenv.config()

async function sendmail(to,subject,text) {
    try {
        const sender=mailer.createTransport({
            service:"gmail",
            auth:{
                user:"sayyedzohebuddin61859@gmail.com",
                pass:process.env.PASS
            }
            
        })

           const user= await sender.sendMail({
        from:"sayyedzohebuddin61859@gmail.com",
        to,
        subject,
        text
    })
    console.log("Email-sent",user.messageId);
    } catch (error) {
        console.log(error);
        
    }
    
}

export default sendmail