import { Schema, model, models } from "mongoose";

const VendorSchema = new Schema(
  {
    firstName: {
      type: String,
      required: [true, "Fist Naame is required"],
    },
    lastName: {
      type: String,
      required: [true, "Last Name is reqired"],
    },
    email: {
      type: String,
      unique: [true, "Email already exist"],
      required: [true, "Email is required"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    storeName: {
        type: String,
      },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const Vendor = models.VendorSchema || model("Vendor", VendorSchema);
export default Vendor;
