import { Category } from "../models/category";
import { capitalizeFirstLetter } from "@/utils/handlers/capitalize.handler";
import { capitalize } from "lodash";
import { createCategoriesinPost } from "./post.service";
import * as postService from "./post.service";


export async function create({ categoryName, description, posts }) {
    const category = new Category({
        categoryName: capitalizeFirstLetter(categoryName),
        description,
        posts,
    });
    
    await category.save();
    if (posts) {
        await createCategoriesinPost(posts, category);
    }

    return category;
}

export async function filter({ q, page, per_page, field, sort_order }) {
    q = q ? { $regex: q, $options: "i" } : null;

    const filter = {
        ...(q && { $or: [{ categoryName: q }] }),
    };

    const category = (
        await Category.find(filter, { password: 0 })
            .skip((page - 1) * per_page)
            .limit(per_page)
            .sort({ [field]: sort_order })
            .populate("posts", "title")
    ).map((category) => {
        return category;
    });

    const total = await Category.countDocuments(filter);
    return { total, page, per_page, category };
}

export const details = async (categoryId) => {
    const category = await Category
        .findById(categoryId)
        .populate("posts", "title");

    return category;
};

export const update = async (category, { categoryName, description, posts }) => {
    category.categoryName = categoryName ? capitalizeFirstLetter(categoryName) : category.categoryName;
    category.description = description ? capitalize(description) : category.description;

    if (posts) {
        await createCategoriesinPost(posts, category);
        const newArrPosts = category.posts.map((id) => id.toString()).concat(posts);
        category.posts = [...new Set(newArrPosts)];
    }


    return await category.save();
};

export const remove = async (categoryId) => {
    await postService.deleteCategoryOfPost(categoryId);
    await Category.findByIdAndDelete(categoryId);
};


//tự động nhập posts trong bảng cartegory khi tạo mới post
export const createPostsinCategory = async (categories, post) => {
    for (const categoryId of categories) {
        const category = await Category.findById(categoryId);
        if (category) {
            category.posts.push(post._id);
            await category.save();
        }
    }
};

//tự động xóa post trong bảng category khi xóa post
export const deletePostsOfCategory = async (postId) => {
    await Category.updateMany(
        { posts: postId },
        { $pull: { posts: postId } }
    );
};

//xóa nhiều categories
export const deleteManyCategories = async (categoryIds) => {
    for (const id of categoryIds) {
        const category = await Category.findById(id);

        if (category) {
            await postService.deleteCategoryOfPost(id);
        }

    }
    await Category.deleteMany({ _id: categoryIds });
};
