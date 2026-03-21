import mongoose from "mongoose";
import validator from "validator";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        unique: true,
        trim: true,
        validate(value) {
            if(!validator.isEmail(value)) {
                throw new Error("Email is not valid");
            }
        },
    },
    password: {
        type: String,
        required: [true, "Password is required"],
    },
    profileImage: {
        type: String,
        default: ""
    },
}, {
    timestamps: true,
})


export const User = mongoose.model('User', userSchema);