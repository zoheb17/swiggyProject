import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
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
    isActive:{
        type:Boolean,
        default:true

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
  },
  {
    timestamps: true,
    strict:false
  }
);

const userModel = mongoose.model("user", userSchema);

export default userModel;
