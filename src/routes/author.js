import { Router } from "express";
import { asyncHandler } from "@/utils/handlers";
import { verifyToken, validate, upload } from "../app/middleware/common";

import * as authorRequest from "../app/requests/author.request";
import * as authorMiddlewares from "../app/middleware/author.middleware";
import * as authorController from "../app/controllers/author.controller";

const router = Router();
router.use(asyncHandler(verifyToken));

router.get(
    "/",
    asyncHandler(validate(authorRequest.readRoot)),
    asyncHandler(authorController.getAuthor)
);

router.get(
    "/:id",
    asyncHandler(authorController.detailsAuthor)
);

router.post(
    "/",
    asyncHandler(upload),
    asyncHandler(validate(authorRequest.createAuthor)),
    asyncHandler(authorController.createAuthor),
);

/* */
router.put(
    "/:id",
    asyncHandler(authorMiddlewares.checkAuthorId),
    asyncHandler(upload),
    asyncHandler(validate(authorRequest.updateAuthor)),
    asyncHandler(authorController.updateAuthor),
);

router.delete(
    "/:id",
    asyncHandler(authorMiddlewares.checkAuthorId),
    asyncHandler(authorController.deleteAuthor),
);

export default router;