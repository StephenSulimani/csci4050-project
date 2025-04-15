import { Column, DataType, ForeignKey, Model, PrimaryKey, Table } from "sequelize-typescript";
import User from "./User";

@Table
export default class Portfolio extends Model<Portfolio> {
    @PrimaryKey
    @Column({
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4,
    })
    declare public id: string;

    @Column({
        type: DataType.TEXT,
        allowNull: true
    })
    declare public name: string;

    @Column({
        type: DataType.FLOAT,
        defaultValue: 10000
    })
    declare public startingCapital: number;

    @ForeignKey(() => User)
    @Column({
        type: DataType.UUID
    })
    declare public user_id;
}
