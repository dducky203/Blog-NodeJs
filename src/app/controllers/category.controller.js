import * as categoryService from "@/app/services/category.service";
// import * as postService from "@/app/services/post.service";
import { responseSuccess } from "@/utils/helpers";

export const createCategory = async (req, res) => {
    await categoryService.create(req.body);
    return responseSuccess(res, null, 201);
};

export const getListCategory = async (req, res) => {
    return responseSuccess(
        res,
        await categoryService.filter(req.query),
        201
    );
};

export const detailsCategory = async (req, res) => {
    return responseSuccess(
        res,
        await categoryService.details(req.params.id),
        201
    );
};

export const updateCategory = async (req, res) => {
    
    await categoryService.update(req.category, req.body);
    return responseSuccess(res, null, 201);
};

export const deleteCategory = async (req, res) => {
    await categoryService.remove(req.params.id);
    return responseSuccess(res, null, 201);
};

export const deleteManyCategories = async (req, res) => {
    await categoryService.deleteManyCategories(req.body.categories);
    return responseSuccess(res, null, 201);
};