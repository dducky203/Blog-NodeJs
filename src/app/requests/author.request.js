import Joi from "joi";
import { Author, User } from "../models";
import { MAX_STRING_SIZE, VALIDATE_PHONE_REGEX,JOI_DEFAULT_MESSAGE } from "@/configs";
import { AsyncValidate, FileUpload } from "@/utils/types";
import { tryValidateOrDefault } from "@/utils/helpers";

export const readRoot = Joi.object({
    q: tryValidateOrDefault(Joi.string().trim(), ""),
    page: tryValidateOrDefault(Joi.number().integer().min(1), 1),
    per_page: tryValidateOrDefault(Joi.number().integer().min(1).max(100), 20),
    field: tryValidateOrDefault(Joi.valid("created_at", "name", "phone", "email"), "created_at"),
    sort_order: tryValidateOrDefault(Joi.valid("asc", "desc"), "asc"),
}).unknown(true);

export const createAuthor = Joi.object({
    name: Joi.string().trim().max(MAX_STRING_SIZE).required().label("Họ tên"),

    avatar: Joi.object({
        originalname: Joi.string().trim().label("Tên ảnh"),
        mimetype: Joi.valid("image/jpeg", "image/png", "image/svg+xml", "image/webp")
            .required()
            .label("Định dạng ảnh"),
        buffer: Joi.binary().required().label("Ảnh đại diện"),
    })
        .instance(FileUpload)
        .allow("")
        .label("Ảnh đại diện"),

    phone: Joi.string()
        .trim()
        .pattern(VALIDATE_PHONE_REGEX)
        .allow("")
        .required()
        .label("Số điện thoại")
        .custom(
            (value, helpers) =>
                new AsyncValidate(value, async function () {
                    const author = await Author.findOne({ phone: value });
                    const user = await User.findOne({ phone: value });
                    return !author && !user ? value : helpers.error("any.exists");
                })
        ),

    email: Joi.string()
        .trim()
        .max(MAX_STRING_SIZE)
        .email()
        .required()
        .label("Email")
        .custom(
            (value, helpers) =>
                new AsyncValidate(value, async function () {
                    const author = await Author.findOne({ email: value });
                    const user = await User.findOne({ email: value });
                    return !author && !user ? value : helpers.error("any.exists");
                }),
        ),

    bio: Joi.string().trim().label("Tiểu sử tác giả")

}).messages(JOI_DEFAULT_MESSAGE);

export const updateAuthor = Joi.object({
    name: Joi.string().trim().max(MAX_STRING_SIZE).label("Họ tên"),
    avatar: Joi.object({
        originalname: Joi.string().trim().required().label("Tên ảnh"),
        mimetype: Joi.valid("image/jpeg", "image/png", "image/svg+xml", "image/webp")
            .required()
            .label("Định dạng ảnh"),
        buffer: Joi.binary().required().label("Ảnh đại diện"),
    })
        .instance(FileUpload)
        .allow("")
        .label("Ảnh đại diện"),

    phone: Joi.string()
        .trim()
        .pattern(VALIDATE_PHONE_REGEX)
        .allow("")
        .label("Số điện thoại")
        .custom(
            (value, helpers) =>
                new AsyncValidate(value, async function () {
                    const author = await Author.findOne({ phone: value });
                    const user = await User.findOne({ phone: value });
                    return !author && !user ? value : helpers.error("any.exists");
                }),
        ),

    email: Joi.string()
        .trim()
        .max(MAX_STRING_SIZE)
        .email()
        .label("Email")
        .custom(
            (value, helpers) =>
                new AsyncValidate(value, async function () {
                    const author = await Author.findOne({ email: value });
                    const user = await User.findOne({ email: value });
                    return !author && !user ? value : helpers.error("any.exists");
                }),
        ),

    bio: Joi.string().trim().label("Tiểu sử tác giả")

}).messages(JOI_DEFAULT_MESSAGE);
