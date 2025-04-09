import { connect } from "@/db/connection";
import Order from "@/db/models/Order";
import User from "@/db/models/User";
import { NextResponse } from "next/server";
import { UniqueConstraintError } from "sequelize";

export const POST = async (req: Request) => {
    const body = await req.json();

    const { ticker, amount, type } = body;

    const user_id = req.headers.get('x-user-id')

    if (!user_id) {
        return NextResponse.json({
            status: 0,
            error: 1,
            message: "You need to be authenticated"
        }, { status: 401 })
    }

    try {
        await connect();
        const datetime = new Date().toISOString();
        const price = await getPrice(ticker);
        const cash = await calcCash(user_id);
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

const calcCash = async (user_id: string) => {
    const user = await User.findOne({
        where: {
            id: user_id
        }
    })

    if (!user) {
        return
    }

    const orders = await Order.findAll({
        where: {
            user_id: user_id
        }
    });
    let cash = user.dataValues.startingCapital;
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
