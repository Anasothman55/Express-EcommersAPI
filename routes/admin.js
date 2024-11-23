import express from 'express'
import { verfiyToken } from '../middleware/verifyToken.js'
import { checkAdmin } from '../middleware/adminCheck.js'
import {  getAllUsers, deleteUser, patchUserRole, getAllProduct, addProduct, deleteProduct, updateProduct, getcategory, toggalFeaturedProduct } from '../controllers/admin.controller.js'
import { addProductValidator, updateProductValidator } from '../validations/product.Validations.js'


const router = express.Router()

// Admin routes for user

router.get('/user',verfiyToken,checkAdmin,getAllUsers)
router.delete('/user/:userId',verfiyToken,checkAdmin,deleteUser)
router.patch('/user/:userId',verfiyToken,checkAdmin,patchUserRole)

// get category

router.get('/category',verfiyToken,checkAdmin,getcategory)

// Admin routes for product

router.get('/product',verfiyToken,checkAdmin,getAllProduct)
router.post('/product/add-product/:categoryId',verfiyToken,checkAdmin,addProductValidator,addProduct)
router.delete('/product/delete-product/:productId',verfiyToken,checkAdmin,deleteProduct)
router.put('/product/update-product/:productId',verfiyToken,checkAdmin,updateProductValidator,updateProduct)
router.patch('/product/featured-product/:productId',verfiyToken,checkAdmin,toggalFeaturedProduct)

export default router