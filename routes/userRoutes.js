import express from "express";
const router = express.Router();

import {
  registerUser,
  authenticateUser,
  confirmUser,
  resetPasswordUser,
  validateToken,
  setNewPassword,
  profileUser,
} from "../controllers/userController.js";

import checkAuth from "../middlewares/checkAuth.js";
// Authenticate, create, register and confirm users
router
  .post("/", registerUser)
  .post("/login", authenticateUser)
  .get("/confirm/:token", confirmUser)
  .post("/reset-password", resetPasswordUser)
  .get("/reset-password/:token", validateToken)
  .post("/reset-password/:token", setNewPassword)
  .get("/profile", checkAuth, profileUser);

export default router;
