import mongoose from "mongoose";

const salesSchema=new mongoose.Schema(
    {
        userId:{
            type:String,
            require:true
        },
        restaurantId:{
            type:String,
            require:true
        },
        rider_id:{
            type:String,
            require:true
        },
        orderDetails:{
            itemName:{
                type:String,
                require:true,

            },
            itemPrice:{
                type:String,
                require:true
            },
            itemQty:{
                type:Number,
                require:true,
                mixlength:[1,"quantity must be atleast 1"],
                maxlength:[15,"maxiumum  quantity mus be 15"]
            },
            total:{
                type:Number,
                require:true
            },
            orderStatus:{
                type:String,
                enum:["finished", "on-the-way"]
            },
            paymentMethod:{
                type:String,
                enum:["upi","cod","card"]

            }
        }
    },{
        timestamps:true
    }
)

const salesModule=mongoose.model("sales",salesSchema)

export default salesModule