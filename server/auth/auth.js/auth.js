import jwt from "jsonwebtoken"
import dotenv from "dotenv"
dotenv.config()

const authmiddleware=(req,res,next)=>{
    try {
        const token =req.headers.authorization?.split(' ')[1];
        if(!token){
return res.status(401).json({msg:"invalid token"})
        }
        const decode =jwt.verify(token,process.env.SECKEY);
    req.user=decode;
    next()
    } catch (error) {
        console.log(error);
        res.status(401).json({msg:error})
        
    }
}
export default authmiddleware;