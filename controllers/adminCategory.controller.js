import { Category } from "../models/category.model.js";
import { Product } from "../models/product.model.js";
import { validationResult } from 'express-validator';

export const getAllCategory = async (req, res) => {
  try {

    const {name} = req.query

    const filter = {};
    if (name) filter.categoryName = name

    const category = await Category.find(filter);
    return res.status(200).json({
      success: true,
      category:category,
      message: "All category retrieved successfully",
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch category",
      error: error.message,
    });
  }
};

export const addCategory = async (req, res) => {
  try {
    const {categoryName, categoryDescription} = req.body
    const userId = req.user._id
    
    const errors = validationResult(req)
    if(!errors.isEmpty()){
      return res.status(400).json({
        success:false,
        message: errors.array(),
      })
    }

    const categoryAlreadyExists = await Category.findOne({categoryName: categoryName})

    if(categoryAlreadyExists){
      return res.status(400).json({
        success:false,
        message: "category already exist"
      })
    }

    const newCategory = new Category({
      categoryName: categoryName,
      categoryDescription: categoryDescription || "Not definde",
      userId: userId
    })

    await newCategory.save()

    console.log("new category Create")
    return res.status(201).json({
      success: true,
      message: "Category create successfully",
      category: newCategory
    })

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch category",
      error: error.message,
    });
  }
};

export const deleteCategory = async (req,res)=>{
  try {

    const categoryId = req.params.categoryId

    const category = await Category.findOneAndDelete({_id:categoryId});

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: `Category ${category.categoryName} deleted successfully`,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to delete category",
      error: error.message,
    });
  }
}

export const updateCategory = async (req,res)=>{
  try {

    const categoryId = req.params.categoryId
    const {categoryName, categoryDescription} = req.body
    const userId = req.user._id

    const errors = validationResult(req)
    if(!errors.isEmpty()){
      return res.status(400).json({
        success:false,
        message: errors.array(),
      })
    }

    const categoryUpdateFilter = {userId}

    if(categoryName) categoryUpdateFilter.categoryName = categoryName
    if(categoryDescription) categoryUpdateFilter.categoryDescription = categoryDescription
    
    console.log(categoryUpdateFilter)
    
    const category = await Category.findOneAndUpdate(
      {_id:categoryId},
      {...categoryUpdateFilter},
      {new: true}
    );

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: `Category ${category.categoryName} update successfully`,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to update category",
      error: error.message,
    });
  }
}

export const getCatyegoryProduct = async (req,res)=>{
  try {

    const categoryId = req.params.categoryId
    const {type, brand} = req.query

    const filter = { categoryId };
    if (type) filter['specialDetails.type'] = type;
    if (brand) filter.brand = brand;

    const category = await Category.findById(categoryId)
    if(!category){
      return res.status(400).json({
        success:false,
        message: "No category found with the provided ID"
      })
    }

    const product = await Product.find(filter,'productName userId brand price stockQuantity specialDetails')
    const sanitizedProducts = product.map((p) => ({
      ...p._doc,
      specialDetails: {
        'type':p.specialDetails.get('type')
      }
    }));

    return res.status(200).json({
      success: true,
      respons:{
        category:category,
        product:sanitizedProducts
      },
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