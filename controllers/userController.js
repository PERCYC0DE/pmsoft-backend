import User from "../models/User.js";
import generateId from "../helpers/generateId.js";
import generateJWT from "../helpers/generateJWT.js";

const registerUser = async (req, res) => {
  // Validate duplicated register
  const { email } = req.body;
  const existsUser = await User.findOne({ email });

  if (existsUser) {
    const error = new Error("User already exists");
    return res.status(400).json({
      status: "error",
      message: error.message,
    });
  }

  try {
    const user = new User(req.body);
    user.token = generateId();
    const userSaved = await user.save();
    res.json({
      status: "success",
      data: userSaved,
    });
  } catch (error) {
    console.log(error);
    return;
  }
};

const authenticateUser = async (req, res) => {
  const { email, password } = req.body;

  // Validate if users exists
  const user = await User.findOne({ email });
  if (!user) {
    const error = new Error("Error al iniciar sesión. Revise sus credenciales");
    return res.status(404).json({
      status: "error",
      message: error.message,
    });
  }

  // Validate confirmed user
  if (!user.confirmed) {
    const error = new Error("Tu cuenta no ha sido confirmada");
    return res.status(404).json({
      status: "error",
      message: error.message,
    });
  }

  // Validate Password with custom function in Model
  if (await user.validatePassword(password)) {
    res.json({
      status: "success",
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateJWT(user._id),
      },
    });
  } else {
    const error = new Error("Error al iniciar sesión. Revise sus credenciales");
    return res.status(404).json({
      status: "error",
      data: error.message,
    });
  }
};

const confirmUser = async (req, res) => {
  const { token } = req.params;
  const userToConfirm = await User.findOne({ token });
  if (!userToConfirm) {
    const error = new Error("El tóken enviado no es válido");
    return res.status(400).json({
      status: "error",
      message: error.message,
    });
  }

  try {
    userToConfirm.confirmed = true;
    userToConfirm.token = "";
    await userToConfirm.save();
    res.status(200).json({
      status: "success",
      message: "Usuario confirmado correctamente",
    });
  } catch (error) {
    console.log(error);
  }
};

const resetPasswordUser = async (req, res) => {
  const { email } = req.body;
  const requestedUser = await User.findOne({ email });

  if (!requestedUser) {
    const error = new Error("No existe el correo enviado");
    return res.status(400).json({
      status: "error",
      message: error.message,
    });
  }

  try {
    requestedUser.token = generateId();
    await requestedUser.save();
    res.json({
      status: "success",
      message: "Hemos enviado un email con las instrucciones",
    });
  } catch (error) {
    console.log(error);
  }
};

const validateToken = async (req, res) => {
  const { token } = req.params;

  const tokenExists = await User.findOne({ token });
  if (tokenExists) {
    res.status(200).json({
      status: "success",
      message: "Token válido",
    });
  } else {
    const error = new Error("EL tóken enviado no es válido.");
    return res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};

const setNewPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  const isTokenOfUser = await User.findOne({ token });
  if (isTokenOfUser) {
    isTokenOfUser.password = password;
    isTokenOfUser.token = "";
    try {
      await isTokenOfUser.save();
      res.json({
        status: "success",
        message: "Contraseña cambiada correctamente.",
      });
    } catch (error) {
      console.log(error);
    }
  } else {
    const error = new Error("EL tóken enviado no es válido.");
    return res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};

const profileUser = async (req, res) => {
  const { user } = req;
  res.json({
    status: "success",
    data: user,
  });
};

export {
  registerUser,
  authenticateUser,
  confirmUser,
  resetPasswordUser,
  validateToken,
  setNewPassword,
  profileUser,
};
