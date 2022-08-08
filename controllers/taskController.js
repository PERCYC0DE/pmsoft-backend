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
    return res.json({
      status: "success",
      data: taskSaved,
    });
  } catch (error) {
    console.log(error);
  }
};

//=> Get one Task
const getTask = async (req, res) => {};

//=> Update one Task
const updateTask = async (req, res) => {};

//=> Delete one Task
const deleteTask = async (req, res) => {};

//=> Change the status of one task
const changeStatusTask = async (req, res) => {};

export { addTask, getTask, updateTask, deleteTask, changeStatusTask };
