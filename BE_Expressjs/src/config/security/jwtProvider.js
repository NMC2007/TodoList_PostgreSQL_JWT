import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || 'default_access_secret';
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'default_refresh_secret';

// Access Token hết hạn sau 15 phút
const ACCESS_TOKEN_EXPIRE = '15m';
// Refresh Token hết hạn sau 7 ngày
const REFRESH_TOKEN_EXPIRE = '7d';

export const generateAccessToken = (user) => {
    return jwt.sign(
        { id: user.id, username: user.username, email: user.email },
        ACCESS_SECRET,
        { expiresIn: ACCESS_TOKEN_EXPIRE }
    );
};

export const generateRefreshToken = (user) => {
    return jwt.sign(
        { id: user.id },
        REFRESH_SECRET,
        { expiresIn: REFRESH_TOKEN_EXPIRE }
    );
};

export const verifyToken = (token, isRefresh = false) => {
    try {
        const secret = isRefresh ? REFRESH_SECRET : ACCESS_SECRET;
        return jwt.verify(token, secret);
    } catch (error) {
        return null;
    }
};

export const getExpirationDate = (isRefresh = false) => {
    const date = new Date();
    if (isRefresh) {
        date.setDate(date.getDate() + 7); // 7 days
    } else {
        date.setMinutes(date.getMinutes() + 15); // 15 mins
    }
    return date;
};
