import express from "express"
import dotenv from "dotenv"
dotenv.config()
import router from "./controller/public/index.js"
import  riderRouter from "./controller/public/r.js"
import restaurantRouter from "./controller/public/res.js"
import privateRouter from "./controller/private/privat.js"
import privateriderRouter from "./controller/private/rider.js"
import privaterestaurantrouter from "./controller/private/resturant.js"

import  "./utlis/dbconnect.js"
import authmiddleware from "./auth/auth.js/auth.js"
const app=express()
app.use(express.json());
const port=process.env.PORT 

app.get("/",(req,res)=>{
    try {
        res.status(200).json({msg:"hiii"})
    } catch (error) {
        console.log(error);
        res.status(500).json({msg:error})
        
    }
})
app.use("/user", router);
app.use("/rider",riderRouter)
app.use("/rest",restaurantRouter)
app.use(authmiddleware) 
app.use("/private",privateRouter) 
app.use("/private",privateriderRouter)
app.use("/private",privaterestaurantrouter)
app.listen(port,()=>{
    console.log(`server start at http://localhost:${port}`);
})