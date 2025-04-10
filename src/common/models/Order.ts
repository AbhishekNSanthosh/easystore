import mongoose, { Schema, Document, Types } from "mongoose";

interface IOrder extends Document {
  productId: Types.ObjectId;
  subdomain: string;
  address: {
    name: string;
    phone: string;
    street: string;
    city: string;
    pincode: string;
  };
  quantity: number;
  size: string;
  createdBy: Types.ObjectId;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  createdAt: Date;
}

const OrderSchema = new Schema<IOrder>(
  {
    productId: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    subdomain: {
      type: String,
      required: true,
    },
    address: {
      name: { type: String, required: true },
      phone: { type: String, required: true },
      street: { type: String, required: true },
      city: { type: String, required: true },
      pincode: { type: String, required: true },
    },
    quantity: {
      type: Number,
      min: 1,
    },
    size: {
      type: String,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "processing", "shipped", "delivered", "cancelled"],
      default: "pending",
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const Order = mongoose.models.Order || mongoose.model<IOrder>("Order", OrderSchema);

export default Order;
