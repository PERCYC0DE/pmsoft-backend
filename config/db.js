import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const connection = await mongoose.connect(process.env.URI_MONGO);
    const urlMongo = `${connection.connection.host}:${connection.connection.port} `;
    console.log(`MongoDB connected in ${urlMongo}`);
  } catch (error) {
    console.log(`Error: ${error.message}`);
    process.exit(1); // Finish with the process
  }
};

export default connectDB;
