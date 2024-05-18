import { Schema, Types, model } from "mongoose";
import mongooseDelete from "mongoose-delete";

export function createModel(name, collection, definition, options) {
    const schema = new Schema(
        // {
        //     ...definition,
        //     deleted_at: {
        //         type: Date,
        //         default: null,
        //     },
        // },
        definition,
        {
            timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
            versionKey: false,
            ...(options ? options : {}),
        }
    );

    schema.plugin(mongooseDelete,
        { 
            overrideMethods: "all",
            deletedAt : true,
        });

    return model(name, schema, collection);
}

export const { ObjectId } = Types;
