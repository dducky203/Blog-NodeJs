import jwt, {JsonWebTokenError, NotBeforeError, TokenExpiredError} from "jsonwebtoken";
import {isUndefined} from "lodash";
import {User} from "@/app/models";
import {tokenBlocklist} from "@/app/services/auth.service";
import {SECRET_KEY, TOKEN_TYPE} from "@/configs";
import {responseError, getToken} from "@/utils/helpers";

export async function verifyToken(req, res, next) {
    try {
        const token = getToken(req.headers);

        if (token) {
            const allowedToken = isUndefined(await tokenBlocklist.get(token));
            if (allowedToken) {
                const {type, data} = jwt.verify(token, SECRET_KEY);

                if (type === TOKEN_TYPE.AUTHORIZATION) {
                    const user = await User.findOne({_id: data.user_id});
                    if (user) {
                        req.currentUser = user;
                        // req.role = user.role;
                        return next();
                    }
                }
            }
        }

        return responseError(res, 401, "Từ chối truy cập");
    } catch (error) {
        if (error instanceof JsonWebTokenError) {
            if (error instanceof TokenExpiredError) {
                return responseError(res, 401, "Mã xác thực đã hết hạn");
            } else if (error instanceof NotBeforeError) {
                return responseError(res, 401, "Mã xác thực không hoạt động");
            } else {
                return responseError(res, 401, "Mã xác thực không hợp lệ");
            }
        }

        return next(error);
    }
}
