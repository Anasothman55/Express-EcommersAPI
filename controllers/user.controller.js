import { Product } from "../models/product.model.js";
import { validationResult } from 'express-validator';


export const mainPage = async (req, res) => {
  try {

    // const category = await Category.find().lean();
    // const newProduct = await Product.find().sort({createdAt: -1}).limit(10)
    
    // return res.status(200).json({
    //   success: true,
    //   respons:{
    //     category,
    //     newProduct
    //   },
    //   message: "Data returned successfully",
    // });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch product",
      error: error.message,
    });
  }
};

export const getCatyegoryProduct = async (req,res)=>{
  try {

    // const categoryId = req.params.categoryId
    // const {type, brand} = req.query

    // const filter = { categoryId };
    // if (type) filter['specialDetails.type'] = type;
    // if (brand) filter.brand = brand;

    // const category = await Category.findById(categoryId)
    // if(!category){
    //   return res.status(400).json({
    //     success:false,
    //     message: "No category found with the provided ID"
    //   })
    // }

    // const product = await Product.find(filter,'productName userId brand price stockQuantity specialDetails')
    // const sanitizedProducts = product.map((p) => ({
    //   ...p._doc,
    //   specialDetails: {
    //     'type':p.specialDetails.get('type')
    //   }
    // }));

    // return res.status(200).json({
    //   success: true,
    //   respons:{
    //     category:category,
    //     product:sanitizedProducts
    //   },
    //   message: "All category retrieved successfully",
    // });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch category",
      error: error.message,
    });
  }
}