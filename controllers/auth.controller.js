import bcrypt from 'bcryptjs'
import { generateTokenAndSetCookie } from '../utils/generateTokenAndSetCookie.js';
import { User } from '../models/user.model.js';
import { validationResult } from 'express-validator';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { TokenBlacklist } from '../models/blackList.model.js';
import { type } from 'os';
import { response } from 'express';


export const signUp = async (req,res,next)=>{
  const {username, email, password} = req.body
  
  try {

    const errors = validationResult(req)
    if(!errors.isEmpty()){
      return res.status(400).json({
        success:false,
        message: errors.array(),
      })
    }

    const userAlreadyExists = await User.findOne({email: email})

    if(userAlreadyExists){
      return res.status(400).json({
        success:false,
        message: "User already exist"
      })
    }

    const hashedPassword = await bcrypt.hash(password, 12)
    const verificationToken = Math.floor(100000 + Math.random() * 900000)
    const verificationTokenParams = crypto.randomBytes(20).toString('hex')

    const newUser = new User({
      username:username,
      email:email,
      password: hashedPassword,
      isVerifide: false,
      verificationToken: verificationToken,
      verificationTokenParams:verificationTokenParams,
      verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000 //24 hours
    })

    await newUser.save()

    generateTokenAndSetCookie(res, newUser._id)

    console.log("new user Create")
    return res.status(201).json({
      success: true,
      message: "User create successfully",
      user: {
        ...newUser._doc,
        password: undefined
      }
    })
    
  } catch (error) {
    res.status(400).json({
      success:false,
      message: error.message
    })
  }
}

export const verifyAccount = async (req,res,next)=>{
  const {token} = req.body
  const tokenParms = req.params.tokenParms
  try {

    const errors = validationResult(req)
    if(!errors.isEmpty()){
      return res.status(400).json({
        success:false,
        message: errors.array(),
      })
    }
    
    const user = await User.findOne({
      verificationTokenParams:tokenParms,
      verificationToken: token,
      verificationTokenExpiresAt: {$gt: Date.now()}
    })

    if(!user){
      return res.status(400).json({
        success:false,
        message: "Inavalide or expired verification code"
      })
    }

    user.isVerifide = true
    user.verificationToken = undefined
    user.verificationTokenExpiresAt = undefined
    user.verificationTokenParams = undefined

    await user.save();

    console.log("User verifide")
    return res.status(201).json({
      success: true,
      message: "Email verify successfully",
      user: {
        ...user._doc,
        password: undefined
      }
    })
    
  } catch (error) {
    res.status(400).json({
      success:false,
      message: error.message
    })
  }
}

export const login = async (req,res,next)=>{
  const {email, password} = req.body
  
  try {

    const errors = validationResult(req)
    if(!errors.isEmpty()){
      return res.status(400).json({
        success:false,
        message: errors.array(),
      })
    }


    const user = await User.findOne({email})

    if(!user){
      return res.status(400).json({
        success:false,
        response:{
          message: "Invalide credential",
          type:"user"
        },
      })
    }


    const isPasswordValide = await bcrypt.compare(password, user.password)

    if(!isPasswordValide){
      return res.status(400).json({
        success:false,
        response:{
          message: "Invalide credential password wrong",
          type:"password"
        }
      })
    }

    generateTokenAndSetCookie(res, user._id)

    user.lastLoginDate = new Date()
    await user.save()

    return res.status(201).json({
      success: true,
      message: "Logged in successfully",
      user: {
        ...user._doc,
        password: undefined
      }
    })
    
  } catch (error) {
    res.status(400).json({
      success:false,
      message: error.message
    })
  }
}

export const logout = async (req,res,next)=>{
  try {
    const token = req.cookies.u_t;

    if (token) {
      const decoded = jwt.decode(token);
      if (decoded) {
        await TokenBlacklist.create({
          token,
          expiresAt: new Date(decoded.exp * 1000),
        });
      }
    }
  
    res.clearCookie('u_t');
    res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    res.status(400).json({
      success:false,
      message: error.message
    })
  }
}

export const forgotPassword = async(req,res,next)=>{
  const {email} =  req.body

  try {

    const errors = validationResult(req)
    if(!errors.isEmpty()){
      return res.status(400).json({
        success:false,
        message: errors.array(),
      })
    }

    const user = await User.findOne({email:email})

    if(!user){
      console.log("Invalide email")
      return res.status(400).json({
        success:false,
        message: "Invalide email"
      })
    }

    const resetPasswordToken = crypto.randomBytes(20).toString('hex')
    const resetPasswordExpiresAt = Date.now() + 1 * 60 * 60 * 1000 // 1 hour

    user.resetPasswordToken = resetPasswordToken
    user.resetPasswordExpiresAt = resetPasswordExpiresAt

    await user.save()

    res.status(200).json({
      success:true,
      message: "Password reset link sent to your email"
    })

  } catch (error) {
    return res.status(400).json({
      success:false,
      message: error.message
    })
  }
}

export const resetPassword = async(req,res,next)=>{
  try {

    const errors = validationResult(req)
    if(!errors.isEmpty()){
      return res.status(400).json({
        success:false,
        message: errors.array(),
      })
    }

    const token = req.params.token
    const {password, confirmPassword} = req.body
    
    const user = await User.findOne({resetPasswordToken: token, resetPasswordExpiresAt: {$gt: Date.now()}})

    if(!user){
      return res.status(400).json({
        success:false,
        message: "Invalide or expired reset token"
      })
    }

    const isSamePassword = await bcrypt.compare(password, user.password);
    if (isSamePassword) {
      return res.status(400).json({
        success: false,
        message: "You can't use your current password",
      });
    }

    const updateHashPassword = await bcrypt.hash(password,12)

    user.password = updateHashPassword
    user.resetPasswordToken = undefined;
    user.resetPasswordExpiresAt = undefined;
  
    await user.save()

    res.status(200).json({
      success:true,
      message: "Password reset successfully"
    })

  } catch (err) {
    return res.status(400).json({
      success:false,
      message: err.message
    })
  }
}

export const checkAuth = async (req,res,next)=>{
  try {
    const user = req.user
    console.log(user)
    if(!user){
      return res.status(400).json({
        success:false,
        message: "User don't exist"
      })
    }
    return res.status(200).json({
      success:true,
      user:user
    })
  } catch (err) {
    return res.status(400).json({
      success:false,
      message: err.message
    })
  }
}