import Project from "../models/Project.js";

//=> Get all projects
const getProjects = async (req, res) => {
  const projects = await Project.find().where("owner").equals(req.user); // Get projects only of one owner user
  res.json({
    status: "success",
    data: projects,
  });
};

//=> Create a new Project
const newProject = async (req, res) => {
  const project = new Project(req.body);
  project.owner = req.user._id;

  try {
    const projectSaved = await project.save();
    res.json({
      status: "success",
      data: projectSaved,
    });
  } catch (error) {
    //TODO: Add message for show error
    console.log(error);
  }
};

//=> Get one Project
const getOneProject = async (req, res) => {
  const { id } = req.params;

  const existsProject = await Project.findById(id);

  if (!existsProject) {
    const error = new Error("No se ha podido encontrar el proyecto solicitado");
    return res.status(404).json({
      status: "error",
      message: error.message,
    });
  }

  if (existsProject.owner.toString() !== req.user._id.toString()) {
    const error = new Error("No cuenta con permisos para ver este proyecto");
    return res.status(404).json({
      status: "error",
      message: error.message,
    });
  }

  res.json({
    status: "success",
    data: existsProject,
  });
};

//=> Update one Project
const editProject = async (req, res) => {
  const { id } = req.params;

  const existsProject = await Project.findById(id);

  if (!existsProject) {
    const error = new Error("No se ha podido encontrar el proyecto solicitado");
    return res.status(404).json({
      status: "error",
      message: error.message,
    });
  }

  if (existsProject.owner.toString() !== req.user._id.toString()) {
    const error = new Error("No cuenta con permisos para ver este proyecto");
    return res.status(404).json({
      status: "error",
      message: error.message,
    });
  }

  existsProject.name = req.body.name || existsProject.name;
  existsProject.description = req.body.description || existsProject.description;
  existsProject.dateDelivery =
    req.body.dateDelivery || existsProject.dateDelivery;
  existsProject.client = req.body.client || existsProject.client;

  try {
    const projectSaved = await existsProject.save();
    res.json({
      status: "success",
      message: "Proyecto actualizado correctamente",
    });
  } catch (error) {
    console.log(error);
  }
};

//=> Delete one Project
const deleteProject = async (req, res) => {
  const { id } = req.params;

  const existsProject = await Project.findById(id);

  if (!existsProject) {
    const error = new Error("No se ha podido encontrar el proyecto solicitado");
    return res.status(404).json({
      status: "error",
      message: error.message,
    });
  }

  if (existsProject.owner.toString() !== req.user._id.toString()) {
    const error = new Error("No cuenta con permisos para ver este proyecto");
    return res.status(404).json({
      status: "error",
      message: error.message,
    });
  }

  try {
    await existsProject.deleteOne();
    res.json({
      status: "success",
      message: "El proyecto ha sido eliminado.",
    });
  } catch (error) {
    console.log(error);
  }
};

const addCollaborator = async (req, res) => {};

const deleteCollaborator = async (req, res) => {};

const getTasks = async (req, res) => {};

export {
  getProjects,
  getOneProject,
  newProject,
  editProject,
  deleteProject,
  addCollaborator,
  deleteCollaborator,
  getTasks,
};
