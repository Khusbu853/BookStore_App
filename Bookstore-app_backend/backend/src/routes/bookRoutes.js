import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { createBook, deleteBook, getBooks, getLoggedInUserBooks } from "../controllers/bookController.js";

const router = express.Router();

router.route("/").post(isAuthenticated, createBook);
router.route("/").get(isAuthenticated, getBooks);
router.route("/user").get(isAuthenticated, getLoggedInUserBooks);
router.route("/:id").delete(isAuthenticated, deleteBook);

export default router;