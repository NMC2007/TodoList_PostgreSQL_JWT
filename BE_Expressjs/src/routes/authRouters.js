import express from "express";
import { register, login, testAuth, logout, refresh } from "../controllers/authController.js";

const router = express.Router();

router.get("/", testAuth);

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.post("/refresh", refresh);

export default router;