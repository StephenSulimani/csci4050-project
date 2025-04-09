import { connect } from "@/db/connection";
import Order from "@/db/models/Order";
import User from "@/db/models/User";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
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

        const cash = await calcCash(user_id);
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
