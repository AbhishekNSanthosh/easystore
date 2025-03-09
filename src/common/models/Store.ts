import { Schema, model, models } from "mongoose";

const StoreScheme = new Schema(
    {
        vendorId: {
            type: Schema.Types.ObjectId, // ✅ Corrected `Schema.ObjectId` → `Schema.Types.ObjectId`
            required: [true, "Owner ID is required"],
            ref: "User", // (Optional) If it references a User model
        },
        storeName: {
            type: String,
            required: [true, "Fist Naame is required"],
        },
        primaryColor: {
            type: String,
            required: true
        },
        logoUrl: {
            type: String,
        },
        bannerImg: [
            {
                type: String,
            }
        ],
        colors: {
            primary: {
                type: String,
            },
            secondary: {
                type: String,
            }
        },
        locations: {
            type: String,
        },
        createdAt: { type: Date, default: Date.now },
    },
    { timestamps: true }
);

const Store = models.Store || model("Store", StoreScheme);
export default Store;
