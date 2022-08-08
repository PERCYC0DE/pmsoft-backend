import express from "express";
import {
  getProjects,
  getOneProject,
  newProject,
  editProject,
  deleteProject,
  addCollaborator,
  deleteCollaborator,
  getTasks,
} from "../controllers/projectController.js";
import checkAuth from "../middlewares/checkAuth.js";

const router = express.Router();

router.route("/").get(checkAuth, getProjects).post(checkAuth, newProject);
router
  .route("/:id")
  .get(checkAuth, getOneProject)
  .put(checkAuth, editProject)
  .delete(checkAuth, deleteProject);

router
  .get("/tasks/:id", checkAuth, getTasks)
  .post("/add-colaborator/:id", checkAuth, addCollaborator)
  .post("/delete-colaborator/:id", checkAuth, deleteCollaborator);
export default router;
