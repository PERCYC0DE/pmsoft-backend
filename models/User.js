import mongoose from "mongoose";
import bcrypt from "bcrypt";

// Model declaration
const UserSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    token: {
      type: String,
    },
    confirmed: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Use hooks for hash password
UserSchema.pre("save", async function (next) {
  // If password not is change, then not hash again
  if (!this.isModified("password")) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Add custom functions into Model
UserSchema.methods.validatePassword = async function (passwordForm) {
  return await bcrypt.compare(passwordForm, this.password);
};

// Define the model
const User = mongoose.model("User", UserSchema);

export default User;
