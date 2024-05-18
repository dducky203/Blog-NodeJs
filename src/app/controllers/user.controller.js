import { responseError, responseSuccess } from "@/utils/helpers";
import * as userService from "../services/user.service";

export async function readRoot(req, res) {
    return responseSuccess(res, await userService.filter(req.query));
}

export async function readItem(req, res) {
    await responseSuccess(res, await userService.details(req.params.id));
}

export async function createItem(req, res) {
    await userService.create(req.body);
    return responseSuccess(res, null, 201);
}

export async function updateItem(req, res) {
    await userService.update(req.user, req.body);
    return responseSuccess(res, null, 201);
}

export async function removeItem(req, res) {
    if (req.currentUser._id.equals(req.params.id)) {
        return responseError(res, 400, "Không thể xóa chính mình");
    }

    await userService.remove(req.user);
    console.log(req.user);
    return responseSuccess(res, null, 201);
}

export async function restoreItem(req, res) {
    await userService.restore(req.params.id);
    return responseSuccess(res, null, 201);
}

export async function forceDelete(req, res) {
    await userService.forceDelete(req.params.id);
    return responseSuccess(res, null, 201);
}

export async function resetPassword(req, res) {
    await userService.resetPassword(req.user, req.body.new_password);
    return responseSuccess(res, null, 201);
}

export const blockUser = async (req, res) => {
    if (req.user.status === false) {
        return responseError(res, 400, "Tài khoản đã bị khóa trước đó");
    }
    await userService.block(req.user);
    return responseSuccess(res, null, 201);
};

export const unblockUser = async (req, res) => {
    if (req.user.status === true) {
        return responseError(res, 400, "Tài khoản không bị khóa");
    }
    await userService.unBlock(req.user);
    return responseSuccess(res, null, 201);
};

