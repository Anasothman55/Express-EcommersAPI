import express from 'express'
import { verfiyToken } from '../middleware/verifyToken.js'
import { checkAdmin } from '../middleware/adminCheck.js'
import {  getAllUsers, deleteUser, patchUserRole } from '../controllers/admin.controller.js'
import { addCategory, deleteCategory, getAllCategory, updateCategory } from '../controllers/adminCategory.controller.js'
import { addCategoryValidator } from '../validations/category.Validations.js'


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

// Admin routes for product


export default router