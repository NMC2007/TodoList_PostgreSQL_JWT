import { EntitySchema } from "typeorm";


export const UserSchema = new EntitySchema({
    name: "User",
    tableName: "users",
    columns: {
        id: {
            primary: true,
            type: "int",
            generated: true,   // auto-increment
        },
        username: {
            type: "varchar",
            length: 255,
            unique: false,
        },
        email: {
            type: "varchar",
            length: 255,
            unique: false,
        },
        password: {
            type: "varchar",
            length: 255,
        },
    },

    // dùng để tham chiếu khoá ngoại
    relations: {
        // 1 User có nhiều Tasks (OneToMany)
        tasks: {
            type: "one-to-many",
            target: "Task",
            inverseSide: "user",   // Tên relation bên Task
        },
        // 1 User có nhiều Refresh Tokens (OneToMany)
        refreshTokens: {
            type: "one-to-many",
            target: "RefreshToken",
            inverseSide: "user",
        }
    },
});