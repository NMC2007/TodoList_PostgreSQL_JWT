import { verifyToken } from './jwtProvider.js';
import { toAPIResponse } from '../../models/dto/APIResponse.js';

export const jwtFilter = (req, res, next) => {
    // 1. Trích xuất token từ header
    const authHeader = req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        // Trả về 401 Unauthorized nếu không có token
        return res.status(401).json(
            toAPIResponse(401, "Truy cập bị từ chối", null, { "Xác thực": "Không tìm thấy Access Token" })
        );
    }

    const token = authHeader.split(' ')[1];

    // 2. Xác minh token
    const decoded = verifyToken(token, false);
    if (!decoded) {
        return res.status(401).json(
            toAPIResponse(401, "Phiên đăng nhập đã hết hạn hoặc không hợp lệ", null, { "Xác thực": "Token không hợp lệ" })
        );
    }

    // 3. Gán user info vào request và tiếp tục
    req.user = decoded;
    next();
};
