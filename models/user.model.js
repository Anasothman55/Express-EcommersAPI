import mongoose from "mongoose";
import { Schema } from "mongoose";

const userSchema = new Schema({
  email:{
    type: String,
    required: true,
    unique: true
  },
  password:{
    type: String,
    required: true
  },
  username:{
    type: String,
    required: true
  },
  lastLoginDate:{
    type: Date,
    default: Date.now()
  },
  role:{
    type: String,
    default: "user"
  },
  isVerifide:{
    type: Boolean,
    defaul: false
  },
  resetPasswordToken: String,
  resetPasswordExpiresAt: Date,
  verificationTokenParams:String,
  verificationToken : String,
  verificationTokenExpiresAt: Date
},{timestamps: true })

export const User = mongoose.model("User", userSchema);