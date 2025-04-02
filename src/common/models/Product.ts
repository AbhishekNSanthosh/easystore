import mongoose, { Schema, model, models } from "mongoose";

interface IProduct extends Document {
  title: string;
  price: number;
  oldPrice?: number;
  ownedBy: string;
  imgUrl: string;
}

const ProductSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    oldPrice: {
      type: Number,
    },
    ownedBy: {
      type: String,
      required: true
    },
    imgUrl: {
      type: String,
      required: true,
    },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);
const Product = mongoose.models.Product || mongoose.model<IProduct>("Product", ProductSchema);

export default Product;