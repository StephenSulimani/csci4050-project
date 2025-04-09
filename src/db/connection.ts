import { Sequelize } from "sequelize-typescript";
import pg from 'pg'
import User from "./models/User";
import Order from "./models/Order";

export const sequelize = new Sequelize({
    database: process.env.DB_NAME,
    dialect: 'postgres',
    dialectModule: pg,
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    dialectOptions: {
        ssl: {
            mode: 'require'
        }
    },
    models: [User, Order],
    //models: [__dirname + '/models'],
    logging: false
})

let authenticated = false;

export const connect = async () => {
    if (authenticated) {
        return;
    }
    try {
        await sequelize.authenticate();
        await sequelize.sync({ alter: true });
        console.log('Connection has been established successfully.');
        authenticated = true;
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}

