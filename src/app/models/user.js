import {createModel} from "./base";

export const User = createModel("User", "users", {
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        trim: true,
        lowercase: true,
        unique: true,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        //default: "",
        unique: true,
        require: true
    },
    avatar: String, 
    
    role: {
        type: String,
        default: "user",
    },

    status: {
        type: Boolean,
        default: true,
    },

    otp: {
        type: String,
        default: ""
    },

    otpExpired: {
        type: Boolean,
        default: true,
    }

});
