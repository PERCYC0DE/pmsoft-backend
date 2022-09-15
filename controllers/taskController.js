import Project from "../models/Project.js";
import Task from "../models/Tasks.js";

/* CREATE A NEW TASK */
const addTask = async (req, res) => {
  const { project } = req.body;
  const existsProject = await Project.findById(project);

  // Validate that the project exists
  if (!existsProject) {
    const error = new Error("El proyecto no existe");
    return res.status(404).json({
      status: "error",
      message: error.message,
    });
  }

  // Validate project creator
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
    // return res.json({
    //   status: "success",
    //   data: taskSaved,
    // });
    return res.json(taskSaved);
  } catch (error) {
    console.log(error);
  }
};

/* GET ONE TASK */
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

/* UPDATE ONE TASK */
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

/* DELETE ONE TASK */
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
    const project = await Project.findById(task.project);
    project.tasks.pull(task._id);
    // Encadenar todas las promesas
    await Promise.allSettled([await project.save(), await task.deleteOne()]);

    res.json({
      status: "success",
      message: "Tarea eliminada correctamente.",
    });
  } catch (error) {
    console.log(error);
  }
};

/* CHANGE THE STATUS OF A TASK */
const changeStatusTask = async (req, res) => {
  const { id } = req.params;
  const task = await Task.findById(id)
    .populate("project")
    .populate("completed");

  if (!task) {
    const error = new Error("La tarea consultada no existe.");
    return res.status(404).json({
      status: "error",
      message: error.message,
    });
  }

  // Validate permissions
  if (
    task.project.owner.toString() !== req.user._id.toString() &&
    !task.project.collaborators.some(
      (collaborator) => collaborator._id.toString() === req.user._id.toString()
    )
  ) {
    const error = new Error("No tiene permisos para realizar esta consulta.");
    return res.status(403).json({
      status: "error",
      message: error.message,
    });
  }

  //Change the status of task
  task.status = !task.status;
  task.completed = req.user._id;
  await task.save();

  const taskSaved = await Task.findById(id)
    .populate("project")
    .populate("completed");

  res.json(taskSaved);
};

export { addTask, getTask, updateTask, deleteTask, changeStatusTask };
