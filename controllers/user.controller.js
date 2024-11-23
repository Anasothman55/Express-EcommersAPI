
import { validationResult } from 'express-validator';
import { Product } from '../models/product.model.js';
import categoryList from '../utils/categoryList.js';


//? user product controller
export const getFeaturedProduct = async(req,res)=>{
  try {
    const featureProduct = await Product.find({isFeatured: true})

    if(!featureProduct){
      return res.status(404).json({
        success:false,
        message: "No featured product found"
      })
    }

    return res.status(200).json({
      success: true,
      featureProduct:featureProduct,
      message: "All feature product retrieved successfully",
    });
    
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      success:false,
      message: "Server error",
      error:error.message
    })
  }
}

export const getProductByCategory = async(req,res)=>{
  const category = req.params.categoryName
  try {

    if (!categoryList.includes(category)) {
      return res.status(404).json({
        success: false,
        message: "Invalide category",
      });
    }
    
    const product = await Product.find({category: category})

    return res.status(200).json({
      success: true,
      product:product,
      message: "All product retrieved successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch product",
      error: error.message,
    });
  }
}

export const getRecommendedProduct = async(req,res)=>{
  try {
    const products = await Product.aggregate([
      {
        $sample: {size:3}
      },
      {
        $project:{
          _id:1,
          productName:1,
          price:1,
          specialDetails:1,
          barnd:1,
          stockQuantity:1,
        }
      }
    ])

    res.status(200).json({
      success:true,
      products:products
    })
  } catch (error) {
    res.status(500).json({
      success:false,
      message: "Server error",
      error: error.message
    })
  }
}

//? user cart controller