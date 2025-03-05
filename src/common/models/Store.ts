import { Schema, model, models } from "mongoose";

const StoreScheme = new Schema(
    {
        Storename: {
            type: String,
            required: [true, "Fist Naame is required"],
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
        storeName: {
            type: String,
        },
        createdAt: { type: Date, default: Date.now },
    },
    { timestamps: true }
);

const Store = models.StoreScheme || model("Store", StoreScheme);
export default Store;
