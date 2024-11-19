import mongoose from "mongoose";
import { Schema } from "mongoose";

const productSchema = new Schema({
  productName:{
    type: String,
    required: true,
    unique: true
  },

},{timestamps: true })

export const Product = mongoose.model('Product', productSchema)