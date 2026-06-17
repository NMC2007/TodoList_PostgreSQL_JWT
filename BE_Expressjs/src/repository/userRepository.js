import AppDataSource from "../config/db.js";
import { UserSchema } from "../models/entity/User.js";

const userRepo = AppDataSource.getRepository(UserSchema);

export const existsByEmail = async (email) => {
    try {
        return await userRepo.existsBy({ email });
    } catch (error) {
        throw new Error(error.message);
    }
}

export const existsByUserName = async (username) => {
    try {
        return await userRepo.existsBy({ username });
    } catch (error) {
        throw new Error(error.message);
    }
}

export const findByEmail = async (email) => {
    try {
        return await userRepo.findOneBy({ email });
    } catch (error) {
        throw new Error(error.message);
    }
}

export const findByUserName = async (username) => {
    try {
        return await userRepo.findOneBy({ username });
    } catch (error) {
        throw new Error(error.message);
    }
}

/**
 * CREATE - Tạo user mới
 */
export const create = async (userData) => {
    try {
        const user = userRepo.create(userData);
        return await userRepo.save(user);
    } catch (error) {
        throw new Error(error.message);
    }
}