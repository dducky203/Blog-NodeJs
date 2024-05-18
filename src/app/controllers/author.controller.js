import { responseSuccess } from "@/utils/helpers";
import * as authorService from "../services/author.service";
import * as postService from "@/app/services/post.service";



export async function getAuthor(req, res){
    return responseSuccess(res, await authorService.filter(req.query));
}

export async function detailsAuthor(req, res) {
    await responseSuccess(res, await authorService.details(req.params.id));
}

export async function createAuthor(req, res) {
    await authorService.create(req.body);
    return responseSuccess(res, null, 201);
}


export async function updateAuthor(req, res) {
    await authorService.update(req.author, req.body);
    return responseSuccess(res, null,201);
}

export async function deleteAuthor(req, res) {
    await postService.deletePostOfAuthor (req.params.id);
    await authorService.remove(req.author);
    return responseSuccess(res);
}

