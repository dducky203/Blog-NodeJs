import { Router } from "express";
import { asyncHandler } from "@/utils/handlers";
import { verifyToken, validate } from "../app/middleware/common";
import { authorize } from "../app/middleware/common/authorize";

import * as userRequest from "../app/requests/user.request";
import * as userMiddleware from "../app/middleware/user.middleware";
import * as userController from "../app/controllers/user.controller";

const router = Router();

//router.use(asyncHandler(verifyToken));

router.get(
    "/",
    asyncHandler(validate(userRequest.readRoot)),
    asyncHandler(userController.readRoot)
);

router.get(
    "/:id",
    asyncHandler(userMiddleware.checkUserId),
    asyncHandler(userController.readItem)
);

router.post(
    "/",
    //asyncHandler(authorize("super_admin")),
    //asyncHandler(validate(userRequest.createItem)),
    asyncHandler(userController.createItem)
);

router.put(
    "/:id",
    asyncHandler(authorize("super_admin")),
    asyncHandler(userMiddleware.checkUserId),
    asyncHandler(validate(userRequest.updateItem)),
    asyncHandler(userController.updateItem),
);

router.delete(
    "/:id",
    asyncHandler(authorize("super_admin")),
    asyncHandler(userMiddleware.checkUserId),
    asyncHandler(userController.removeItem)
);

router.patch(
    "/:id/restore",
    asyncHandler(authorize("super_admin")),
    asyncHandler(userMiddleware.checkUserIdDeleted),
    asyncHandler(userController.restoreItem)
);
router.delete(
    "/:id/force",
    asyncHandler(authorize("super_admin")),
    asyncHandler(userMiddleware.checkUserIdDeleted),
    asyncHandler(userController.forceDelete)
);

router.patch(
    "/resetpassword/:id",
    asyncHandler(authorize("super_admin")),
    asyncHandler(userMiddleware.checkUserId),
    asyncHandler(validate(userRequest.resetPassword)),
    asyncHandler(userController.resetPassword),
);


router.post(
    "/block/:id",
    asyncHandler(authorize("super_admin")),
    asyncHandler(userMiddleware.checkUserId),
    asyncHandler(userController.blockUser),
);

router.post(
    "/unblock/:id",
    asyncHandler(authorize("super_admin")),
    asyncHandler(userMiddleware.checkUserId),
    asyncHandler(userController.unblockUser),
);


export default router;
