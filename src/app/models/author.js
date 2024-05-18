import {createModel} from "./base";

export const Author = createModel("Author", "authors", {
    name: {
        type: String,
        required: true,
    },
    avatar: {
        type: String,
        
    },
    phone: {
        type: String,
        default: "",
        unique: true,
    },
    email:{
        type: String,
        unique: true,
        required: true
    },
    bio: {
        type: String,
       
    },
    
    
});

