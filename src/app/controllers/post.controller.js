import { responseSuccess } from "@/utils/helpers";
import * as postService from "@/app/services/post.service";


export const getListPost = async (req, res) => {
    return responseSuccess(res, await postService.filter(req.query));
};

export const postDetails = async (req, res) => {
    return responseSuccess(res, await postService.details(req.params.id));
};

export const createPost = async (req, res) => {
    await postService.create(req.body);
    return responseSuccess(res, null, 201);
};

export const updatePost = async (req, res) => {
    await postService.update(req.post, req.body);
    return responseSuccess(res, null, 201);
};

export const deletePost = async (req, res) => {
    await postService.remove(req.post);
    return responseSuccess(res, null, 201);
};
export const deleteManyPost = async (req, res) => {
    await postService.deleteManyPost(req.body.posts);
    return responseSuccess(res, null, 201);
};



