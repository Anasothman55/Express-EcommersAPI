import { check,body } from 'express-validator'
import { User } from '../models/user.model.js'

const basicEmailValidation = check('email')
  .isEmail()
  .withMessage("Please enter a valid email")
  .normalizeEmail();

const emailValidation =  check('email').isEmail().withMessage("Please enter valide email")
.custom( async (value,{req})=>{
  const user = await User.findOne({email:value})
  if(user){
    return Promise.reject('That user already exist')
  }
  return true
}).normalizeEmail()

const passwordValidation = (checks) =>{
  return(
    check(checks)
  .isLength({ min: 8 })
  .withMessage("At least 8 characters")
  .custom((value, { req }) => {
    const requirements = [
      { label: "Contains uppercase letter", met: /[A-Z]/.test(value) },
      { label: "Contains lowercase letter", met: /[a-z]/.test(value) },
      { label: "Contains a number", met: /\d/.test(value) },
      { label: "Contains special character", met: /[^A-Za-z0-9]/.test(value) },
    ];
    const unmet = requirements.filter(req => !req.met).map(req => req.label);
    if (unmet.length > 0) {
      throw new Error(`Password must meet the following: ${unmet.join(', ')}`);
    }
    return true;  
  }).trim()
  )
} 

export const signUpValidatons = [
  emailValidation,
  passwordValidation('password'),
    check('username')
    .notEmpty()
    .withMessage("Username required ")
    .isAlphanumeric()
    .withMessage("Username can only contain letters and numbers.")
    .isLength({ min: 3, max: 20 })
    .withMessage("Username must be between 3 and 20 characters.")
    .custom(async (value, { req }) => {
      const user = await User.findOne({ username: value });
      if (user) {
        return Promise.reject('That username is already taken.');
      }
      return true;
    })
    .trim()
    .escape(),
]

export const verifyAccountValidation = [
  check('token')
  .notEmpty()
  .withMessage('Token is required')
  .isLength({ min: 6, max: 6 })
  .withMessage('Token must be exactly 6 digits')
  .matches(/^\d{6}$/)
  .withMessage('Token must only contain numeric digits'),
]

export const loginValidatons = [
  basicEmailValidation,
  check('password')
    .isLength({ min: 8 })
    .withMessage("At least 8 characters").trim(),
]

export const forgotPasswordValidations = [
  basicEmailValidation
]

export const resetPasswordValidations = [
  passwordValidation('password'),
  passwordValidation('confirmPassword'),
  body('confirmPassword')
  .custom((value, {req})=>{
    if(value !== req.body.password){
      throw new Error('Password have to match')
    }
    return true
  })
]