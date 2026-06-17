import { EntitySchema } from "typeorm";

export const TaskSchema = new EntitySchema({
    name: "Task",
    tableName: "todolist",     // Mapping đúng với bảng hiện tại
    columns: {
        id: {
            primary: true,
            type: "int",
            generated: true,   // auto-increment
        },
        title: {
            type: "varchar",
            length: 255,
        },
        status: {
            type: "boolean",
            default: false,
        },
        created_at: {
            type: "timestamp",
            nullable: true,
            default: () => "CURRENT_TIMESTAMP",
        },
        completed_at: {
            type: "timestamp",
            nullable: true,
            default: null,
        },
        update_at: {
            type: "timestamp",
            nullable: true,
            default: null,
        },
    },

    // dùng để tham chiếu khoá ngoại
    relations: {
        // Nhiều Task thuộc về 1 User (ManyToOne)
        user: {
            type: "many-to-one",
            target: "User",
            joinColumn: { name: "user_id" },  // Tên cột FK trong bảng todolist
            nullable: true,                    // Cho phép task chưa gán user
            onDelete: "CASCADE",               // Xóa user → xóa luôn tasks
        },
    },
});
