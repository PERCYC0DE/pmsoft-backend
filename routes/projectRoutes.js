import express from "express";
import {
  getProjects,
  getOneProject,
  newProject,
  editProject,
  deleteProject,
  addCollaborator,
  deleteCollaborator,
  searchCollaborator,
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
  .post("/collaborators", checkAuth, searchCollaborator)
  .post("/collaborators/:id", checkAuth, addCollaborator)
  .post("/delete-collaborator/:id", checkAuth, deleteCollaborator);

export default router;
