import { Router } from "express";
import { asyncHandler } from "@/utils/handlers";
import { validate,verifyToken } from "@/app/middleware/common";

import * as categoryController from "@/app/controllers/category.controller";
import * as categoryMiddleware from "@/app/middleware/category.middleware";
import * as categoryRequest from "../app/requests/category.request";
import * as postMiddlerware from "../app/middleware/post.middleware";


const router = Router();
router.use(verifyToken);

router.get(
    "/",
    asyncHandler(validate(categoryRequest.getCategory)),
    asyncHandler(categoryController.getListCategory)
);

router.get(
    "/details/:id",
    asyncHandler(categoryMiddleware.checkCategoryId),
    asyncHandler(categoryController.detailsCategory)
);

router.post(
    "/",
    asyncHandler(postMiddlerware.checkPostIdsInBody),
    asyncHandler(validate(categoryRequest.createCategory)),
    asyncHandler(categoryController.createCategory)
);

router.put(
    "/:id",
    asyncHandler(categoryMiddleware.checkCategoryId),
    asyncHandler(postMiddlerware.checkPostIdsInBody),
    asyncHandler(validate(categoryRequest.updateCategory)),
    asyncHandler(categoryController.updateCategory)
);

router.delete(
    "/delete-many",
    asyncHandler(categoryMiddleware.checkCategoryIdsInBody),
    asyncHandler(categoryController.deleteManyCategories)
);

router.delete(
    "/:id/delete",
    asyncHandler(categoryMiddleware.checkCategoryId),
    asyncHandler(categoryController.deleteCategory)
);



export default router;