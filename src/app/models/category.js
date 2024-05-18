import mongoose from "mongoose";
import { createModel } from "./base";

export const Category = createModel("Category", "categories", {

    categoryName: {
        type: String,
        required: true
    },

    description: String,
    posts: [{
        type: mongoose.Schema.Types.ObjectId, ref: "Post",
        //default: ""
    }],

});

