import Joi from "joi";
import { JOI_DEFAULT_MESSAGE } from "@/configs";
import { tryValidateOrDefault } from "@/utils/helpers";

export const getCategory = Joi.object({
    q: tryValidateOrDefault(Joi.string().trim(), ""),
    page: tryValidateOrDefault(Joi.number().integer().min(1), 1),
    per_page: tryValidateOrDefault(Joi.number().integer().min(1).max(100), 20),
    field: tryValidateOrDefault(Joi.valid("created_at", "categoryName"), "categoryName"),
    sort_order: tryValidateOrDefault(Joi.valid("asc", "desc"), "asc"),
}).unknown(true);

export const createCategory = Joi.object({
    categoryName: Joi.string().trim().required().label("Tên danh mục"),
    description: Joi.string().trim().allow("").label("Mô tả danh mục"),
    posts: Joi.array().items(
        Joi.string()
            .trim())
        .allow("")
        .label("Bài viết")

}).messages(JOI_DEFAULT_MESSAGE);

export const updateCategory = Joi.object({
    categoryName: Joi.string().trim().label("Tên danh mục"),
    description: Joi.string().trim().allow("").label("Mô tả danh mục"),
    posts: Joi.array().items(
        Joi.string()
            .trim()
    )
        .allow("")
        .label("Bài viết")

}).messages(JOI_DEFAULT_MESSAGE);