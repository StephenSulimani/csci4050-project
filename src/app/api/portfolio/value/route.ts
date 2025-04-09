import { connect } from "@/db/connection";
import Order from "@/db/models/Order";
import { NextResponse } from "next/server";
import { UniqueConstraintError } from "sequelize";

export const GET = async (req: Request) => {
    const body = await req.json();

    const { user_id } = body;

    try {
        await connect();
        
        const startingCash = 10000; // Replace with actual starting cash from user profile
        const cash = await calcCash(startingCash, user_id);
        const stocks = await getStocks(user_id);
        const total_value = await getTotalValue(user_id, cash, stocks);
        
        return NextResponse.json({
            status: 1,
            error: 0,
            data: {
                cash,
                stocks,
                total_value,
            },
        })
    } catch (error: unknown) {
        return NextResponse.json({
            status: 0,
            error: 1,
            message: "Error calculating value: " + error,
        })
    }
}

const getPrice = async (ticker: string) => {
    const apiKey = process.env.FINNHUB_API_KEY;
    const url = `https://finnhub.io/api/v1/quote?symbol=${ticker}&token=${apiKey}`;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error("Network response was not ok");
        }
        const data = await response.json();
        return data.price;
    } catch (error) {
        console.error("Error fetching price:", error);
        throw new Error("Error fetching price");
    }
}

const calcCash = async (startingCash: number, user_id: string) => {
    const orders = await Order.findAll({
        where: {
            user_id: user_id
        }
    });
    let cash = startingCash;
    for (let order of orders) {
        order = order.dataValues;
        if (order.type === 'BUY') {
            cash -= order.price * order.amount;
        } else if (order.type === 'SELL') {
            cash += order.price * order.amount;
        }
    }
    return cash;
}

const getTotalValue = async (user_id: string, cash: number, stocks: { [key: string]: number }) => {
    let unrealized_gains = 0;
    for (let ticker in stocks) {
        const amount = stocks[ticker];
        if (amount > 0) {
            const price = await getPrice(ticker);
            unrealized_gains += amount * price;
        }
    }
    return cash + unrealized_gains;
}

const getStocks = async (user_id: string) => {
    const orders = await Order.findAll({
        where: {
            user_id: user_id
        }
    });
    const stocks = {};
    for (let order of orders) {
        order = order.dataValues;
        if (stocks[order.ticker] && order.type === 'BUY') {
            stocks[order.ticker] += order.amount;
        } else if (stocks[order.ticker] && order.type === 'SELL') {
            stocks[order.ticker] -= order.amount;
        } else if (order.type === 'BUY') {
            stocks[order.ticker] = order.amount;
        } else if (order.type === 'SELL') {
            stocks[order.ticker] = -order.amount;
        }
    }
    return stocks;
}
