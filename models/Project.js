import mongoose from "mongoose";

const ProjectSchema = mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
    },
    description: {
      type: String,
      trim: true,
      required: true,
    },
    dateDelivery: {
      type: Date,
      default: Date.now(),
    },
    client: {
      type: String,
      trim: true,
      required: true,
    },
    tasks: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Task",
      },
    ],
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    collaborators: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Project = mongoose.model("Project", ProjectSchema);
export default Project;
