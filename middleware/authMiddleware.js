import jwt from "jsonwebtoken";
import User from "../model/user.js";

export const requireSignIn = async (req, res, next) => {
  try {
    const decode = jwt.verify(
      req.headers.authorization,
      process.env.jwt_passcode
    );
    req.user = decode;
    next();
  } catch (error) {
    console.log(error);
  }
};

export const isAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    // console.log(user);
    if (!user || user.role !== 1) {
      return res.status(401).send({
        success: false,
        message: "Unuthorized admin access",
      });
    } 
      next();
    
    // console.log(error);
  } catch (error) {
    console.log(error);
    res.status(401).send({
      success: false,
      error,
      message: "Error in admin middleware",
    });
  }
};
