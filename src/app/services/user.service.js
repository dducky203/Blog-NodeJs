import { User } from "../models";
import { LINK_STATIC_URL } from "@/configs";
import { FileUpload } from "@/utils/types";
import { generatePassword } from "@/utils/helpers";

export async function create({ name, email, password, phone, role }) {
    const user = new User({
        name,
        email,
        phone,
        password: generatePassword(password),
        role,
    });
    await user.save();
    return user;
}

export async function filter({ q, page, per_page, field, sort_order }) {
    q = q ? { $regex: q, $options: "i" } : null;

    const filter = {
        ...(q && { $or: [{ name: q }, { email: q }, { phone: q }] }),
        status: true, // Add this line to filter users with status = true
    };

    const users = (
        await User.find(filter, { password: 0 })
            .skip((page - 1) * per_page)
            .limit(per_page)
            .sort({ [field]: sort_order })
    ).map((user) => {
        if (user.avatar) {
            user.avatar = LINK_STATIC_URL + user.avatar;
        }
        return user;
    });

    const total = await User.countDocuments(filter);
    return { total, page, per_page, users };
}

export async function details(userId) {
    const user = await User.findById(userId, { password: 0 });
    user.avatar = LINK_STATIC_URL + user.avatar;
    return user;
}

export async function update(user, { name, email, phone, avatar }) {
    user.name = name;
    user.email = email;
    user.phone = phone;
    if (avatar) {
        if (user.avatar) {
            FileUpload.remove(user.avatar);
        }
        avatar = avatar.save("images/employees");
        user.avatar = avatar;
    }
    await user.save();
    return user;
}

export async function resetPassword(user, new_password) {
    user.password = generatePassword(new_password);
    await user.save();
    return user;
}

export async function remove(user) {
    await user.delete({_id: user._id});
}

export async function restore(userId) {
    await User.restore({ _id: userId });
}

export async function forceDelete(userId){
    await User.findByIdAndDelete(userId);
}

export async function block(user) {
    user.status = false;
    await user.save();
}
export async function unBlock(user) {
    user.status = true;
    await user.save();
}


