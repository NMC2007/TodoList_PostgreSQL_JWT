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
        const user = await authService.login(req.body);
        return res.status(200).json(
            toAPIResponse(200, "Đăng nhập thành công", user)
        );
    } catch (error) {
        return res.status(403).json(
            toAPIResponse(403, "Đăng nhập thất bại", null, { "Lỗi đăng nhập": error.message })
        );
    }
}
