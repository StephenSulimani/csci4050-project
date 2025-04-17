import { Table, Column, Model, PrimaryKey, DataType, Unique } from 'sequelize-typescript';

@Table
export default class User extends Model<User> {
    @PrimaryKey
    @Column({
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4,
    })
    declare public id: string;

    @Column({
        type: DataType.TEXT,
    })
    declare public name: string;

    @Unique
    @Column({
        type: DataType.STRING,
    })
    declare public email: string;

    @Column({
        type: DataType.STRING,
    })
    declare public password: string;
}
