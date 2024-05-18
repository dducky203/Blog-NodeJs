import { Post } from "../models/post";
import { capitalizeFirstLetter } from "@/utils/handlers/capitalize.handler";
import { capitalize } from "lodash";
import { deletePostsOfCategory, createPostsinCategory } from "./category.service";


export async function filter({ q, page, per_page, field, sort_order }) {
    q = q ? { $regex: q, $options: "i" } : null;

    const filter = {
        ...(q && { $or: [{ title: q }] }),
    };

    const posts = (
        await Post.find(filter)
            .skip((page - 1) * per_page)
            .limit(per_page)
            .sort({ [field]: sort_order })
            .populate("author_id", "name")
            .populate("categories", "categoryName")
    ).map((post) => {
        return post;
    });

    const total = await Post.countDocuments(filter);
    return { total, page, per_page, posts };
}

export const details = async (postId) => {
    const post = await Post.findById(postId)
        .populate("author_id", "name")
        .populate("categories", "categoryName");
    return post;
};

export const create = async ({ title, content, author_id, categories }) => {
    const post = new Post({
        title: capitalizeFirstLetter(title),
        content: capitalize(content),
        author_id,
        categories,
    });

    await post.save();
    console.log(categories);

    if (categories) {
        await createPostsinCategory(categories, post);
    }
    return post;
};


export const update = async (post, { title, content, author_id, categories }) => {
    post.title = title ? capitalizeFirstLetter(title) : post.title;
    post.content = content ? capitalize(content) : post.content;
    post.author_id = author_id ? author_id : post.author_id;

    if (categories) {
        const newArrCategories = post.categories.map((id) => id.toString()).concat(categories);
        post.categories = [...new Set(newArrCategories)];
        await createPostsinCategory(categories, post);
    }

    return await post.save();
};



export const remove = async (post) => {
    await deletePostsOfCategory(post._id);
    await Post.deleteOne({ _id: post._id });
};

export const deleteManyPost = async (postIds) => {
    for (const postId of postIds) {
        const post = await Post.findById(postId);

        if (post) {
            await deletePostsOfCategory(postId);
        }
    }
    await Post.deleteMany({ _id: postIds });
};


//tự động xóa post có author_id = author trong bảng post khi xóa author
export const deletePostOfAuthor = async (authorId) => {
    const posts = await Post.find({ author_id: authorId });
    const postIds = posts.map((id) => id._id);

    await deleteManyPost(postIds);
};

//tự động xóa categories trong bảng post khi xóa category
export const deleteCategoryOfPost = async (cartegoryId) => {
    await Post.updateMany(
        { categories: cartegoryId },
        { $pull: { categories: cartegoryId } }
    );
};


//tự động nhập categories trong bảng posts khi tạo mới cartegory
export const createCategoriesinPost = async (posts, category) => {
    for (const postIds of posts) {
        const post = await Post.findById(postIds);
        if (post) {
            //kiểm tra xem post đã có category chưa
            if (!post.categories.includes(category._id)) {
                post.categories.push(category._id);
                await post.save();
            }
        }
    }
};


