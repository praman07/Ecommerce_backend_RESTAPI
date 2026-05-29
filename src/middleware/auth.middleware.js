const  jwt = require('jsonwebtoken');
const UserModel = require('../model/user.model');
const authMiddleware = async(req , res , next) => {
    try {
        const token = req.cookies.accessToken;

        if(!token)
            return res.status(401).json({
        message:"Access Denied: No active session found",
        success:false
})
    const decoded = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
    const user = await UserModel.findById(decoded.id);
     
    if(!user) {
      return res.status(401).json({
        success: false,
        message: "User account no longer exists in the system",
      });
    }
    req.user = user; // Share user profile data with any subsequent controller methods
    next(); // Security checks pass cleanly! Proceed to the next controller route task.
    
  } catch (error) {
    console.error("Authentication Middleware Catch:", error.message);
    
    // Explicitly handle token expiration so the user/frontend gets a clear message to renew sessions
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Session expired, please refresh token or log in again",
      });
    }

    return res.status(401).json({
      success: false,
      message: "Authentication validation failed: Session invalid",
    });
  }
};

module.exports = authMiddleware;