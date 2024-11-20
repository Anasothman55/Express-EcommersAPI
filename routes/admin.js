import express from 'express'
import { verfiyToken } from '../middleware/verifyToken.js'
import { checkAdmin } from '../middleware/adminCheck.js'
import {  getAllUsers, deleteUser, patchUserRole } from '../controllers/admin.controller.js'
import { addCategory, deleteCategory, getAllCategory, getCatyegoryProduct, updateCategory } from '../controllers/adminCategory.controller.js'
import { addCategoryValidator } from '../validations/category.Validations.js'
import { addProduct, deleteProduct, getAllProduct, updateProduct } from '../controllers/adminProduct.controller.js'
import { addProductValidator, updateProductValidator } from '../validations/product.Validations.js'


const router = express.Router()

// Admin routes for user

router.get('/user',verfiyToken,checkAdmin,getAllUsers)
router.delete('/user/:userId',verfiyToken,checkAdmin,deleteUser)
router.patch('/user/:userId',verfiyToken,checkAdmin,patchUserRole)

// Admin routs for product

router.get('/category',verfiyToken,checkAdmin,getAllCategory)
router.post('/category/add-category',verfiyToken,checkAdmin,addCategoryValidator,addCategory)
router.delete('/category/delete-category/:categoryId',verfiyToken,checkAdmin,deleteCategory)
router.put('/category/update-category/:categoryId',verfiyToken,checkAdmin,addCategoryValidator,updateCategory)
router.get('/category/:categoryId',verfiyToken,checkAdmin,getCatyegoryProduct)
// Admin routes for product

router.get('/product',verfiyToken,checkAdmin,getAllProduct)
router.post('/product/add-product/:categoryId',verfiyToken,checkAdmin,addProductValidator,addProduct)
router.delete('/product/delete-product/:productId',verfiyToken,checkAdmin,deleteProduct)
router.put('/product/update-product/:productId',verfiyToken,checkAdmin,updateProductValidator,updateProduct)


export default router