import cloudinary from "../lib/cloudinary.js";
import { Book } from "../models/bookModel.js";

export const createBook = async (req, res) => {
    try {
        const userId = req.user?._id;
        const { title, caption, rating, image } = req.body;

        if (!image || !title || !caption || !rating) {
            return res.status(400).json({ message: "Please provide all fields", success: false });
        }

        const uploadResponse = await cloudinary.uploader.upload(image);
        const imageUrl = uploadResponse.secure_url;

        const newBook = new Book({
            title,
            caption,
            rating,
            image: imageUrl,
            user: userId
        });

        await newBook.save();

        return res.status(201).json({
            newBook,
            success: true,
            message: "Book created successfully"
        });

    } catch (error) {
        return res.status(500).json({ message: error.message, success: false });
    }
}

export const getBooks = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 10;
        limit = limit > 50 ? 50 : limit;
        const skip = (page - 1) * limit;

        const books = await Book.find()
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .populate("user", "username profileImage");

        const totalBooks = await Book.countDocuments();

        return res.status(200).json({
            books,
            currentPage: page,
            totalBooks,
            totalPages: Math.ceil(totalBooks / limit),
            success: true,
            message: "Books data fetched successfully"
        });

    } catch (error) {
        return res.status(500).json({ message: error.message, success: false });
    }
}

export const getLoggedInUserBooks = async (req, res) => {
    try {
        const userId = req.user?._id;
        const page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 10;
        limit = limit > 50 ? 50 : limit;
        const skip = (page - 1) * limit;

        const books = await Book.find({ user: userId })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .populate("user", "username profileImage");

        const totalBooks = await Book.countDocuments({ user: userId });

        return res.status(200).json({
            books,
            currentPage: page,
            totalBooks,
            totalPages: Math.ceil(totalBooks / limit),
            success: true,
            message: "Books data fetched successfully"
        });

    } catch (error) {
        return res.status(500).json({ message: error.message, success: false });
    }
}

export const deleteBook = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user?._id;

        const book = await Book.findById(id);
        if (!book) return res.status(404).json({ message: "Book not found", success: false });

        if (book.user.toString() !== userId.toString()) {
            return res.status(403).json({ message: "User not authorized to delete this book", success: false });
        }

        if (book.image && book.image.includes("cloudinary")) {
            try {
                const publicId = book.image.split("/").pop().split(".")[0];
                await cloudinary.uploader.destroy(publicId);
            } catch (deleteError) {
                console.log("Error in deleting image from cloudinary", deleteError);
            }
        }

        await book.deleteOne();

        return res.status(200).json({
            success: true,
            message: "Book deleted successfully"
        });

    } catch (error) {
        return res.status(500).json({ message: error.message, success: false });
    }
}