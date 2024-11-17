import jwt from  'jsonwebtoken'
import { TokenBlacklist } from '../models/blackList.model.js'
import { User } from '../models/user.model.js'


export const verfiyToken = async (req,res,next)=>{
  const token = req.cookies.u_t

  if(!token){
    return res.status(400).json({
      success: false,
      message: "UnAuthorized - no token provide"
    })
  }

  try {
    const blacklistedToken = await TokenBlacklist.findOne({ token });
    if (blacklistedToken) {
      return res.status(401).json({
        success: false,
        message: "Token is invalidated",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(500).json({
      success:false,
      message: "Error in verify token"
    })
  }
}