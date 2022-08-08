import jwt from "jsonwebtoken";
import User from "../models/User.js";

const checkAuth = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      // Save in the request the info of User
      req.user = await User.findById(decoded.id).select(
        "-password -confirmed -token -createdAt -updatedAt -__v"
      );
      return next();
    } catch (error) {
      return res.status(404).json({
        status: "error",
        message: "Hubo un error al validar el token",
      });
    }
  }

  if (!token) {
    const error = new Error("Tóken no válido");
    return res.status(401).json({
      status: "error",
      message: error.message,
    });
  }

  next();
};

export default checkAuth;
