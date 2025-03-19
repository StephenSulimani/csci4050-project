import { Column, CreatedAt, DataType, Model, Table, UpdatedAt } from "sequelize-typescript";

@Table({
    timestamps: true,
    tableName: "users",
    modelName: "User"
})

class User extends Model {
    @Column({
        primaryKey: true,
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4
    })
    declare id: string;

    @Column({
        type: DataType.STRING
    })
    declare email: string;

    @Column({
        type: DataType.STRING
    })
    declare password: string;

    @Column({
        type: DataType.STRING
    })
    declare name: string;

    @CreatedAt
    declare created_at: Date

    @UpdatedAt
    declare updated_at: Date
}


