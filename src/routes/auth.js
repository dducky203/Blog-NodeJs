import { Router } from "express";
import { asyncHandler } from "@/utils/handlers";
import { verifyToken, validate, upload } from "../app/middleware/common";

import * as authRequest from "../app/requests/auth.request";
import * as authController from "../app/controllers/auth.controller";
import * as userMiddleware from "../app/middleware/user.middleware";
import * as userRequest from "../app/requests/user.request";

const router = Router();

router.post(
    "/login",
    asyncHandler(validate(authRequest.login)),
    asyncHandler(authController.login)
);

router.post(
    "/register",
    asyncHandler(upload),
    asyncHandler(validate(authRequest.register)),
    asyncHandler(authController.register),
);

router.post(
    "/logout",
    asyncHandler(verifyToken),
    asyncHandler(authController.logout)
);

router.get(
    "/me",
    asyncHandler(verifyToken),
    asyncHandler(authController.me)
);

router.put(
    "/update/me",
    asyncHandler(verifyToken),
    asyncHandler(upload),
    asyncHandler(validate(authRequest.updateProfile)),
    asyncHandler(authController.updateProfile),
);

router.patch(
    "/change-password",
    asyncHandler(verifyToken),
    asyncHandler(validate(authRequest.changePassword)),
    asyncHandler(authController.changePassword),
);

router.patch(
    "/forgot-password",
    asyncHandler(userMiddleware.checkUserEmail),
    asyncHandler(validate(userRequest.forgotPassword)),
    asyncHandler(authController.forgotPassword),
);

router.patch(
    "/send-otp",
    asyncHandler(userMiddleware.checkUserEmail),
    asyncHandler(validate(authRequest.sendOTP)),
    asyncHandler(authController.sendOTP)
);

router.patch(
    "/verify-otp",
    asyncHandler(userMiddleware.checkUserEmail),
    asyncHandler(validate(authRequest.verifyOTP)),
    asyncHandler(authController.verifyOTP)
);





export default router;
