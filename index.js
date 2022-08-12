import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import tasksRoutes from "./routes/taskRoutes.js";
import cors from "cors";

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
// Middlewares
app.use(express.json());

// Routing
app.use("/api/users", userRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/tasks", tasksRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running in port ${PORT}`);
});
