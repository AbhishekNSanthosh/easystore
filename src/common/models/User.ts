import { Schema, model, models } from "mongoose";

const UserSchema = new Schema(
  {
    firstName: {
      type: String,
      require: [true, "Fist Naame is required"],
    },
    lastName: {
      type: String,
      require: [true, "Last Name is reqired"],
    },
    email: {
      type: String,
      unique: [true, "Email already exist"],
      require: [true, "Email is required"],
    },
    password: {
      type: String,
      require: [true, "Password is required"],
    },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const User = models.User || model("User", UserSchema);
export default User;
