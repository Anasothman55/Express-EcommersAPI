import { check } from "express-validator";
import { Product } from "../models/product.model.js";
import categoryList from "../utils/categoryList.js";


const basicProduct = check('productName')
.notEmpty()
.withMessage('product name is required')
.isLength({ min: 3, max: 100 })
.withMessage('Product must be between 3 and 100 characters')

const productName = check('productName')
.notEmpty()
.withMessage('product name is required')
.isLength({ min: 3, max: 100 })
.withMessage('Product must be between 3 and 100 characters')
.custom(async (value, { req }) => {
  const product = await Product.findOne({ productName: value });
  if (product) {
    return Promise.reject('That product is already exist.');
  }
  return true;
})

const brand = check('brand')
.notEmpty()
.withMessage('brand is required')
.isLength({ min: 3, max: 50 })
.withMessage('Brand must be between 3 and 50 characters')

const price = check('price')
  .notEmpty()
  .withMessage('Price is required')
  .isDecimal({ decimal_digits: '2' }) 
  .withMessage('Price must be a valid decimal number with up to 2 decimal places')
  .isFloat({ min: 0.01 }) 
  .withMessage('Price must be a positive number greater than 0');

const stockQuantity = check('stockQuantity')
.notEmpty()
.withMessage('stockQuantity is required')
.isInt({ min: 0 })
.withMessage('stockQuantity must be a non-negative integer')

const category = check('category')
.notEmpty()
.withMessage('Category is required')
.custom((value) => {
  if (!categoryList.includes(value)) {
    throw new Error(`Invalid category. Allowed categories are: ${categoryList.join(', ')}`);
  }
  return true; // Validation passed
});


export const addProductValidator = [
  productName,
  brand,
  price,
  stockQuantity,
  category
]

export const updateProductValidator = [
  basicProduct,
  brand,
  price,
  stockQuantity
]