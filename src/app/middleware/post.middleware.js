import { isValidObjectId } from "mongoose";
import { responseError } from "@/utils/helpers";
import { Post } from "../models/post";

export const checkPostId = async function (req, res, next) {
    const _id = req.params.id;

    if (isValidObjectId(_id)) {
        const post = await Post.findById(_id);
        if (post) {
            req.post = post;
            return next();
        }
    }

    return responseError(res, 404, "Bài viết không tồn tại hoặc đã bị xóa");
};

export const checkPostIdsInBody = async (req, res, next) => {
    const postIds = req.body.posts;

    if (postIds) {
        for (const _id of postIds) {
            if (isValidObjectId(_id)) {
                const post = await Post.findById(_id);
                if (!post) {
                    return responseError(res, 404, `Bài viết với id: ${_id} không tồn tại hoặc đã bị xóa`);
                }
            }
        }
    }
    next();
};