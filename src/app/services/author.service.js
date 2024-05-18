import { Author } from "../models";
import { LINK_STATIC_URL } from "@/configs";
import { capitalizeFirstLetter } from "@/utils/handlers/capitalize.handler";
import { FileUpload } from "@/utils/types";



export async function filter({ q, page, per_page, field, sort_order }) {
    q = q ? { $regex: q, $options: "i" } : null;

    const filter = {
        ...(q && { $or: [{ name: q }, { phone: q }, { email: q }] }),
    };

    const authors = (
        await Author.find(filter)
            .skip((page - 1) * per_page)
            .limit(per_page)
            .sort({ [field]: sort_order })
    ).map((author) => {
        if (author.avatar) {
            author.avatar = LINK_STATIC_URL + author.avatar;
        }
        return author;
    });

    const total = await Author.countDocuments(filter);
    return { total, page, per_page, authors };
}


export async function details(authorId) {

    const author = await Author.findById(authorId);
    author.avatar = LINK_STATIC_URL + author.avatar;
    return author;

}

export async function create({ name, avatar, phone, email, bio }) {

    const author = new Author({
        name: capitalizeFirstLetter(name),
        phone,
        email: email.toLowerCase(),
        avatar: avatar ? avatar.save("images/authors") : "",  
        bio: bio,
    });
    return await author.save();
}

export async function update(author, { name,phone , email, avatar, bio}) {
    
    author.name = name ? capitalizeFirstLetter(name) : author.name;
    author.phone = phone ? phone : author.phone;
    author.email = email ? email.toLowerCase() : author.email ;
    if (avatar) {
        if (author.avatar) {
            FileUpload.remove(author.avatar);
        }
        avatar = avatar.save("images/authors");
        author.avatar = avatar;
    }
    author.bio = bio || author.bio;

    return await author.save();

}

export async function remove(author) {
    await Author.deleteOne({ _id: author._id });
    //console.log(Author.findOne({ _id: author._id }));
    
}
