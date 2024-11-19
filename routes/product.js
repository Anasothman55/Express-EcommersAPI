import express from 'express'
import { verfiyToken } from '../middleware/verifyToken.js'
import { checkAdmin } from '../middleware/adminCheck.js'

const router = express.Router()



export default router