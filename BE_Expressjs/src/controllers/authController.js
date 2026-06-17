import * as authService from "../service/authService.js";
import { toAPIResponse } from "../models/dto/APIResponse.js";

export const testAuth = async (req, res) => {
    res.json(toAPIResponse(200, "Hello from auth controller"));
}

export const register = async (req, res) => {
    try {
        const newUser = await authService.register(req.body);
        return res.status(201).json(
            toAPIResponse(201, "Đăng ký thành công", newUser)
        );
    } catch (error) {
        return res.status(409).json(
            toAPIResponse(409, "Lỗi khi đăng ký", null, { "Lỗi đăng ký": error.message })
        );
    }
}

export const login = async (req, res) => {
    try {
        const data = await authService.login(req.body);
        return res.status(200).json(
            toAPIResponse(200, "Đăng nhập thành công", data)
        );
    } catch (error) {
        return res.status(401).json(
            toAPIResponse(401, "Đăng nhập thất bại", null, { "Lỗi đăng nhập": error.message })
        );
    }
}

export const logout = async (req, res) => {
    try {
        const { refreshToken } = req.body;
        await authService.logout(refreshToken);
        return res.status(200).json(
            toAPIResponse(200, "Đăng xuất thành công")
        );
    } catch (error) {
        return res.status(400).json(
            toAPIResponse(400, "Lỗi đăng xuất", null, { "Lỗi": error.message })
        );
    }
}

export const refresh = async (req, res) => {
    try {
        const { refreshToken } = req.body;
        const newTokens = await authService.refresh(refreshToken);
        return res.status(200).json(
            toAPIResponse(200, "Refresh Token thành công", newTokens)
        );
    } catch (error) {
        return res.status(401).json(
            toAPIResponse(401, "Refresh Token thất bại", null, { "Lỗi": error.message })
        );
    }
}
