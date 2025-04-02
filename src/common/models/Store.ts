import { Schema, model, models } from "mongoose";

const StoreScheme = new Schema(
    {
        vendorId: {
            type: Schema.Types.ObjectId, // ✅ Corrected `Schema.ObjectId` → `Schema.Types.ObjectId`
            required: [true, "Owner ID is required"],
            ref: "User", // (Optional) If it references a User model
        },
        subdomain: {
            type: String,
            required: true,
        },
        storeName: {
            type: String,
            required: [true, ""],
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
