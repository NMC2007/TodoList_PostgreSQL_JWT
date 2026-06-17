import AppDataSource from "../config/db.js";
import { RefreshTokenSchema } from "../models/entity/RefreshToken.js";

const refreshTokenRepo = AppDataSource.getRepository(RefreshTokenSchema);

export const saveToken = async (userId, token, expiresAt) => {
    try {
        const newRefreshToken = refreshTokenRepo.create({
            token: token,
            expiresAt: expiresAt,
            user: { id: userId }
        });
        return await refreshTokenRepo.save(newRefreshToken);
    } catch (error) {
        throw new Error("Lỗi khi lưu Refresh Token: " + error.message);
    }
};

export const findByToken = async (token) => {
    try {
        return await refreshTokenRepo.findOne({
            where: { token },
            relations: ["user"] // Để lấy thông tin user liên kết
        });
    } catch (error) {
        throw new Error("Lỗi khi tìm Refresh Token: " + error.message);
    }
};

export const deleteByToken = async (token) => {
    try {
        const result = await refreshTokenRepo.delete({ token });
        return result.affected > 0;
    } catch (error) {
        throw new Error("Lỗi khi xóa Refresh Token: " + error.message);
    }
};

export const deleteExpiredTokens = async () => {
    try {
        const now = new Date();
        const qb = refreshTokenRepo.createQueryBuilder()
            .delete()
            .from(RefreshTokenSchema)
            .where("expiresAt < :now", { now });
        await qb.execute();
    } catch (error) {
        console.error("Lỗi xóa Refresh Token hết hạn: ", error.message);
    }
};
