import Project from "../models/Project.js";
import Task from "../models/Tasks.js";
import User from "../models/User.js";

/* GET ALL PROJECTS */
const getProjects = async (req, res) => {
  const projects = await Project.find({
    $or: [
      {
        collaborators: { $in: req.user },
      },
      {
        owner: { $in: req.user },
      },
    ],
  })
    // .where("owner")
    // .equals(req.user)
    .select("-tasks"); // Get projects only of one owner user
  res.json({
    status: "success",
    data: projects,
  });
};

/* GET ONE PROJECT */
const getOneProject = async (req, res) => {
  const { id } = req.params;

  const existsProject = await Project.findById(id)
    // Aplicate populate into populate
    .populate({
      path: "tasks",
      populate: { path: "completed", select: "name" },
    })
    .populate("collaborators", "name email");

  if (!existsProject) {
    const error = new Error("No se ha podido encontrar el proyecto solicitado");
    return res.status(404).json({
      status: "error",
      message: error.message,
    });
  }

  if (
    existsProject.owner.toString() !== req.user._id.toString() &&
    !existsProject.collaborators.some(
      (collaborator) => collaborator._id.toString() === req.user._id.toString()
    )
  ) {
    const error = new Error("No cuenta con permisos para ver este proyecto");
    return res.status(404).json({
      status: "error",
      message: error.message,
    });
  }

  // Get tasks of project
  // const tasks = await Task.find().where("projects").equals(existsProject._id);

  res.json({
    status: "success",
    data: {
      existsProject,
      // tasks,
    },
  });
};

/* CREATE A NEW PROJECT */
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

/* UPDATE A PROJECT */
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
      data: projectSaved,
    });
  } catch (error) {
    console.log(error);
  }
};

/* DELETE ONE PROJECT */
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

/* SEARCH A COLLABORATOR */
const searchCollaborator = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email }).select(
    "-confirmed -createdAt -password -token -updatedAt -__v"
  );

  if (!user) {
    const error = new Error("El usuario no ha podido ser encontrado");
    return res.status(404).json({
      message: error.message,
    });
  }

  res.json(user);
};

/* ADD A COLLABORATOR */
const addCollaborator = async (req, res) => {
  const project = await Project.findById(req.params.id);

  if (!project) {
    const error = new Error("El proyecto buscado no existe");
    return res.status(404).json({ message: error.message });
  }

  if (project.owner.toString() !== req.user._id.toString()) {
    const error = new Error("Acción no válidas");
    return res.status(404).json({ message: error.message });
  }

  const { email } = req.body;
  const user = await User.findOne({ email }).select(
    "-confirmed -createdAt -password -token -updatedAt -__v"
  );

  if (!user) {
    const error = new Error("El usuario no ha podido ser encontrado");
    return res.status(404).json({
      message: error.message,
    });
  }

  // El colaborador no es el admin del proyecto
  if (project.owner.toString() === user._id.toString()) {
    const error = new Error("El creador del proyecto no puede ser colaborador");
    return res.status(404).json({
      message: error.message,
    });
  }

  // Revisar que no este ya agregado al proyecto
  if (project.collaborators.includes(user._id)) {
    const error = new Error("El usuario ya pertenece al proyecto");
    return res.status(404).json({
      message: error.message,
    });
  }

  // Add to the project
  project.collaborators.push(user._id);
  await project.save();

  res.json({ message: "Colaborador agregado correctamente" });
};

/* DELETE COLLABORATOR */
const deleteCollaborator = async (req, res) => {
  const project = await Project.findById(req.params.id);

  if (!project) {
    const error = new Error("El proyecto buscado no existe");
    return res.status(404).json({ message: error.message });
  }

  if (project.owner.toString() !== req.user._id.toString()) {
    const error = new Error("Acción no válidas");
    return res.status(404).json({ message: error.message });
  }

  const { email } = req.body;

  // Can be removed
  project.collaborators.pull(req.body.id);

  await project.save();

  res.json({ message: "Colaborador eliminado correctamente" });
};

// const getTasks = async (req, res) => {
//   const { id } = req.params;

//   const existsProject = await Project.findById(id);
//   if (!project) {
//     const error = new Error("El proyecto consultado no existe");
//     return res.status(403).json({
//       status: "error",
//       message: error.message,
//     });
//   }

//   const tasks = await Task.find().where("project").equals(id);
//   res.json({
//     status: "success",
//     data: tasks,
//   });
// };

export {
  getProjects,
  getOneProject,
  newProject,
  editProject,
  deleteProject,
  addCollaborator,
  deleteCollaborator,
  searchCollaborator,
  // getTasks,
};
