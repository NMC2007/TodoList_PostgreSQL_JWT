import { EntitySchema } from "typeorm";

export const RefreshTokenSchema = new EntitySchema({
    name: "RefreshToken",
    tableName: "refresh_tokens",
    columns: {
        id: {
            primary: true,
            type: "int",
            generated: true,
        },
        token: {
            type: "varchar",
            length: 500,
            unique: true,
        },
        expiresAt: {
            type: "timestamp",
        },
        createdAt: {
            type: "timestamp",
            createDate: true,
        }
    },
    relations: {
        user: {
            type: "many-to-one",
            target: "User",
            joinColumn: { name: "userId" },
            inverseSide: "refreshTokens",
            onDelete: "CASCADE"
        }
    }
});
