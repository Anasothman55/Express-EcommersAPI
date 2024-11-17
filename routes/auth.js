import express from 'express'
import { signUp, verifyAccount, login, checkAuth, logout, forgotPassword, resetPassword } from '../controllers/auth.controller.js'
import { forgotPasswordValidations, loginValidatons, resetPasswordValidations, signUpValidatons,verifyAccountValidation } from '../validations/auth.Validations.js'
import { verfiyToken } from '../middleware/verifyToken.js'

const router = express.Router()

router.get('/check-auth',verfiyToken,checkAuth)
router.post('/signup',signUpValidatons,signUp)
router.post('/verify-account/:tokenParms',verifyAccountValidation,verifyAccount)
router.post('/login',loginValidatons,login)
router.post('/logout',logout)  
router.post('/forgot-password',forgotPasswordValidations,forgotPassword)
router.post('/reset-password/:token',resetPasswordValidations,resetPassword)

export default router