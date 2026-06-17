import * as userRepository from "../repository/userRepository.js";
import * as refreshTokenRepository from "../repository/refreshTokenRepository.js";
import { toUserResponse } from "../models/dto/UserResponse.js";
import { generateAccessToken, generateRefreshToken, getExpirationDate, verifyToken } from "../config/security/jwtProvider.js";
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

        // Tạo Access Token & Refresh Token
        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        // Lưu Refresh Token vào DB
        const expiresAt = getExpirationDate(true);
        await refreshTokenRepository.saveToken(user.id, refreshToken, expiresAt);

        // Xóa các token cũ hết hạn (tùy chọn)
        await refreshTokenRepository.deleteExpiredTokens();

        return {
            user: toUserResponse(user),
            accessToken,
            refreshToken
        };

    } catch (error) {
        throw new Error(error.message === genericError ? genericError : "Lỗi đăng nhập: " + error.message);
    }
}

export const logout = async (token) => {
    try {
        if (!token) throw new Error("Không có token để đăng xuất");
        await refreshTokenRepository.deleteByToken(token);
        return true;
    } catch (error) {
        throw new Error(error.message);
    }
}

export const refresh = async (oldRefreshToken) => {
    try {
        if (!oldRefreshToken) {
            throw new Error("Refresh token bị thiếu");
        }

        // Kiểm tra trong DB
        const existingToken = await refreshTokenRepository.findByToken(oldRefreshToken);
        if (!existingToken) {
            throw new Error("Refresh token không tồn tại hoặc đã bị thu hồi");
        }

        // Xác minh token
        const decoded = verifyToken(oldRefreshToken, true);
        if (!decoded) {
            // Nếu hết hạn thì xóa khỏi DB luôn
            await refreshTokenRepository.deleteByToken(oldRefreshToken);
            throw new Error("Refresh token đã hết hạn");
        }

        const user = existingToken.user;
        if (!user) {
            throw new Error("Không tìm thấy người dùng");
        }

        // Tạo mới Access Token và Refresh Token
        const newAccessToken = generateAccessToken(user);
        const newRefreshToken = generateRefreshToken(user);

        // Lưu Refresh Token mới và xóa cái cũ
        await refreshTokenRepository.deleteByToken(oldRefreshToken);
        const expiresAt = getExpirationDate(true);
        await refreshTokenRepository.saveToken(user.id, newRefreshToken, expiresAt);

        return {
            accessToken: newAccessToken,
            refreshToken: newRefreshToken
        };
    } catch (error) {
        throw new Error(error.message);
    }
}
