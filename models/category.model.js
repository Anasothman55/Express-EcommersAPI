import mongoose from "mongoose";
import { Schema } from "mongoose";

const categorySchema = new Schema({
  categoryName:{
    type: String,
    required: true,
    unique: true
  },
  categoryDescription:{
    type: String,
    default: "No description"
  },
  userId:{
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  }

},{timestamps: true })

export const Category = mongoose.model('Category', categorySchema)