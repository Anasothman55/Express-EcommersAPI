import express from 'express'
import { verfiyToken } from '../middleware/verifyToken.js'
import { getFeaturedProduct, getProductByCategory, getRecommendedProduct } from '../controllers/user.controller.js'


const router = express.Router()

//? user category routes
router.get('/category/:categoryName', getProductByCategory)

//? user product routes
router.get('/featured',getFeaturedProduct)
router.get('/recommendations', getRecommendedProduct)

//? user cart controller


export default router