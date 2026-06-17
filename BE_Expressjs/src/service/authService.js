import * as userRepository from "../repository/userRepository.js";
import { toUserResponse } from "../models/dto/UserResponse.js";
import bcrypt from "bcrypt";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const register = async (req) => {
    try {
        if (!EMAIL_REGEX.test(req.email)) {
            throw new Error("Email không đúng định dạng");
        }
        if (req.password.length < 6) {
            throw new Error("Mật khẩu phải có tối thiểu 6 ký tự");
        }
        if (/\s/.test(req.password)) {
            throw new Error("Mật khẩu không được chứa dấu cách");
        }
        if (await userRepository.existsByEmail(req.email)) {
            throw new Error("Email đã tồn tại");
        }
        if (await userRepository.existsByUserName(req.username)) {
            throw new Error("Tên đăng nhập đã tồn tại");
        }
        const p = await bcrypt.hash(req.password, 10);

        const newUser = await userRepository.create({
            username: req.username,
            email: req.email,
            password: p,
        });
        return toUserResponse(newUser);

    } catch (error) {
        throw new Error(error.message);
    }
}

export const login = async (req) => {
    const genericError = "Tài khoản hoặc mật khẩu không đúng";

    try {
        const { username, password } = req;

        // Xác định input là email hay username, rồi tìm user tương ứng
        const isEmail = EMAIL_REGEX.test(username);
        const user = isEmail
            ? await userRepository.findByEmail(username)
            : await userRepository.findByUserName(username);

        if (!user) {
            throw new Error(genericError);
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            throw new Error(genericError);
        }

        return toUserResponse(user);

    } catch (error) {
        throw new Error(genericError);
    }
}
