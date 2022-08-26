import Project from "../models/Project.js";
import Task from "../models/Tasks.js";

//=> Create a new Task
const addTask = async (req, res) => {
  const { project } = req.body;
  const existsProject = await Project.findById(project);

  if (!existsProject) {
    const error = new Error("El proyecto no existe");
    return res.status(404).json({
      status: "error",
      message: error.message,
    });
  }

  // Validar si la persona que esta dando de alta la tarea fue el que creo el proyecto
  if (existsProject.owner.toString() !== req.user._id.toString()) {
    const error = new Error("No tienes los permisos para añadir tareas");
    return res.status(404).json({
      status: "error",
      message: error.message,
    });
  }

  try {
    const taskSaved = await Task.create(req.body);
    // Save ID in the project
    existsProject.tasks.push(taskSaved._id);
    await existsProject.save();
    return res.json({
      status: "success",
      data: taskSaved,
    });
  } catch (error) {
    console.log(error);
  }
};

//=> Get one Task
const getTask = async (req, res) => {
  const { id } = req.params;

  const task = await Task.findById(id).populate("project");

  if (!task) {
    const error = new Error("La tarea consultada no existe.");
    return res.status(404).json({
      status: "error",
      message: error.message,
    });
  }

  if (task.project.owner.toString() !== req.user._id.toString()) {
    const error = new Error("No tiene permisos para realizar esta consulta.");
    return res.status(403).json({
      status: "error",
      message: error.message,
    });
  }

  res.json({
    status: "success",
    data: task,
  });
};

//=> Update one Task
const updateTask = async (req, res) => {
  const { id } = req.params;

  const task = await Task.findById(id).populate("project");

  if (!task) {
    const error = new Error("La tarea consultada no existe.");
    return res.status(404).json({
      status: "error",
      message: error.message,
    });
  }

  // Validate permissions
  if (task.project.owner.toString() !== req.user._id.toString()) {
    const error = new Error("No tiene permisos para realizar esta consulta.");
    return res.status(403).json({
      status: "error",
      message: error.message,
    });
  }

  task.name = req.body.name || task.name;
  task.description = req.body.description || task.description;
  task.priority = req.body.priority || task.priority;
  task.dateDelivery = req.body.dateDelivery || task.dateDelivery;

  try {
    const taskSaved = await task.save();
    res.json({
      status: "success",
      data: taskSaved,
    });
  } catch (error) {
    console.log(error);
  }
};

//=> Delete one Task
const deleteTask = async (req, res) => {
  const { id } = req.params;

  const task = await Task.findById(id).populate("project");

  if (!task) {
    const error = new Error("La tarea consultada no existe.");
    return res.status(404).json({
      status: "error",
      message: error.message,
    });
  }

  // Validate permissions
  if (task.project.owner.toString() !== req.user._id.toString()) {
    const error = new Error("No tiene permisos para realizar esta consulta.");
    return res.status(403).json({
      status: "error",
      message: error.message,
    });
  }

  try {
    await task.deleteOne();
    res.json({
      status: "success",
      message: "Tarea eliminada correctamente.",
    });
  } catch (error) {
    console.log(error);
  }
};

//=> Change the status of one task
const changeStatusTask = async (req, res) => {};

export { addTask, getTask, updateTask, deleteTask, changeStatusTask };
