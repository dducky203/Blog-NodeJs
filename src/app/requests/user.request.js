import Joi from "joi";
import { User, Author } from "../models";
import { MAX_STRING_SIZE, VALIDATE_PHONE_REGEX, JOI_DEFAULT_MESSAGE } from "@/configs";
import { AsyncValidate, FileUpload } from "@/utils/types";
import { tryValidateOrDefault } from "@/utils/helpers";

export const readRoot = Joi.object({
    q: tryValidateOrDefault(Joi.string().trim(), ""),
    page: tryValidateOrDefault(Joi.number().integer().min(1), 1),
    per_page: tryValidateOrDefault(Joi.number().integer().min(1).max(100), 20),
    field: tryValidateOrDefault(Joi.valid("created_at", "name", "email"), "created_at"),
    sort_order: tryValidateOrDefault(Joi.valid("asc", "desc"), "desc"),
}).unknown(true);

export const createItem = Joi.object({
    name: Joi.string().trim().max(MAX_STRING_SIZE).required().label("Họ và tên"),
    email: Joi.string()
        .trim()
        .max(MAX_STRING_SIZE)
        .email()
        .required()
        .label("Email")
        .custom(
            (value, helpers) =>
                new AsyncValidate(value, async function () {
                    const user = await User.findOne({ email: value });
                    const author = await Author.findOne({ email: value });
                    return !user && !author ? value : helpers.error("any.exists");
                }),
        ),
    phone: Joi.string()
        .trim()
        .pattern(VALIDATE_PHONE_REGEX)
        .allow("")
        .required()
        .label("Số điện thoại")
        .custom(
            (value, helpers) =>
                new AsyncValidate(value, async function () {
                    const user = await User.findOne({ phone: value });
                    const author = await Author.findOne({ phone: value });
                    return !user && !author ? value : helpers.error("any.exists");
                }),
        ),
    password: Joi.string().trim().min(6).max(MAX_STRING_SIZE).required().label("Mật khẩu"),
    role: Joi.string().trim().max(MAX_STRING_SIZE).allow("user").label("Quyền")
}).messages(JOI_DEFAULT_MESSAGE);

export const updateItem = Joi.object({
    name: Joi.string().trim().max(MAX_STRING_SIZE).label("Họ và tên"),
    email: Joi.string()
        .trim()
        .max(MAX_STRING_SIZE)
        .email()
        .label("Email")
        .custom(
            (value, helpers) =>
                new AsyncValidate(value, async function (req) {
                    const userId = req.params.id;
                    const user = await User.findOne({ email: value, _id: { $ne: userId } });
                    const author = await Author.findOne({ email: value });
                    return !user && !author ? value : helpers.error("any.exists");
                }),
        ),
    phone: Joi.string()
        .trim()
        .pattern(VALIDATE_PHONE_REGEX)
        .allow("")
        .label("Số điện thoại")
        .custom(
            (value, helpers) =>
                new AsyncValidate(value, async function (req) {
                    const userId = req.params.id;
                    const user = await User.findOne({ phone: value, _id: { $ne: userId } });
                    const author = await Author.findOne({ phone: value });
                    return !user && !author ? value : helpers.error("any.exists");
                }),
        ),

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

    role: Joi.string().trim().max(MAX_STRING_SIZE).allow("user").label("Quyền")

}).messages(JOI_DEFAULT_MESSAGE);

export const resetPassword = Joi.object({
    new_password: Joi.string().min(6).max(MAX_STRING_SIZE).required().label("Mật khẩu mới"),

}).messages(JOI_DEFAULT_MESSAGE);


export const forgotPassword = Joi.object({
    email: Joi.string()
        .trim()
        .max(MAX_STRING_SIZE)
        .lowercase()
        .email()
        .required()
        .label("Email"),
    
    new_password: Joi.string().min(6).max(MAX_STRING_SIZE).required().label("Mật khẩu mới"),
        
}).messages(JOI_DEFAULT_MESSAGE);