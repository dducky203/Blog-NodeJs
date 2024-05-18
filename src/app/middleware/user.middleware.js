import { isValidObjectId } from "mongoose";
import { responseError } from "@/utils/helpers";
import { User } from "@/app/models";

export const checkUserId = async function (req, res, next) {
    const _id = req.params.id;

    if (isValidObjectId(_id)) {
        const user = await User.findOne({ _id });
        if (user) {
            req.user = user;
            return next();
        }
    }

    return responseError(res, 404, "Người dùng không tồn tại hoặc đã bị xóa");
};

export const checkUserIdDeleted = async (req, res, next) => {
    const _id = req.params.id;

    const user = await User.findOneDeleted({ _id });
    if (user) {
        req.user = user;
        return next();
    }

};

export const checkUserEmail = async (req, res, next) => {
    const email = req.body.email;

    const user = await User.findOne({ email: email });
    if (user) {
        req.user = user;
        return next();
    }
    return responseError(res, 404, "Người dùng không tồn tại hoặc đã bị xóa ");

};



