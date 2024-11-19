export const checkAdmin = (req, res, next) => {
  try {
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admins only.',
      });
    }
    next();
  
  } catch (error) {
    return res.status(500).json({
      success:false,
      message: "Error in verify token"
    })
  }
};
