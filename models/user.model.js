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
  cartItems:[
    {
      quantity:{
        type:Number,
        default:0
      },
      product:{
        type: Schema.Types.ObjectId,
        ref:"Product"
      }
    }
  ],
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
    default: false
  },
  resetPasswordToken: String,
  resetPasswordExpiresAt: Date,
  verificationTokenParams:String,
  verificationToken : String,
  verificationTokenExpiresAt: Date
},{timestamps: true })

export const User = mongoose.model("User", userSchema);