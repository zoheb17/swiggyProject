import mongoose from "mongoose";

let menuSchema=new mongoose.Schema(
{
    restaurant_id:{
        type:String,
        require:true
    },
    itemName:{
        type:String,
        require:true,
        trim:true
    },
    
        itemPrice:{
        type:String,
        require:true,
        trim:true
        
    },
    category:{
        type:String,
        require:true,
        enum:["veg","non-veg","drink"]
    },
    
},{
    timestamps:true,
}

)
let menuModel=mongoose.model("menu",menuSchema)

export default menuModel 