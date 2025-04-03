import { Schema, model, models } from "mongoose";

// Define the Address sub-schema
const AddressSchema = new Schema(
  {
    street: {
      type: String,
    },
    city: {
      type: String,
    },
    state: {
      type: String,
    },
    postalCode: {
      type: String,
    },
    country: {
      type: String,
    },
  },
  { _id: false } // Prevents creation of a separate _id for the address subdocument
);

// Define the User schema
const UserSchema = new Schema(
  {
    firstName: {
      type: String,
      required: [true, "First Name is required"],
    },
    lastName: {
      type: String,
      required: [true, "Last Name is required"],
    },
    email: {
      type: String,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    mobileNumber: {
      type: String
    },
    subdomain: {
      type: String
    },
    address: AddressSchema, // Embed the Address schema
  },
  { timestamps: true }
);

// Create or retrieve the User model
const User = models.User || model("User", UserSchema);
export default User;
