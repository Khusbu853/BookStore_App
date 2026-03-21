import express from "express";
import { getMe, login, logout, signup } from "../controllers/authController.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";

const router = express.Router();

router.route("/signup").post(signup);
router.route("/login").post(login);
router.route("/me").get(isAuthenticated, getMe);
router.route("/logout").post(logout);

export default router;