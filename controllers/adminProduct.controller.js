import { Category } from "../models/category.model.js";
import { Product } from "../models/product.model.js";
import { User } from "../models/user.model.js"
import { validationResult } from 'express-validator';


export const getAllProduct = async (req, res) => {
  try {

    const {name, brand,type} = req.query

    const filter = {};
    if (name) filter.productName = name
    if(brand) filter.brand = brand
    if (type) filter['specialDetails.type'] = type;
    
    const product = await Product.find(filter);
    return res.status(200).json({
      success: true,
      category:product,
      message: "All product retrieved successfully",
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch product",
      error: error.message,
    });
  }
};

export const addProduct = async (req, res) => {
  try {
    const {productName, brand,price,stockQuantity,specialDetails} = req.body
    const categoryId = req.params.categoryId
    const userId = req.user._id
    
    const errors = validationResult(req)
    if(!errors.isEmpty()){
      return res.status(400).json({
        success:false,
        message: errors.array(),
      })
    }

    const category = await Category.findById(categoryId)

    if(!category){
      return res.status(400).json({
        success:false,
        message: "there are no category with this id"
      })
    }

    const productAlreadyExists = await Product.findOne({categoryName: productName})

    if(productAlreadyExists){
      return res.status(400).json({
        success:false,
        message: "product already exist"
      })
    }

    const newProduct = new Product({
      productName:productName,
      brand:brand,
      price:price,
      stockQuantity:stockQuantity,
      specialDetails:specialDetails,
      categoryId: categoryId,
      userId: userId
    })

    await newProduct.save()

    console.log("new product Create")
    return res.status(201).json({
      success: true,
      message: "Product create successfully",
      product: newProduct
    })

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch product",
      error: error.message,
    });
  }
};

export const deleteProduct = async (req,res)=>{
  try {

    const productId = req.params.productId

    const product = await Product.findOneAndDelete({_id:productId});

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "product not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: `Product ${product.productName} deleted successfully`,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to delete product",
      error: error.message,
    });
  }
}

export const updateProduct= async (req,res)=>{
  try {

    const {productId} = req.params
    const {productName, brand,price,stockQuantity,specialDetails} = req.body
    const userId = req.user._id

    const updatedData = {userId};
    if (productName) updatedData.productName = productName;
    if (brand) updatedData.brand = brand;
    if (price) updatedData.price = price;
    if (stockQuantity) updatedData.stockQuantity = stockQuantity;
    if (specialDetails) updatedData.specialDetails = specialDetails;


    const errors = validationResult(req)
    if(!errors.isEmpty()){
      return res.status(400).json({
        success:false,
        message: errors.array(),
      })
    }

    const product = await Product.findOneAndUpdate(
      {_id: productId},
      updatedData,
      {new:true}
    )

    if(!product){
      return res.status(400).json({
        success:false,
        message: "there are no product with this id"
      })
    }

    return res.status(200).json({
      success: true,
      message: `Product ${product.productName} update successfully`,
      product:product
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to update product",
      error: error.message,
    });
  }
}