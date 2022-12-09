import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import tasksRoutes from "./routes/taskRoutes.js";

// Settings
const app = express();
dotenv.config();
connectDB();
// Config CORS
const whitelist = [process.env.FRONTEND_URL];
const corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.includes(origin)) {
      // Can go to the API
      callback(null, true);
    } else {
      // Access Denied to the API
      callback(new Error("Errors de CORS"));
    }
  },
};
app.use(cors(corsOptions));
app.use(cors());
// Middlewares
app.use(express.json());

// Routing
app.get("/", (req, res) => {
  res.send("Welcome to my API PMSoft");
});
app.use("/api/users", userRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/tasks", tasksRoutes);

const PORT = process.env.PORT || 4000;
const serverapi = app.listen(PORT, () => {
  console.log(`Server running in port ${PORT}`);
});

/**
 * OPEN SOCKET.IO CONNECTION
 */

// Configure server
import { Server } from "socket.io";
const io = new Server(serverapi, {
  pingTimeout: 60000,
  cors: {
    origin: process.env.FRONTEND_URL,
  },
});

// Create connection
io.on("connection", (socket) => {
  // Define the events of socketIO
  socket.on("open project", (project) => {
    // Create a room for each user. This save the reference for each user
    socket.join(project);

    // Example: Create an emit for one user. Use the id
    // socket.to("63079da59fb282e27a9b2865").emit("response", { name: "Percy" });
  });

  // Socket when user create a new task
  socket.on("new task", (task) => {
    const project = task.project;
    // Emit a new event only inside the room socket. Remember: the project param is the ID of the project
    socket.to(project).emit("task add", task);
  });

  // Socket when user delete one task
  socket.on("delete task", (task) => {
    const project = task.project;
    socket.to(project).emit("task deleted", task);
  });

  // Socket when user update one task
  socket.on("update task", (task) => {
    const project = task.project._id;
    socket.to(project).emit("task updated", task);
  });

  // Socket when user change the status of one task
  socket.on("change status", (task) => {
    const project = task.project._id;
    socket.to(project).emit("new state", task);
  });
});
