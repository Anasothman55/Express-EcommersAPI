import { User } from "../models/user.model.js"
import { Product } from "../models/product.model.js";
import { validationResult } from 'express-validator';
import categoryList from "../utils/categoryList.js";


//? user controller
export const getAllUsers = async (req, res) => {
  try {
    const { verify, role, username } = req.query;

    const filter = {};
    if (verify === String(true) || verify === String(false)) filter.isVerifide = verify; 
    if (role) filter.role = role;
    if (username) filter.username = username;

    console.log(filter)

    const users = await User.find(filter, 'username email role lastLoginDate isVerifide');
    return res.status(200).json({
      success: true,
      users:users,
      message: "Usernames retrieved successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch usernames",
      error: error.message,
    });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findOneAndDelete({ _id: userId,role:"user" });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: `User ${user.username} deleted successfully`,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch usernames",
      error: error.message,
    });
  }
};

export const patchUserRole = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findOneAndUpdate(
      { _id: userId, role: "user"},
      { role: "admin" },
      { new: true } 
    );

    if(!user.isVerifide){
      return res.status(200).json({
        success: false,
        message: "User is not verified",
      })
    }

    console.log(user)

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: `User ${user.username} updated to ${user.role} successfully`,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch usernames",
      error: error.message,
    });
  }
};

// get category
export const getcategory = async(req,res)=>{
  try {
    return res.status(200).json({
      success: true,
      categoryList:categoryList,
      message: "All category retrieved successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch category",
      error: error.message,
    });
  }
}

// product controller
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
};

export const addProduct = async (req, res) => {
  try {
    const {productName, category,brand,price,stockQuantity,specialDetails} = req.body
    const userId = req.user._id
    
    const errors = validationResult(req)
    if(!errors.isEmpty()){
      return res.status(400).json({
        success:false,
        message: errors.array(),
      })
    }

    const productAlreadyExists = await Product.findOne({productName: productName})

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
      category: category,
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

export const toggalFeaturedProduct = async (req,res)=>{
  const {productId} = req.params
  try {
    const product = await Product.findById(productId);
    if(product){
      product.isFeatured = !product.isFeatured

      const updatedProduct = await product.save(); 
      return res.status(201).json({
        success: true,
        message: `Product ${updatedProduct.productName} is now ${updatedProduct.isFeatured ? 'featured' : 'not featured'}.`,
        product: updatedProduct,
      });
    }else{
      return res.status(404).json({
        success:false,
        message: "Product not found"
      })
    }
    
  } catch (error) {
    console.error('Error toggling featured product:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
}