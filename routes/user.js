import express from 'express'
import { verfiyToken } from '../middleware/verifyToken.js'
import { mainPage } from '../controllers/user.controller.js'

const router = express.Router()

router.get('/',mainPage)
router.get('/category/:categoryId',mainPage)

export default router