import jwt from 'jsonwebtoken';
import { User } from "../models/userModel.js"
import bcrypt from "bcrypt"

const createToken = (email, userId) => {
    return jwt.sign({ email, userId }, process.env.JWT_KEY, { expiresIn: "1d" })
}

export const signup = async (req, res) => {
    try {
        const { email, password, username } = req.body;

        if (!email || !password || !username) {
            return res.status(400).json({ message: "UserName, Email and password are required", success: false });
        }

        const existingUser = await User.findOne({
            $or: [{ email }, { username }]
        });

        if (existingUser) {
            if (existingUser.email === email) {
                return res.status(400).json({
                    message: "User already exists with this email",
                    success: false
                });
            }

            if (existingUser.username === username) {
                return res.status(400).json({
                    message: "Username is already taken",
                    success: false
                });
            }
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const profileImage = "";

        const user = await User.create({
            username,
            email,
            password: hashedPassword,
            profileImage
        });

        const token = createToken(email, user._id);

        return res.status(201).json({
            token,
            user: {
                _id: user._id,
                username: user.username,
                email: user.email,
                profileImage: user.profileImage,
            },
            success: true,
            message: "User signup successfully"
        });

    } catch (error) {
        return res.status(500).json({ message: error.message, success: false });
    }
};


export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log(email)
        console.log(password)

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password required", success: false });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "User not found", success: false });
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(400).json({ message: "Password is incorrect", success: false });
        }

        const token = createToken(email, user._id);

        return res.status(200).json({
            token,
            user: {
                _id: user._id,
                email: user.email,
                username: user.username,
                profileImage: user.profileImage,
            },
            success: true,
            message: "User login successfully"
        });

    } catch (error) {
        return res.status(500).json({ message: error.message, success: false });
    }
};

export const logout = async (req, res) => {
    return res.status(200).json({
        message: "User Logged out successfully",
        success: true
    });
}

export const getMe = async (req, res) => {
  try {
    return res.status(200).json({ user: req.user, success: true });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false });
  }
};