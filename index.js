import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";

// Settings
const app = express();
dotenv.config();
connectDB();

// Middlewares
app.use(express.json());

// Routing
app.use("/api/users", userRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running in port ${PORT}`);
});
