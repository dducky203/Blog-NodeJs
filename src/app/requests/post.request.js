import Joi from "joi";
import { MAX_STRING_SIZE, JOI_DEFAULT_MESSAGE } from "@/configs";
import { tryValidateOrDefault } from "@/utils/helpers";


export const getPosts = Joi.object({
    q: tryValidateOrDefault(Joi.string().trim(), ""),
    page: tryValidateOrDefault(Joi.number().integer().min(1), 1),
    per_page: tryValidateOrDefault(Joi.number().integer().min(1).max(100), 20),
    field: tryValidateOrDefault(Joi.valid("created_at", "title", "author_id", "categories"), "created_at"),
    sort_order: tryValidateOrDefault(Joi.valid("asc", "desc"), "asc"),
}).unknown(true);

export const createPost = Joi.object({
    title: Joi.string().trim().max(MAX_STRING_SIZE).required().label("Tiêu đề bài viết"),
    content: Joi.string().trim().required().label("Nội dung bài viết"),
    author_id: Joi.string().trim().required().label("ID tác giả"),
    categories: Joi.array().items(
        Joi.string()
            .trim()
    )
        .label("Danh mục")

}).messages(JOI_DEFAULT_MESSAGE);

export const updatePost = Joi.object({
    title: Joi.string().trim().max(MAX_STRING_SIZE).label("Tiêu đề bài viết"),
    content: Joi.string().trim().label("Nội dung bài viết"),
    author_id: Joi.string().trim().label("ID tác giả"),
    categories: Joi.array().items(
        Joi.string()
            .trim()
    )
        .label("Danh mục")
}).messages(JOI_DEFAULT_MESSAGE);