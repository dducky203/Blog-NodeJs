import moment from "moment";
import jwt from "jsonwebtoken";
import { User } from "../models";
import { cache, JWT_EXPIRES_IN, LINK_STATIC_URL, TOKEN_TYPE } from "@/configs";
import { FileUpload } from "@/utils/types";
import { comparePassword, generatePassword, generateToken } from "@/utils/helpers";
import { capitalizeFirstLetter } from "@/utils/handlers/capitalize.handler";
import { sendMail } from "@/utils/helpers/mail.helper";


export const tokenBlocklist = cache.create("token-block-list");

export async function checkValidLogin({ email, password }) {
    const user = await User.findOne({
        email: email,
    });

    if (user) {
        const verified = comparePassword(password, user.password);
        if (verified) {
            return user;
        }
    }

    return false;
}

export function authToken(user_id) {
    const access_token = generateToken(TOKEN_TYPE.AUTHORIZATION, { user_id }, JWT_EXPIRES_IN);
    const decode = jwt.decode(access_token);
    const expire_in = decode.exp - decode.iat;
    return {
        access_token,
        expire_in,
        auth_type: "Bearer Token",
    };
}

export async function register({ name, email, password, phone, avatar }) {
    if (avatar) {
        avatar = avatar.save();
    }

    const user = new User({
        name,
        email: email.toLowerCase(),
        password: generatePassword(password),
        phone,
        avatar,
    });
    return await user.save();
}

export async function blockToken(token) {
    const decoded = jwt.decode(token);
    const expiresIn = decoded.exp;
    const now = moment().unix();
    await tokenBlocklist.set(token, 1, expiresIn - now);
}

export async function profile(user_id) {
    const user = await User.findOne({ _id: user_id }, { password: 0 });
    if (user.avatar) {
        user.avatar = LINK_STATIC_URL + user.avatar;
    }

    return user;
}

export async function updateProfile(currentUser, { name, email, phone, avatar }) {
    currentUser.name = capitalizeFirstLetter(name);
    currentUser.email = email ? email.toLowerCase() : currentUser.email;
    currentUser.phone = phone;
    if (avatar) {
        if (currentUser.avatar) {
            FileUpload.remove(currentUser.avatar);
        }
        avatar = avatar.save("images/employees");
        currentUser.avatar = avatar;
    }

    return await currentUser.save();
}


export const changePassword = async (user, new_password) => {
    user.password = generatePassword(new_password);
    return await user.save();

};

export const forgotPassword = async (user,new_password)=>{
    const verified = comparePassword(new_password, user.password);
    
    if(!verified){
        user.password = generatePassword(new_password);
        await user.save();

        return true;
    }
    return false;
};


//lưu otp trong db và gửi mail
export const createOTP = async (user) => {
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();


    const data = {
        otp: otpCode,
        name: user.name,
    };

    user.otp = data.otp;
    user.otpExpired = false;
    await user.save();

    await sendMail(
        user.email,
        "Verify OTP Code - Dblog",
        "sendOTP",
        data,
    );

    setTimeout(async () => {
        user.otpExpired = true;
        await user.save();
    }, 180 * 1000); // 3 minutes
};


export const verifyOTP = async (user, otp) => {

    if (user.otp === otp && user.otpExpired === false) {
        user.otp = "";
        user.otpExpired = true;
        await user.save();

        return { status: "success" };
    }

    if (user.otp === otp) {
        if (user.otpExpired) {
            return { status: "expired" };
        }
    }

    return { status: "incorrect_otp" };

};

