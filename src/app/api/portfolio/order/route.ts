import { connect } from "@/db/connection";
import Order from "@/db/models/Order";
import { NextResponse } from "next/server";
import { UniqueConstraintError } from "sequelize";

export const POST = async (req: Request) => {
    const body = await req.json();

    const { ticker, amount, type } = body;

    try {
        await connect();
        const datetime = new Date().toISOString();
        const price = await getPrice(ticker);
        const user_id = "1"; // Replace with actual user ID from authentication context
        const startingCash = 10000; // Replace with actual starting cash from user profile
        const cash = await calcCash(startingCash, user_id);
        if (type === 'BUY' && cash < price * amount) {
            return NextResponse.json({
                status: 0,
                error: 1,
                message: "Not enough cash to buy",
            })
        } else if (type === 'SELL') {
            const orders = await Order.findAll({
                where: {
                    user_id: user_id,
                    ticker: ticker,
                    type: 'BUY'
                }
            });
            let totalAmount = 0;
            for (const order of orders) {
                totalAmount += order.dataValues.amount;
            }
            if (totalAmount < amount) {
                return NextResponse.json({
                    status: 0,
                    error: 1,
                    message: "Not enough shares to sell",
                })
            }
        }

        await Order.create({
            ticker,
            amount,
            type,
            datetime, 
            price,
            user_id
        });
        return NextResponse.json({
            status: 1,
            error: 0,
            message: "Order issued successfully",
        })
    } catch (error: unknown) {
        return NextResponse.json({
            status: 0,
            error: 1,
            message: "Error creating order: " + (error as Error).message,
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
