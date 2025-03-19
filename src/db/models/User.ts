import { DataType } from "sequelize-typescript";
import { sequelize } from "../connection";

const User = sequelize.define('user', {
    id: {
        type: DataType.UUID,
        primaryKey: true,
        defaultValue: DataType.UUIDV4
    },
    name: DataType.TEXT,
    email: {
        type: DataType.STRING,
        unique: true
    },
    password: DataType.STRING,
});

export default User
