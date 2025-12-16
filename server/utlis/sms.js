import twilio from "twilio"
import dotenv from "dotenv"
dotenv.config()

async function sendSMS(to,body) {
    try {
            let sid= process.env.AccountSID
    let token=process.env.AuthToken
    let phone=process.env.PHONE

    const client=twilio(sid,token);

    const sender=await client.messages.create({
        from:phone,
        to,
        body
    })
    console.log( "SMS SENT",sender.sid);
    } catch (error) {
        console.log(error);
    }
}    
export default sendSMS

