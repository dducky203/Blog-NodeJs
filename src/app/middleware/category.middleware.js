import { Category } from "../models/category";
import { isValidObjectId } from "mongoose";
import { responseError } from "@/utils/helpers";


export const checkCategoryId = async (req, res, next) => {
    const _id = req.params.id;
    if (isValidObjectId(_id)) {
        const category = await Category.findOne({ _id });
        if (category) {
            req.category = category;
            return next();
        }
    }

    responseError(res, 404, "Danh mục không tồn tại hoặc đã bị xóa !");
};

export const checkCategoryIdsInBody = async (req, res, next) => {
    const categoryIds = req.body.categories;

    if (categoryIds) {
        for (const _id of categoryIds) {
            if (isValidObjectId(_id)) {
                const category = await Category.findById(_id);

                if (!category) {
                    return responseError(res, 404, `Danh mục với id: ${_id} không tồn tại hoặc đã bị xóa !`);
                }
            }
        }
    }
    next();
};