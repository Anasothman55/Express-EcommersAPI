import mongoose from "mongoose";
import { Schema } from "mongoose";

const productSchema = new Schema({
  productName: {
    type: String,
    required: true,
    unique: true
  },
  category: {
    type:String,
    required: true
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',  // Assuming 'User' is another model
    required: true
  },
  brand: {
    type: String,  // e.g., "Apple", "Samsung"
    required: true
  },
  specialDetails: {
    type: Map,
    of: Schema.Types.Mixed,  // Allows any type of data (string, number, object, etc.)
    required: false
  },
  price: {
    type: Number,
    required: true
  },
  stockQuantity: {
    type: Number,
    required: true,
    min: 0
  },
  isFeatured:{
    type:Boolean,
    default:false
  }
},{timestamps: true })

export const Product = mongoose.model('Product', productSchema)