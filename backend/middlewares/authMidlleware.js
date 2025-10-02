import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";

// حماية المسارات للمستخدمين المسجلين
export const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      // أخذ التوكن من الهيدر
      token = req.headers.authorization.split(" ")[1];

      // التحقق من صحة التوكن
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // جلب بيانات المستخدم بدون كلمة المرور
      req.user = await User.findById(decoded.id).select("-password");

      return next(); // متابعة التنفيذ
    } catch (error) {
      console.error(error.message);
      res.status(401);
      return next(new Error("Not authorized, token failed"));
    }
  }

  if (!token) {
    res.status(401);
    return next(new Error("Not authorized, no token"));
  }
});

// التحقق من صلاحيات المدير
export const admin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    return next();
  } else {
    res.status(401);
    return next(new Error("Not authorized as an admin"));
  }
};
