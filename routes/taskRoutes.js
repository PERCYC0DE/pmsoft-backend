import express from "express";
import checkAuth from "../middlewares/checkAuth.js";
import {
  addTask,
  getTask,
  updateTask,
  deleteTask,
  changeStatusTask,
} from "../controllers/taskController.js";

const router = express.Router();

router.post("/", checkAuth, addTask);
router
  .route("/:id")
  .get(checkAuth, getTask)
  .put(checkAuth, updateTask)
  .delete(checkAuth, deleteTask);
router.post("/status/:id", checkAuth, changeStatusTask);

export default router;
