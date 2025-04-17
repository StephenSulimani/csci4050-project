import { Table, Column, Model, PrimaryKey, DataType, ForeignKey, Validate } from 'sequelize-typescript';
import Portfolio from './Portfolio';

@Table
export default class Order extends Model<Order> {
    @PrimaryKey
    @Column({
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4,
    })
    declare public id: string;

    @Validate({
        isAlphanumeric: true,
        len: [1, 10]
    })
    @Column({
        type: DataType.TEXT,
    })
    declare public ticker: string;

    @Column(DataType.DATE)
    declare public datetime: Date;

    @Column(DataType.FLOAT)
    declare public price: number;

    @Column(DataType.FLOAT)
    declare public amount: number;

    @Column(DataType.ENUM('BUY', 'SELL'))
    declare public type: 'BUY' | 'SELL';

    @ForeignKey(() => Portfolio)
    @Column({
        type: DataType.UUID,
    })
    declare public portfolio_id: string;
}
