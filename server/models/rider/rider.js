import mongoose from "mongoose";

const riderSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      require: true,
      trim: true,
    },
    email: {
      type: String,
      require: true,
      trim: true,
    },
    password: {
      type: String,
      require: true,
    },
    age: {
      type: Number,
      minlength: [18, "minimum age atleast 18"],
      maxlength: [50, "max length at least 50"],
    },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
    },
    isVerified: {
      email: {
        type: Boolean,
        default: false,
      },
      phone: {
        type: Boolean,
        default: false,
      },
    },

    isVerifiedToken: {
      email: {
        type: String,
        default: null,
      },
      phone: {
        type: String,
        default: null,
      },
    },
    vechicleType:{
        type:String,
        enum:["bike","scooty"]
    },
    vechicleRc:{
        type:String,
        require:true


    },
  
    isOnline:{
        type:Boolean,
       default:true

    }
  },
  {
    timestamps: true,
    strict:false
  }
);

const riderModel = mongoose.model("rider", riderSchema);

export default riderModel;