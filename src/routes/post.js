import { Router } from "express";
import { asyncHandler } from "@/utils/handlers";
import { verifyToken, validate } from "@/app/middleware/common";

import * as authorMiddlewares from "@/app/middleware/author.middleware";
import * as categoryMiddlewares from "@/app/middleware/category.middleware";
import * as postMiddlewares from "@/app/middleware/post.middleware";
import * as postRequest from "@/app/requests/post.request";
import * as postController from "@/app/controllers/post.controller";

const router = Router();

router.use(asyncHandler(verifyToken));

router.get(
    "/",
    asyncHandler(validate(postRequest.getPosts)),
    asyncHandler(postController.getListPost)
);

router.get(
    "/details/:id",
    asyncHandler(postMiddlewares.checkPostId),
    asyncHandler(postController.postDetails)
);

router.post(
    "/",
    asyncHandler(authorMiddlewares.checkAuthorIdInBody),
    asyncHandler(categoryMiddlewares.checkCategoryIdsInBody),
    asyncHandler(validate(postRequest.createPost)),
    asyncHandler(postController.createPost)
);

router.put(
    "/:id",
    asyncHandler(postMiddlewares.checkPostId),
    asyncHandler(authorMiddlewares.checkAuthorIdInBody),
    asyncHandler(categoryMiddlewares.checkCategoryIdsInBody),
    asyncHandler(validate(postRequest.updatePost)),
    asyncHandler(postController.updatePost)
);


router.delete(
    "/delete-many",
    asyncHandler(postMiddlewares.checkPostIdsInBody),
    asyncHandler(postController.deleteManyPost)

);


router.delete(
    "/:id/delete",
    asyncHandler(postMiddlewares.checkPostId),
    asyncHandler(postController.deletePost)
);
export default router;
