import { check,body } from 'express-validator'
import { Category } from '../models/category.model.js'


const categoryName =   check('categoryName')
.notEmpty()
.withMessage('category is required')
.isLength({ min: 3, max: 100 })
.withMessage('category must be between 3 and 100 characters')
.custom(async (value, { req }) => {
  const category = await Category.findOne({ categoryName: value });
  if (category) {
    return Promise.reject('That category is already exist.');
  }
  return true;
})

export const addCategoryValidator = [
  categoryName
]