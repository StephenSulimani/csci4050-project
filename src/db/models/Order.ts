import { DataType } from "sequelize-typescript";
import { sequelize } from "../connection";

const Order = sequelize.define('order', {
    id: {
        type: DataType.UUID,
        primaryKey: true,
        defaultValue: DataType.UUIDV4
    },
    ticker: {
      type: DataType.TEXT,
      validate: {
        isAlphanumeric: true,
        len: [1, 10]
      },
      unique: true
    },
    datetime: DataType.DATE,
    price: DataType.FLOAT,
    amount: DataType.FLOAT,
    type: DataType.ENUM('BUY', 'SELL'),
    user_id: {
      type: DataType.UUID,
      references: {
        model: 'user',
        key: 'id'
      }
    }
});

export default Order