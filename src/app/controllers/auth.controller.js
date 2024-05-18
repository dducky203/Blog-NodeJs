import { responseError, responseSuccess, getToken } from "@/utils/helpers";
import * as authService from "../services/auth.service";
import { resetPassword } from "../services/user.service";

export async function login(req, res) {
    const validLogin = await authService.checkValidLogin(req.body);
    if (validLogin) {
        if (validLogin.deleted) {
            return responseError(res, 400, "Tài khoản đã bị xóa");
        } else if (!validLogin.status) {
            return responseError(res, 400, "Tài khoản đã bị khóa");
        }
        return responseSuccess(res, authService.authToken(validLogin._id));
    } else {
        return responseError(res, 400, "Email hoặc mật khẩu không đúng");
    }
}

export async function register(req, res) {
    const newUser = await authService.register(req.body);
    const result = authService.authToken(newUser._id);
    return responseSuccess(res, result, 201, "Đăng ký thành công");
}

export async function logout(req, res) {
    const token = getToken(req.headers);
    await authService.blockToken(token);
    return responseSuccess(res);

}

export async function me(req, res) {
    return responseSuccess(res, await authService.profile(req.currentUser._id));
}

export async function updateProfile(req, res) {
    await authService.updateProfile(req.currentUser, req.body);
    return responseSuccess(res, null, 201);
}

export async function changePassword(req, res) {
    await resetPassword(req.currentUser, req.body.new_password);
    return responseSuccess(res, null, 201);
}

export const forgotPassword = async (req, res) => {
    const verified = await authService.forgotPassword(req.user, req.body.new_password);

    if (!verified) {
        return responseError(res, 400, "Bạn đang nhập mật khẩu cũ, hãy nhập mật khẩu khác");
    }
    return responseSuccess(res, null, 201);

};


export const sendOTP = async (req, res) => {
    await authService.createOTP(req.user);

    return responseSuccess(res, null, 201);
};

export const verifyOTP = async (req, res) => {
    const { status } = await authService.verifyOTP(req.user, req.body.otp);

    if (status === "success") {
        return responseSuccess(res, null, 201);
    } else if (status === "expired") {
        return responseError(res, 400, "OTP đã hết hạn");
    } else 
        return responseError(res, 400, "OTP không chính xác ");
};


